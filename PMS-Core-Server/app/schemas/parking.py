from typing import Optional
from pydantic import BaseModel
from datetime import datetime

# --- Entry ---
class EntryRequest(BaseModel):
    plate_number: str
    map_id: str = "standard"
    entry_gate_id: Optional[str] = "GATE-01"

class EntryResponse(BaseModel):
    event_id: int
    plate_number: str
    entry_time: datetime
    gate_open: bool = True
    message: str

# --- Status / Exit Check ---
class ParkingStatusResponse(BaseModel):
    plate_number: str
    entry_time: datetime
    duration_minutes: int
    base_fee: float
    discount: float
    total_fee: float
    is_paid: bool
    status: str # "PARKED", "PAID", "EXITED"

# --- Payment ---
class PaymentRequest(BaseModel):
    plate_number: str
    amount: float
    payment_method: str = "CARD" # CARD, MOBILE

class PaymentResponse(BaseModel):
    transaction_id: int
    paid_amount: float
    message: str
    success: bool

# --- Exit ---
class ExitRequest(BaseModel):
    plate_number: str
    exit_gate_id: Optional[str] = "GATE-OUT-01"

class ExitResponse(BaseModel):
    plate_number: str
    exit_time: datetime
    gate_open: bool
    message: str
