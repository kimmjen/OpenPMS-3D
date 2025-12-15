from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from sqlalchemy import desc, func
from sqlalchemy.exc import IntegrityError
from datetime import datetime, timezone
import math
from typing import List, Optional
from pydantic import BaseModel

from app.core.config import settings
from app.db.session import get_db
from app.models.parking_event import ParkingEvent
from app.models.vehicle import Vehicle
from app.models.map_config import MapConfig
from app.models.transaction import Transaction
from app.schemas.parking import (
    EntryRequest, EntryResponse,
    ParkingStatusResponse,
    PaymentRequest, PaymentResponse,
    ExitRequest, ExitResponse
)

router = APIRouter()

async def get_active_event(db: AsyncSession, plate_number: str) -> ParkingEvent:
    # Find the most recent event for this plate that is still parked
    query = select(ParkingEvent).join(Vehicle).filter(
        Vehicle.plate_number == plate_number,
        ParkingEvent.is_parked == True
    ).order_by(desc(ParkingEvent.entry_time)).options(selectinload(ParkingEvent.vehicle))
    
    result = await db.execute(query)
    event = result.scalars().first()
    return event

async def get_or_create_vehicle(db: AsyncSession, plate_number: str) -> Vehicle:
    query = select(Vehicle).filter(Vehicle.plate_number == plate_number)
    result = await db.execute(query)
    vehicle = result.scalars().first()
    
    if not vehicle:
        try:
            vehicle = Vehicle(plate_number=plate_number)
            db.add(vehicle)
            await db.commit()
            await db.refresh(vehicle)
        except IntegrityError:
            await db.rollback()
            # Retry fetching
            result = await db.execute(query)
            vehicle = result.scalars().first()
            if not vehicle:
                # Should not happen unless delete race condition
                raise HTTPException(status_code=500, detail="Vehicle creation failed")
    
    return vehicle

