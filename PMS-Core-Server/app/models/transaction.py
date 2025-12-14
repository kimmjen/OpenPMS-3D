from sqlalchemy import Column, Integer, String, Boolean, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base_class import Base

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    
    event_id = Column(Integer, ForeignKey("parking_events.id"), nullable=False)
    event = relationship("ParkingEvent")

    fee_calculated = Column(Float, nullable=False)
    discount_applied = Column(Float, default=0.0)
    fee_paid = Column(Float, nullable=False)
    
    payment_method = Column(String, nullable=True) # CARD, CASH, APP
    transaction_time = Column(DateTime(timezone=True), server_default=func.now())
    
    is_paid = Column(Boolean, default=False)
