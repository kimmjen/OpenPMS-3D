# 🐳 Local Database Setup Guide (로컬 DB 설정 가이드)

This guide explains how to set up a local PostgreSQL database using Docker and how to export/import SQL data.
이 가이드는 Docker를 사용하여 로컬 PostgreSQL 데이터베이스를 설정하고, SQL 데이터를 내보내기/가져오기 하는 방법을 설명합니다.

---

## 1. Prerequisites (준비 사항)

-   **Docker Desktop** or **Docker Compose** installed.
-   Python environment active (`venv`).

---

## 2. Running PostgreSQL with Docker (Docker로 실행)

We provide a `docker-compose.yml` file in `PMS-Core-Server/`.
`PMS-Core-Server/` 디렉토리에 제공된 `docker-compose.yml`을 사용합니다.

```bash
cd PMS-Core-Server
docker-compose up -d
```

*   **Host**: `localhost`
*   **Port**: `5432`
*   **User**: `user`
*   **Password**: `password`
*   **Database**: `pms_db`

---

## 3. Configuring Backend (백엔드 설정)

The backend (`reset_db.py` and `app`) defaults to SQLite. To use PostgreSQL, you need to set environment variables or modify `app/core/config.py`.
백엔드는 기본적으로 SQLite를 사용합니다. PostgreSQL을 사용하려면 환경 변수를 설정해야 합니다.

### Option A: Direct Code Modification (Temporary)
In `app/core/config.py` (or creation of `.env` file):

```env
DATABASE_URL=postgresql+asyncpg://user:password@localhost/pms_db
```

### Option B: Running `reset_db.py` with Postgres
Currently `reset_db.py` uses the default engine. To target Postgres, you might need to adjust the `DATABASE_URL` in `app/core/config.py` before running the script.

1.  **Modify `app/db/session.py` or `.env`** to point to Postgres.
2.  Run Reset Script:
    ```bash
    python reset_db.py
    ```
    *This will create tables and seed 1,400+ spots into the Docker Postgres DB.*

---

## 4. Exporting Data to .SQL (SQL 추출)

To share the database schema and data as a `.sql` file, use `pg_dump` via Docker.
데이터베이스 스키마와 데이터를 `.sql` 파일로 공유하려면 Docker를 통해 `pg_dump`를 사용하세요.

### Command (명령어)
```bash
# Export Structure + Data (구조 + 데이터)
docker exec -t pms-postgres pg_dump -U user pms_db > pms_dump.sql

# Export Structure Only (구조만)
docker exec -t pms-postgres pg_dump -U user -s pms_db > pms_schema.sql
```

### Importing .SQL (SQL 복원)
```bash
# Restore from file
cat pms_dump.sql | docker exec -i pms-postgres psql -U user -d pms_db
```

---

## 5. Testing (테스트)

Once the DB is running and seeded:
1.  Start Backend: `uvicorn app.main:app --reload`
2.  Check API: `curl http://localhost:8000/api/v1/maps/mall/stats`
