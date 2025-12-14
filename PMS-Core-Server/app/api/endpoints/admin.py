from datetime import datetime
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import delete

from app.db.session import get_db
from app.models.parking_event import ParkingEvent
from app.models.vehicle import Vehicle
from app.models.pricing_policy import PricingPolicy
from app.models.transaction import Transaction
from app.schemas.parking import ParkingStatusResponse

router = APIRouter()

from sqlalchemy.orm import selectinload

# ...

@router.get("/status", response_model=List[dict])
async def get_all_parking_status(db: AsyncSession = Depends(get_db)):
    # Get all active parking events with vehicle loaded
    query = select(ParkingEvent).filter(ParkingEvent.is_parked == True).options(selectinload(ParkingEvent.vehicle))
    result = await db.execute(query)
    events = result.scalars().all()
    
    status_list = []
    for event in events:
        status_list.append({
            "event_id": event.id,
            "plate_number": event.vehicle.plate_number,
            "entry_time": event.entry_time,
            "parking_spot": event.parking_spot
        })
    return status_list

@router.delete("/vehicle/{plate_number}")
async def force_exit_vehicle(plate_number: str, db: AsyncSession = Depends(get_db)):
    # Force delete active events for this vehicle
    # 1. Find vehicle
    v_query = select(Vehicle).filter(Vehicle.plate_number == plate_number)
    v_res = await db.execute(v_query)
    vehicle = v_res.scalars().first()
    
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")

    # 2. Delete or Close Events
    # Option A: Delete (Clean slate)
    e_query = select(ParkingEvent).filter(ParkingEvent.vehicle_id == vehicle.id)
    e_res = await db.execute(e_query)
    events = e_res.scalars().all()
    
    for event in events:
        # Delete related transactions first
        await db.execute(delete(Transaction).where(Transaction.event_id == event.id))
        await db.delete(event)
        
    await db.commit()
    return {"message": f"Vehicle {plate_number} forced out and history deleted."}

@router.post("/reset")
async def reset_system(db: AsyncSession = Depends(get_db)):
    # Delete All Data
    await db.execute(delete(Transaction))
    await db.execute(delete(ParkingEvent))
    await db.execute(delete(Vehicle))
    # Reset Policy if needed (optional, keeping it for now)
    await db.commit()
    return {"message": "System Reset Complete. All vehicles removed."}

@router.get("/policy")
async def get_policy(db: AsyncSession = Depends(get_db)):
    query = select(PricingPolicy).filter(PricingPolicy.is_active == True)
    result = await db.execute(query)
    policy = result.scalars().first()
    return policy

@router.put("/policy")
async def update_policy(policy_data: dict, db: AsyncSession = Depends(get_db)):
    query = select(PricingPolicy).filter(PricingPolicy.is_active == True)
    result = await db.execute(query)
    policy = result.scalars().first()
    
    if policy:
        if 'base_rate' in policy_data: policy.base_rate = policy_data['base_rate']
        if 'free_minutes' in policy_data: policy.free_minutes = policy_data['free_minutes']
        if 'unit_minutes' in policy_data: policy.unit_minutes = policy_data['unit_minutes']
        if 'capacity' in policy_data: policy.capacity = policy_data['capacity']
        if 'max_daily_fee' in policy_data: policy.max_daily_fee = policy_data['max_daily_fee']
        await db.commit()
        await db.refresh(policy)
    return policy

@router.patch("/event/{event_id}/entry-time")
async def update_entry_time(event_id: int, entry_time: str, db: AsyncSession = Depends(get_db)):
    # Parse entry_time string (ISO format expected from frontend)
    try:
        # Handle simple ISO format
        new_time = datetime.fromisoformat(entry_time.replace("Z", "+00:00"))
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format")

    query = select(ParkingEvent).filter(ParkingEvent.id == event_id)
    result = await db.execute(query)
    event = result.scalars().first()
    
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
        
    event.entry_time = new_time
    await db.commit()
    await db.refresh(event)
    return {"message": "Entry time updated", "new_time": event.entry_time}