from sqlalchemy import Column, Integer, String, JSON, Boolean, Float
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class MapConfig(Base):
    __tablename__ = "map_configs"

    id = Column(Integer, primary_key=True, index=True)
    map_id = Column(String, unique=True, index=True) # e.g., 'standard', 'gangnam'
    name = Column(String, nullable=False) # e.g., 'Standard Lot'
    description = Column(String, nullable=True)
    
    capacity = Column(Integer, default=5)

    # Per-Map Pricing Policy
    base_rate = Column(Float, default=1000.0)
    unit_minutes = Column(Integer, default=60)
    free_minutes = Column(Integer, default=30)
    max_daily_fee = Column(Float, default=20000.0)

    # Misc Config (Camera, Paths, etc.) - kept as JSON for now
    misc_config = Column(JSON, nullable=False, default={})
    
    is_active = Column(Boolean, default=True)

    # Relationships
    gates = relationship("Gate", back_populates="map", cascade="all, delete-orphan", lazy="selectin")
    spots = relationship("ParkingSpot", back_populates="map", cascade="all, delete-orphan", lazy="selectin")
