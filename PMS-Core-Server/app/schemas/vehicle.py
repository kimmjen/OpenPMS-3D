from typing import Optional
from pydantic import BaseModel
from datetime import date

class VehicleBase(BaseModel):
    plate_number: str
    is_vip: bool = False
    memo: Optional[str] = None

class VehicleCreate(VehicleBase):
    registered_until: Optional[date] = None

class VehicleUpdate(VehicleBase):
    pass

class VehicleResponse(VehicleBase):
    id: int
    registered_until: Optional[date] = None

    class Config:
        from_attributes = True
