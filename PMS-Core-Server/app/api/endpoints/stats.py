from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import func
from sqlalchemy.future import select
from app.db.session import get_db
from app.models.parking_event import ParkingEvent
from app.models.parking_spot import ParkingSpot
from typing import Dict, Any

router = APIRouter()

@router.get("/maps/{map_id}/stats", response_model=Dict[str, Any])
async def get_map_stats(map_id: str, db: AsyncSession = Depends(get_db)):
    """
    Get aggregated statistics for a map, grouped by floor (Y coordinates).
    Async version.
    """
    # 1. Get Total Spots per Floor
    # Group spots by Y coordinate
    stmt = select(
        ParkingSpot.y, 
        func.count(ParkingSpot.id)
    ).where(
        ParkingSpot.map_id == map_id
    ).group_by(ParkingSpot.y)
    
    result = await db.execute(stmt)
    total_spots_query = result.all()

    stats = {}
    for y_level, count in total_spots_query:
        # Convert float Y to string key
        key = str(int(y_level)) 
        stats[key] = {"total": count, "occupied": 0}

    # 2. Get Occupied Spots per Floor
    # In Async, we can't easily do lazy loading or complex python-side loop DB calls efficiently.
    # We should query all active events first.
    
    events_stmt = select(ParkingEvent).where(
        ParkingEvent.map_id == map_id,
        ParkingEvent.is_parked == True
    )
    result = await db.execute(events_stmt)
    active_events = result.scalars().all()

    # Get indexes of occupied spots
    occupied_indexes = [int(e.parking_spot) for e in active_events if e.parking_spot and e.parking_spot.isdigit()]
    
    if occupied_indexes:
        occupied_counts_stmt = select(
            ParkingSpot.y, 
            func.count(ParkingSpot.id)
        ).where(
            ParkingSpot.map_id == map_id,
            ParkingSpot.spot_index.in_(occupied_indexes)
        ).group_by(ParkingSpot.y)
        
        result = await db.execute(occupied_counts_stmt)
        occupied_counts = result.all()
        
        for y_level, count in occupied_counts:
            key = str(int(y_level))
            if key in stats:
                stats[key]["occupied"] = count

    return {"floors": stats}
