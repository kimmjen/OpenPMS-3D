from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Optional, Any

from app.db.session import get_db
from app.models.map_config import MapConfig
from pydantic import BaseModel

router = APIRouter()

class MapListItem(BaseModel):
    map_id: str
    name: str
    description: Optional[str] = None
    capacity: int
    
    # Pricing
    base_rate: Optional[float] = None
    unit_minutes: Optional[int] = None
    free_minutes: Optional[int] = None
    max_daily_fee: Optional[float] = None
    
    class Config:
        orm_mode = True

class GateItem(BaseModel):
    id: int
    gate_type: str # entry, exit
    label: Optional[str] = None
    x: float
    y: float
    z: float
    class Config:
        orm_mode = True

class SpotItem(BaseModel):
    id: int
    spot_index: int
    x: float
    y: float
    z: float
    class Config:
        orm_mode = True

class MapDetail(MapListItem):
    misc_config: Any
    gates: List[GateItem] = []
    spots: List[SpotItem] = []
    
    class Config:
        orm_mode = True

class MapUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    capacity: Optional[int] = None
    
    # Pricing Update
    base_rate: Optional[float] = None
    unit_minutes: Optional[int] = None
    free_minutes: Optional[int] = None
    max_daily_fee: Optional[float] = None

@router.get("/", response_model=List[MapListItem])
async def get_maps(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(MapConfig).filter(MapConfig.is_active == True))
    return result.scalars().all()

@router.get("/{map_id}", response_model=MapDetail)
async def get_map_detail(map_id: str, db: AsyncSession = Depends(get_db)):
    # relationship loading is handled by lazy="selectin" in model
    result = await db.execute(select(MapConfig).filter(MapConfig.map_id == map_id))
    map_config = result.scalars().first()
    if not map_config:
        raise HTTPException(status_code=404, detail="Map not found")
    return map_config

@router.put("/{map_id}", response_model=MapListItem)
async def update_map(map_id: str, map_in: MapUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(MapConfig).filter(MapConfig.map_id == map_id))
    map_config = result.scalars().first()
    
    if not map_config:
        raise HTTPException(status_code=404, detail="Map not found")
        
    if map_in.name is not None:
        map_config.name = map_in.name
    if map_in.description is not None:
        map_config.description = map_in.description
    if map_in.capacity is not None:
        map_config.capacity = map_in.capacity
        
    # Pricing Updates
    if map_in.base_rate is not None:
        map_config.base_rate = map_in.base_rate
    if map_in.unit_minutes is not None:
        map_config.unit_minutes = map_in.unit_minutes
    if map_in.free_minutes is not None:
        map_config.free_minutes = map_in.free_minutes
    if map_in.max_daily_fee is not None:
        map_config.max_daily_fee = map_in.max_daily_fee
        
    await db.commit()
    await db.refresh(map_config)
    return map_config
