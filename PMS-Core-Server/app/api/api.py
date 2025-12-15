from fastapi import APIRouter
from app.api.endpoints import vehicles, parking, admin, maps, stats

api_router = APIRouter()

api_router.include_router(vehicles.router, prefix="/vehicles", tags=["vehicles"])
api_router.include_router(parking.router, prefix="/parking", tags=["parking"])
api_router.include_router(admin.router, prefix="/admin", tags=["admin"])
api_router.include_router(maps.router, prefix="/maps", tags=["maps"])
api_router.include_router(stats.router, tags=["stats"])
