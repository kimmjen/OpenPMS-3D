from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

# Enhance model registry
import app.db.base  # noqa: F401

from app.core.config import settings
from app.api.api import api_router
from app.db.session import AsyncSessionLocal
from app.models.pricing_policy import PricingPolicy
from sqlalchemy.future import select

# Startup Event to seed data
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    async with AsyncSessionLocal() as db:
        result = await db.execute(select(PricingPolicy))
        policy = result.scalars().first()
        if not policy:
            default_policy = PricingPolicy(
                policy_name="Default Standard",
                free_minutes=15,
                base_rate=1000.0,
                unit_minutes=60,
                max_daily_fee=20000.0,
                re_entry_limit=10
            )
            db.add(default_policy)
            await db.commit()
            print("Default Pricing Policy seeded.")
    yield
    # Shutdown

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan
)

# Set all CORS enabled origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow ALL origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
async def root():
    return {"message": "Welcome to OpenPMS-3D Core Server", "status": "running"}

@app.get("/health")
async def health_check():
    return {"status": "ok"}
