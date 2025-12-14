from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.db.session import get_db
from app.models.vehicle import Vehicle
from app.schemas.vehicle import VehicleCreate, VehicleResponse

router = APIRouter()

@router.post("/", response_model=VehicleResponse)
async def create_vehicle(vehicle: VehicleCreate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Vehicle).filter(Vehicle.plate_number == vehicle.plate_number))
    existing = result.scalars().first()
    if existing:
        raise HTTPException(status_code=400, detail="Vehicle already registered")
    
    db_vehicle = Vehicle(**vehicle.dict())
    db.add(db_vehicle)
    await db.commit()
    await db.refresh(db_vehicle)
    return db_vehicle

@router.get("/", response_model=List[VehicleResponse])
async def read_vehicles(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Vehicle).offset(skip).limit(limit))
    vehicles = result.scalars().all()
    return vehicles

@router.get("/{plate_number}", response_model=VehicleResponse)
async def read_vehicle(plate_number: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Vehicle).filter(Vehicle.plate_number == plate_number))
    vehicle = result.scalars().first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    return vehicle
