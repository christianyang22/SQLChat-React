import os
import time
import pandas as pd
import psycopg2

time.sleep(10)

df = pd.read_csv('csv/UFC_Records.csv')
df.columns = ['id', 'type_of_record', 'rank', 'name', 'total']

conn = psycopg2.connect(
    host=os.getenv("DB_HOST", "localhost"),
    dbname=os.getenv("DB_NAME", "sqlchatdb"),
    user=os.getenv("DB_USER", "postgres"),
    password=os.getenv("DB_PASS", "postgres"),
    port=5432
)

cur = conn.cursor()

for _, row in df.iterrows():
    cur.execute(
        """
        INSERT INTO records (id, type_of_record, rank, name, total)
        VALUES (%s, %s, %s, %s, %s)
        ON CONFLICT (id) DO NOTHING
        """,
        (row['id'], row['type_of_record'], row['rank'], row['name'], row['total'])
    )

conn.commit()
cur.close()
conn.close()
print("✅ Datos cargados con éxito")
