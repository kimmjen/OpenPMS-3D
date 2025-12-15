from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class ParkingSpot(Base):
    __tablename__ = "parking_spots"

    id = Column(Integer, primary_key=True, index=True)
    map_id = Column(String, ForeignKey("map_configs.map_id"), nullable=False)
    
    spot_index = Column(Integer, nullable=False)
    
    x = Column(Float, nullable=False)
    y = Column(Float, nullable=False)
    z = Column(Float, nullable=False)
    
    # Relationship
    map = relationship("MapConfig", back_populates="spots")
