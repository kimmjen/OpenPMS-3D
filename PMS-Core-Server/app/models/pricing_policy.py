from sqlalchemy import Column, Integer, String, Boolean, Float
from app.db.base_class import Base

class PricingPolicy(Base):
    __tablename__ = "pricing_policies"

    id = Column(Integer, primary_key=True, index=True)
    policy_name = Column(String, nullable=False)
    
    free_minutes = Column(Integer, default=15) # First N minutes free
    base_rate = Column(Float, default=1000.0) # Rate per hour (or base unit)
    unit_minutes = Column(Integer, default=60) # Base unit in minutes (e.g., 60 mins)
    
    max_daily_fee = Column(Float, default=20000.0)
    
    re_entry_limit = Column(Integer, default=10) # Minutes to restrict re-entry after free exit
    
    capacity = Column(Integer, default=5) # Total Parking Spots
    
    is_active = Column(Boolean, default=True)
