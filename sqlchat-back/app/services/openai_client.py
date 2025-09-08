from openai import AsyncOpenAI
from app.core.config import settings
import textwrap
import re

client = AsyncOpenAI(api_key=settings.openai_api_key)

SQL_SYSTEM_TMPL = """
Eres un GENERADOR DE SQL. Devuelve UNA ÚNICA sentencia SQL válida que responda a la pregunta.

REGLAS ESTRICTAS
- Usa solo tablas y columnas que aparezcan en el ESQUEMA. No inventes identificadores.
- Si el usuario escribe un nombre aproximado (singular/plural, mayúsculas, espacios, typos),
  mapea al identificador MÁS PARECIDO dentro del ESQUEMA.
- Si un identificador tiene mayúsculas o espacios, cítalo:
  • PostgreSQL/SQLite: "Identificador"
  • MySQL/MariaDB: `Identificador`
- Comparaciones de texto robustas:
  • LOWER(...), REPLACE(...,' ','')
  • (si existe) UNACCENT(...)
  Ejemplo: LOWER(REPLACE(col,' ','')) = LOWER(REPLACE('total fights',' ',''))

- Si piden conteos: COUNT()
- Si piden ordenar: ORDER BY
- Si piden limitar: LIMIT

PROHIBIDO
- Cualquier explicación, disculpa o texto adicional.
- Envolver la sentencia en bloques ``` o añadir comentarios.

ESQUEMA:
{schema}

PREGUNTA:
{question}

SQL:
"""

CHAT_SYSTEM_TMPL = """
Eres un asistente conversacional de propósito general.
Responde en español, de manera clara y concisa, a la consulta del usuario.
Pregunta:
{question}
"""

_SQL_HEAD = re.compile(r"^\s*(SELECT|INSERT|UPDATE|DELETE|CREATE|DROP|ALTER|TRUNCATE)\b", re.I)

def _looks_like_sql(s: str) -> bool:
    return bool(_SQL_HEAD.match((s or "").strip()))

async def ask_openai(question: str, schema: str) -> str:
    if schema and schema.strip():
        sys_msg = SQL_SYSTEM_TMPL.format(
            schema=textwrap.shorten(schema, 15000),
            question=question
        )
        resp = await client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "system", "content": sys_msg}],
            temperature=0,
        )
        out = (resp.choices[0].message.content or "").strip()
        if not _looks_like_sql(out):
            raise ValueError("El modelo no devolvió una sentencia SQL válida.")
        return out

    sys_msg = CHAT_SYSTEM_TMPL.format(question=question)
    resp = await client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": sys_msg},
            {"role": "user", "content": question},
        ],
        temperature=0,
    )
    return (resp.choices[0].message.content or "").strip()