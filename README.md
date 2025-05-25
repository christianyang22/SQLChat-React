# SQLChat – Chatbot de consultas SQL mediante lenguaje natural

Este proyecto forma parte del Trabajo de Fin de Grado en Ingeniería Informática. SQLChat es una aplicación web que permite a los usuarios realizar consultas a bases de datos SQL utilizando lenguaje natural, gracias a la integración con modelos de lenguaje (LLM). Está diseñada para ejecutarse en local y presenta una interfaz funcional orientada a facilitar la conexión, consulta y visualización de datos.

## Funcionalidades principales

- Conexión a diferentes motores de base de datos (PostgreSQL, MySQL, MariaDB, SQLite).
- Conversión de consultas en lenguaje natural a SQL.
- Validación previa antes de ejecutar modificaciones sobre la base de datos.
- Gestión de múltiples conexiones desde una vista lateral.
- Visualización de resultados tabulares.
- Tema oscuro activado por defecto y configurable por el usuario.
- Autenticación mediante JWT.
- Sistema de preferencias personalizadas y edición de perfil.

## Tecnologías utilizadas

**Frontend**

- Next.js 13+
- React
- TypeScript
- TailwindCSS
- Context API
- Lucide-react

**Backend**

- FastAPI (Python)
- SQLAlchemy
- Alembic (migraciones)
- psycopg2 (conector PostgreSQL)
- JWT (autenticación)
- Passlib (encriptación de contraseñas)
- Pydantic

**Infraestructura**

- Docker
- Docker Compose
- PostgreSQL

**Otros**

- dotenv (gestión de entorno)
- Pandas (ETL de carga inicial)

## Capturas de pantalla

[Espacio reservado para incluir imágenes del sistema en funcionamiento: conexión, consulta, resultados, configuración]

## Instrucciones de instalación y ejecución local

Requisitos:
- Docker y Docker Compose
- Node.js (solo si se desea desarrollar el frontend de forma independiente)

Pasos:

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/usuario/sqlchat-tfg.git
   cd sqlchat-tfg
   ```

2. Ejecutar la aplicación:
   ```bash
   docker-compose up --build
   ```

3. Acceso por defecto:
   - Frontend: http://localhost:3000
   - Backend (FastAPI docs): http://localhost:8001/docs

Si se desea ejecutar el frontend por separado:
```bash
cd sqlchat-front
npm install
npm run dev
```

Para el backend sin docker:
```bash
cd sqlchat-back
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Estructura del proyecto

```
sqlchat-tfg/
├── sqlchat-front/       # Interfaz de usuario
├── sqlchat-back/        # API REST y lógica del chatbot
├── docker-compose.yml   # Orquestación de contenedores
├── README.md            # Documentación principal
```

## Referencias técnicas

- https://fastapi.tiangolo.com/
- https://www.sqlalchemy.org/
- https://alembic.sqlalchemy.org/
- https://pydantic-docs.helpmanual.io/
- https://www.postgresql.org/docs/
- https://www.docker.com/
- https://docs.docker.com/compose/
- https://nextjs.org/docs
- https://reactjs.org/docs/getting-started.html
- https://tailwindcss.com/docs
- https://jwt.io/introduction
- https://www.passlib.org/
- https://pandas.pydata.org/

## Licencia

Este proyecto está licenciado bajo la Licencia MIT. Está permitido su uso, modificación y redistribución con fines académicos o personales.

## Autor

Christian Jonathan Yang Gonzalez  
Grado en Ingeniería Informática  
Universidad Europea de Madrid  
Curso académico 2024–2025
