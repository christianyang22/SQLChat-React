import streamlit as st
from query_engine import generar_sql, ejecutar_sql

st.set_page_config(page_title="Chatbot SQL", layout="centered")
st.title("🧠 Chatbot de lenguaje natural para PostgreSQL")

pregunta = st.text_input("Introduce tu consulta en lenguaje natural:")

if pregunta:
    st.info("⌛ Generando consulta SQL con OpenAI...")
    sql = generar_sql(pregunta)
    st.code(sql, language="sql")

    if sql.lower().startswith("select"):
        try:
            resultado = ejecutar_sql(sql)
            st.success("✅ Resultado de la consulta:")
            st.dataframe(resultado)
        except Exception as e:
            st.error(f"❌ Error al ejecutar la consulta: {e}")
    else:
        if st.button("💾 Confirmar ejecución de la modificación"):
            try:
                respuesta = ejecutar_sql(sql)
                st.success(respuesta)
            except Exception as e:
                st.error(f"❌ Error al ejecutar la modificación: {e}")
