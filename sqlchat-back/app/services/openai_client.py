from openai import AsyncOpenAI
from app.core.config import settings
import textwrap

client = AsyncOpenAI(api_key=settings.openai_api_key)

SYSTEM_TMPL = """\
Eres un asistente que traduce lenguaje natural a SQL **sin explicar nada**.
Devuelve únicamente la sentencia.
Esquema disponible:
{schema}
"""

async def ask_openai(question: str, schema: str) -> str:
    sys_msg = SYSTEM_TMPL.format(schema=textwrap.shorten(schema, 15_000))
    resp = await client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": sys_msg},
            {"role": "user",   "content": question},
        ],
        temperature=0,
    )
    return resp.choices[0].message.content.strip()