async def calculate_parking_fee(db: AsyncSession, event: ParkingEvent) -> dict:
    # 1. Get Map Policy
    # If map_id is missing (legacy), fallback to standard or global policy?
    # New design: Pricing is in MapConfig
    map_id = event.map_id or "standard"
    
    query = select(MapConfig).filter(MapConfig.map_id == map_id)
    result = await db.execute(query)
    map_config = result.scalars().first()
    
    if not map_config:
        # Fallback to default hardcoded values if map config missing
        base_rate = 1000.0
        unit_minutes = 60
        free_minutes = 30
        max_daily_fee = 20000.0
    else:
        base_rate = map_config.base_rate
        unit_minutes = map_config.unit_minutes
        free_minutes = map_config.free_minutes
        max_daily_fee = map_config.max_daily_fee

    now = datetime.now(timezone.utc)
    entry_time = event.entry_time
    if entry_time.tzinfo is None:
        entry_time = entry_time.replace(tzinfo=timezone.utc)
        
    duration = (now - entry_time).total_seconds() / 60.0 # minutes
    
    fee = 0.0
    discount = 0.0
    
    # Check VIP
    vehicle = event.vehicle
    if vehicle.is_vip:
        return {"fee": 0.0, "discount": 0.0, "duration": int(duration), "status": "VIP"}

    # Free time
    if duration <= free_minutes:
        return {"fee": 0.0, "discount": 0.0, "duration": int(duration), "status": "FREE_TIME"}

    # Advanced Calculation (Daily Cap)
    daily_minutes = 24 * 60
    days = int(duration // daily_minutes)
    remaining_minutes = duration % daily_minutes

    daily_fee_total = days * max_daily_fee

    if days > 0:
        units = math.ceil(remaining_minutes / unit_minutes)
        remainder_fee = units * base_rate
        remainder_fee = min(remainder_fee, max_daily_fee)
        
        fee = daily_fee_total + remainder_fee
    else:
        billable_minutes = max(0, duration - free_minutes)
        units = math.ceil(billable_minutes / unit_minutes)
        fee = units * base_rate
        fee = min(fee, max_daily_fee)
    
    return {"fee": fee, "discount": discount, "duration": int(duration), "status": "PAYABLE"}

class ActiveEvent(BaseModel):
    plate_number: str
    map_id: str
    entry_time: datetime

@router.get("/events/active", response_model=List[ActiveEvent])
async def get_active_events(map_id: Optional[str] = None, db: AsyncSession = Depends(get_db)):
    query = select(ParkingEvent).filter(ParkingEvent.is_parked == True).options(selectinload(ParkingEvent.vehicle))
    if map_id:
        query = query.filter(ParkingEvent.map_id == map_id)
        
    result = await db.execute(query)
    events = result.scalars().all()
    
    return [
        ActiveEvent(
            plate_number=e.vehicle.plate_number, 
            map_id=e.map_id, 
            entry_time=e.entry_time
        ) for e in events
    ]
@router.post("/entry", response_model=EntryResponse)
async def entry_vehicle(req: EntryRequest, db: AsyncSession = Depends(get_db)):
    # 0. Get Map Config & Check Capacity
    map_query = select(MapConfig).filter(MapConfig.map_id == req.map_id)
    map_res = await db.execute(map_query)
    map_config = map_res.scalars().first()
    
    if not map_config:
        raise HTTPException(status_code=404, detail=f"Map {req.map_id} not found")

    count_query = select(func.count(ParkingEvent.id)).filter(
        ParkingEvent.is_parked == True,
        ParkingEvent.map_id == req.map_id # Filter by map!
    )
    count_res = await db.execute(count_query)
    current_count = count_res.scalar() or 0
    
    if current_count >= map_config.capacity:
        return EntryResponse(
            event_id=0,
            plate_number=req.plate_number,
            entry_time=datetime.now(),
            gate_open=False,
            message=f"FULL: {current_count}/{map_config.capacity}"
        )

    # 1. Check if already parked (Global check or Per Map? Let's assume Global for now, car can't be in 2 places)
    existing_event = await get_active_event(db, req.plate_number)
    if existing_event:
        return EntryResponse(
            event_id=existing_event.id,
            plate_number=req.plate_number,
            entry_time=existing_event.entry_time,
            gate_open=False,
            message="Already parked"
        )

    # 2. Get/Create Vehicle
    vehicle = await get_or_create_vehicle(db, req.plate_number)
    
    # 3. Create Event
    new_event = ParkingEvent(
        vehicle_id=vehicle.id, 
        parking_spot="TBD",
        map_id=req.map_id # Store map_id
    )
    db.add(new_event)
    await db.commit()
    await db.refresh(new_event)
    
    return EntryResponse(
        event_id=new_event.id,
        plate_number=req.plate_number,
        entry_time=new_event.entry_time,
        gate_open=True,
        message="Welcome"
    )

@router.get("/status/{plate_number}", response_model=ParkingStatusResponse)
async def check_status(plate_number: str, db: AsyncSession = Depends(get_db)):
    event = await get_active_event(db, plate_number)
    if not event:
        raise HTTPException(status_code=404, detail="Vehicle not found in parking lot")

    # Calculate Fee
    calc = await calculate_parking_fee(db, event)
    
    # Check payment status
    # Check if a successful transaction exists for this event
    t_query = select(Transaction).filter(
        Transaction.event_id == event.id,
        Transaction.is_paid == True
    )
    t_result = await db.execute(t_query)
    paid_tx = t_result.scalars().all()
    
    total_paid = sum(t.fee_paid for t in paid_tx)
    is_paid = total_paid >= calc['fee']
    
    return ParkingStatusResponse(
        plate_number=plate_number,
        entry_time=event.entry_time,
        duration_minutes=calc['duration'],
        base_fee=calc['fee'],
        discount=calc['discount'],
        total_fee=max(0, calc['fee'] - total_paid),
        is_paid=is_paid or calc['fee'] == 0,
        status="PAID" if is_paid else "PARKED"
    )

@router.post("/payment", response_model=PaymentResponse)
async def pay_fee(req: PaymentRequest, db: AsyncSession = Depends(get_db)):
    event = await get_active_event(db, req.plate_number)
    if not event:
        raise HTTPException(status_code=404, detail="Vehicle not found")
        
    calc = await calculate_parking_fee(db, event)
    fee_to_pay = calc['fee']
    
    if fee_to_pay <= 0:
        return PaymentResponse(
            transaction_id=0,
            paid_amount=0,
            success=True,
            message="No fee required"
        )
        
    # Process Payment (Simulation)
    tx = Transaction(
        event_id=event.id,
        fee_calculated=fee_to_pay,
        fee_paid=req.amount,
        payment_method=req.payment_method,
        is_paid=True # Assume success
    )
    db.add(tx)
    await db.commit()
    await db.refresh(tx)
    
    return PaymentResponse(
        transaction_id=tx.id,
        paid_amount=req.amount,
        success=True,
        message="Payment successful"
    )

@router.post("/exit", response_model=ExitResponse)
async def exit_vehicle(req: ExitRequest, db: AsyncSession = Depends(get_db)):
    event = await get_active_event(db, req.plate_number)
    if not event:
         raise HTTPException(status_code=404, detail="Vehicle not found")
         
    # Check Status (Fee paid?)
    calc = await calculate_parking_fee(db, event)
    
    # Check Transactions
    t_query = select(Transaction).filter(
        Transaction.event_id == event.id,
        Transaction.is_paid == True
    )
    t_result = await db.execute(t_query)
    paid_tx = t_result.scalars().all()
    total_paid = sum(t.fee_paid for t in paid_tx)
    
    remaining = calc['fee'] - total_paid
    
    # Allow exit if fee is 0 or paid, or within grace period (not implemented yet)
    if remaining > 0:
        return ExitResponse(
            plate_number=req.plate_number,
            exit_time=datetime.now(),
            gate_open=False,
            message=f"Please pay remaining fee: {remaining}"
        )
        
    # Process Exit
    event.exit_time = datetime.now(timezone.utc)
    event.is_parked = False
    await db.commit()
    
    return ExitResponse(
        plate_number=req.plate_number,
        exit_time=event.exit_time,
        gate_open=True,
        message="Goodbye"
    )
