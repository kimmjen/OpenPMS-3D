from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class Gate(Base):
    __tablename__ = "gates"

    id = Column(Integer, primary_key=True, index=True)
    map_id = Column(String, ForeignKey("map_configs.map_id"), nullable=False)
    
    gate_type = Column(String, nullable=False) # 'entry' or 'exit'
    label = Column(String, nullable=True)
    
    x = Column(Float, nullable=False)
    y = Column(Float, nullable=False)
    z = Column(Float, nullable=False)
    
    # Relationship
    map = relationship("MapConfig", back_populates="gates")
