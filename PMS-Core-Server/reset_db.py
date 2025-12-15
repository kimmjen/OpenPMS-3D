import asyncio
import json
from app.db.session import engine
from app.db.base import Base
from sqlalchemy import text

async def reset_db():
    async with engine.begin() as conn:
        # 1. Drop & Create All Tables
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
        print("Database reset successfully.")

        # 2. Seed Pricing Policy
        await conn.execute(
            text("""
            INSERT INTO pricing_policies (policy_name, free_minutes, base_rate, unit_minutes, max_daily_fee, capacity, is_active)
            VALUES (:name, :free, :base, :unit, :max_fee, :cap, :active)
            """),
            {"name": "Default", "free": 30, "base": 1000, "unit": 60, "max_fee": 20000, "cap": 5, "active": True}
        )

        # 3. Seed Map Configs
        
        # Standard Setup
        standard_spots = [[-6, 0, -5], [-3, 0, -5], [0, 0, -5], [3, 0, -5], [6, 0, -5]]
        standard_misc = {
            "camera": {"position": [0, 15, 25], "fov": 50},
            "paths": {
                "entry_start": [-8, 0, 20],
                "entry_gate": [-8, 0, 12],
                "exit_gate": [2, 0, 12],
                "exit_end": [2, 0, 20]
            }
        }

        # Gangnam Setup
        gangnam_spots = [
             [-8, 0, -8], [-4, 0, -8], [0, 0, -8], [4, 0, -8], [8, 0, -8],
             [-8, 0, 0], [-4, 0, 0], [0, 0, 0], [4, 0, 0], [8, 0, 0]
        ]
        gangnam_misc = {
            "camera": {"position": [0, 25, 30], "fov": 55},
            "paths": {
                "entry_start": [-6, 0, 22],
                "entry_gate": [-6, 0, 12],
                "exit_gate": [6, 0, 12],
                "exit_end": [6, 0, 22]
            }
        }

        # --- The Hyundai Seoul (Parc1) Setup ---
        # Layout: Mega Scale Vertical Islands (Database Backed)
        # Capacity: ~400 rendered (representing 1000+)
        mall_camera = {"position": [0, 100, 120], "fov": 50} 
        mall_misc = {
            "camera": mall_camera, 
            "paths": {
                "entry_start": [0, 0, 65], # Center Entry
                "entry_gate": [0, 0, 55],
                "exit_gate": [10, 0, 55],
                "exit_end": [10, 0, 65]
            }
        }

        # Mall Spots (B3-B6) - Mega Vertical Islands Layout
        mall_spots = []
        floors = [-12, -18, -24, -30]
        
        # Define 8 Vertical Islands (X coordinates)
        # We span from -45 to 45 roughly
        island_x_centers = [-45, -35, -25, -15, 15, 25, 35, 45] 
        
        for y in floors:
            for island_x in island_x_centers:
                # Provide a strip of spots along Z axis
                # Z Range: -50 to 50
                for z in range(-48, 49, 4):
                    # Skip center cross aisle
                    if abs(z) < 6: continue 
                    
                    # Left side of island
                    mall_spots.append([island_x - 1.5, y, z])
                    # Right side of island
                    mall_spots.append([island_x + 1.5, y, z])

        # Insert Maps
        await conn.execute(
            text("""
            INSERT INTO map_configs (map_id, name, description, capacity, misc_config, is_active, base_rate, unit_minutes, free_minutes, max_daily_fee)
            VALUES (:id, :name, :desc, :cap, :config, :active, :base, :unit, :free, :max_fee)
            """),
            [
                {
                    "id": "standard", 
                    "name": "Standard Lot", 
                    "desc": "Basic 1-row parking lot", 
                    "cap": 5, 
                    "config": json.dumps(standard_misc), 
                    "active": True,
                    "base": 1000.0, "unit": 60, "free": 30, "max_fee": 20000.0
                },
                {
                    "id": "gangnam", 
                    "name": "Gangnam Tower", 
                    "desc": "2-row busy parking lot", 
                    "cap": 10, 
                    "config": json.dumps(gangnam_misc), 
                    "active": True,
                    "base": 1500.0, "unit": 10, "free": 5, "max_fee": 80000.0
                },
                {
                    "id": "mall", 
                    "name": "The Hyundai Seoul (Parc1)", 
                    "desc": "Mega Scale (B3-B6) | 1000+ Cap", 
                    "cap": 1000, 
                    "config": json.dumps(mall_misc), 
                    "active": True,
                    "base": 2000.0, "unit": 10, "free": 30, "max_fee": 50000.0
                }
            ]
        )

        # Insert Gates
        gates_data = [
            # Standard
            {"map_id": "standard", "type": "entry", "label": "ENTRY", "x": -8, "y": 0, "z": 12},
            {"map_id": "standard", "type": "exit", "label": "EXIT", "x": 2, "y": 0, "z": 12},
            # Gangnam
            {"map_id": "gangnam", "type": "entry", "label": "IN", "x": -6, "y": 0, "z": 12},
            {"map_id": "gangnam", "type": "exit", "label": "OUT", "x": 6, "y": 0, "z": 12},
            # Mall
            {"map_id": "mall", "type": "entry", "label": "MALL IN", "x": -5, "y": 0, "z": 15},
            {"map_id": "mall", "type": "exit", "label": "MALL OUT", "x": 5, "y": 0, "z": 15},
        ]
        
        await conn.execute(
            text("""
            INSERT INTO gates (map_id, gate_type, label, x, y, z)
            VALUES (:map_id, :type, :label, :x, :y, :z)
            """),
            gates_data
        )

        # Insert Spots
        spots_data = []
        # Standard Spots
        for i, pos in enumerate(standard_spots):
            spots_data.append({
                "map_id": "standard", "idx": i, "x": pos[0], "y": pos[1], "z": pos[2]
            })
        # Gangnam Spots
        for i, pos in enumerate(gangnam_spots):
            spots_data.append({
                "map_id": "gangnam", "idx": i, "x": pos[0], "y": pos[1], "z": pos[2]
            })

        # Mall Spots
        for i, pos in enumerate(mall_spots):
            spots_data.append({
                "map_id": "mall", "idx": i, "x": pos[0], "y": pos[1], "z": pos[2]
            })

            
        await conn.execute(
            text("""
            INSERT INTO parking_spots (map_id, spot_index, x, y, z)
            VALUES (:map_id, :idx, :x, :y, :z)
            """),
            spots_data
        )
        
        print("Seed data inserted (Normalized).")

if __name__ == "__main__":
    asyncio.run(reset_db())
