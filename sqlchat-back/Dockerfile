FROM python:3.13-alpine AS builder

RUN apk add --no-cache \
        build-base \
        postgresql-dev \
        mariadb-dev \
        mysql-dev \
        sqlite-dev \
        libffi-dev \
        openssl-dev \
        curl

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt --prefix=/install

FROM python:3.13-alpine

COPY --from=builder /install /usr/local
COPY . /app
WORKDIR /app

EXPOSE 8000
CMD ["sh", "-c", "alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"]