from sqlalchemy import Column, Integer, String, Boolean, Date
from app.db.base_class import Base

class Vehicle(Base):
    __tablename__ = "vehicles"

    id = Column(Integer, primary_key=True, index=True)
    plate_number = Column(String, unique=True, index=True, nullable=False)
    is_vip = Column(Boolean, default=False)
    registered_until = Column(Date, nullable=True)
    memo = Column(String, nullable=True)
