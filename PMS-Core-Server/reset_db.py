import asyncio
from app.db.session import engine
from app.db.base import Base
from app.models.pricing_policy import PricingPolicy
from sqlalchemy.future import select

async def reset_db():
    async with engine.begin() as conn:
        # 모든 테이블 삭제 후 재생성
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
        print("Database reset successfully.")

    # 기본 요금 정책 다시 추가
    async with engine.begin() as conn:
         # 세션 생성 대신 직접 커넥션으로 insert (간단히)
         # 하지만 ORM 모델을 쓰려면 세션이 편하므로, 여기서는 init_db와 비슷하게 처리하거나
         # main.py의 lifespan이 재시작 시 처리하도록 둡니다.
         pass

if __name__ == "__main__":
    asyncio.run(reset_db())