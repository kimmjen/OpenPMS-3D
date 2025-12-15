import asyncio
import asyncpg

async def create_database():
    try:
        # Connect to the default 'postgres' database
        conn = await asyncpg.connect(user='postgres', password='12341234', database='postgres', host='localhost', port=5432)
        
        # Check if database exists
        exists = await conn.fetchval("SELECT 1 FROM pg_database WHERE datname = 'pms'")
        
        if not exists:
            print("Creating database 'pms'...")
            # CREATE DATABASE cannot run inside a transaction block, so we use execute directly on specific connection logic if needed
            # But asyncpg acts differently. Let's close and reopen without transaction if needed or just execute.
            # actually asyncpg implicitly handles this, but CREATE DATABASE usually needs isolation level autocommit equivalent.
            # In asyncpg, we can just execute it, but need to be careful about transaction state.
            # It's better to close and connect with valid isolation if needed, but asyncpg defaults should be ok if we don't start a transaction.
            await conn.execute('CREATE DATABASE pms')
            print("Database 'pms' created successfully.")
        else:
            print("Database 'pms' already exists.")
            
        await conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(create_database())
