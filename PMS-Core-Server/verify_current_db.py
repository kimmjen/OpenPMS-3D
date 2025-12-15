import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from app.core.config import settings

async def check_connection():
    print(f"Configured DATABASE_URL: {settings.DATABASE_URL}")
    
    if "sqlite" in settings.DATABASE_URL:
        print("Backend is configured to use SQLite.")
    elif "postgresql" in settings.DATABASE_URL:
        print("Backend is configured to use PostgreSQL.")
    
    try:
        engine = create_async_engine(settings.DATABASE_URL)
        async with engine.connect() as conn:
            from sqlalchemy import text
            result = await conn.execute(text("SELECT current_database()"))
            db_name = result.scalar()
            print(f"Successfully connected to database: '{db_name}'")
    except Exception as e:
        print(f"Connection failed: {e}")

if __name__ == "__main__":
    asyncio.run(check_connection())
