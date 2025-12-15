from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base_class import Base

class ParkingEvent(Base):
    __tablename__ = "parking_events"

    id = Column(Integer, primary_key=True, index=True)
    
    # Vehicle Relationship
    vehicle_id = Column(Integer, ForeignKey("vehicles.id"), nullable=False)
    vehicle = relationship("Vehicle")

    entry_time = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    exit_time = Column(DateTime(timezone=True), nullable=True)
    
    parking_spot = Column(String, nullable=True) # e.g., "A-1"
    map_id = Column(String, nullable=False, default="standard") # Linked map_id
    is_parked = Column(Boolean, default=True) # True: Parked, False: Exited
