# Import all the models, so that Base has them before being
# imported by Alembic
from app.db.base_class import Base  # noqa
from app.models.vehicle import Vehicle  # noqa
from app.models.parking_event import ParkingEvent  # noqa
from app.models.pricing_policy import PricingPolicy  # noqa
from app.models.transaction import Transaction  # noqa
from app.models.map_config import MapConfig  # noqa
from app.models.gate import Gate  # noqa
from app.models.parking_spot import ParkingSpot  # noqa
