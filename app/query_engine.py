import os
import psycopg2
import pandas as pd
from openai import OpenAI
from dotenv import load_dotenv

# Eliminar variable problemática si existe
if "SSL_CERT_FILE" in os.environ:
    del os.environ["SSL_CERT_FILE"]

# Cargar variables de entorno (.env)
load_dotenv()

# Cliente OpenAI actualizado
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def generar_sql(mensaje_usuario, esquema="Tabla: records (id, type_of_record, rank, name, total)"):
    prompt = f"""Dado el siguiente esquema de base de datos:

{esquema}

Y el siguiente mensaje del usuario:
\"{mensaje_usuario}\"

Devuelve solo la consulta SQL correspondiente sin explicación."""

    respuesta = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}]
    )
    return respuesta.choices[0].message.content.strip()

def ejecutar_sql(sql):
    conn = psycopg2.connect(
        dbname="sqlchatdb",
        user="postgres",
        password="postgres",
        host="localhost",
        port="5438"
    )
    cur = conn.cursor()
    cur.execute(sql)
    if cur.description:
        columnas = [desc[0] for desc in cur.description]
        datos = cur.fetchall()
        conn.close()
        return pd.DataFrame(datos, columns=columnas)
    else:
        conn.commit()
        conn.close()
        return "✅ Cambios aplicados correctamente."