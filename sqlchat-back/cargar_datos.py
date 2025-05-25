import os
import time
import pandas as pd
import psycopg2

time.sleep(3)

CSV_PATH = "/csv/UFC_Records.csv"

df = pd.read_csv(CSV_PATH)
df.columns = ["id", "type_of_record", "rank", "name", "total"]

DB_HOST     = os.getenv("DB_HOST", "db")
DB_PORT     = int(os.getenv("DB_PORT", 5432))
DB_NAME     = os.getenv("DB_NAME", os.getenv("POSTGRES_DB", "sqlchat_db"))
DB_USER     = os.getenv("DB_USER", os.getenv("POSTGRES_USER", "postgres"))
DB_PASSWORD = os.getenv("DB_PASSWORD", os.getenv("POSTGRES_PASSWORD", ""))

conn = psycopg2.connect(
    host=DB_HOST,
    port=DB_PORT,
    dbname=DB_NAME,
    user=DB_USER,
    password=DB_PASSWORD,
)
cur = conn.cursor()

cur.execute("""
    CREATE TABLE IF NOT EXISTS records (
      id             INTEGER PRIMARY KEY,
      type_of_record TEXT,
      rank           INTEGER,
      name           TEXT,
      total          INTEGER
    )
""")

for _, row in df.iterrows():
    cur.execute("""
        INSERT INTO records (id, type_of_record, rank, name, total)
        VALUES (%s, %s, %s, %s, %s)
        ON CONFLICT (id) DO NOTHING
    """, (
        int(row["id"]),
        row["type_of_record"],
        int(row["rank"]),
        row["name"],
        int(row["total"]),
    ))

conn.commit()
cur.close()
conn.close()
print("Datos cargados con éxito")