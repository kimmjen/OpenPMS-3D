from typing import List, Union
from pydantic import AnyHttpUrl, validator
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "OpenPMS-3D Core Server"
    API_V1_STR: str = "/api/v1"
    
    # CORS Configuration
    # Allow all for development
    BACKEND_CORS_ORIGINS: List[str] = ["*"]

    @validator("BACKEND_CORS_ORIGINS", pre=True)
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)

    # Database
    # Default to SQLite for ease of initial development, can be overridden by env vars for Postgres
    DATABASE_URL: str = "postgresql+asyncpg://postgres:12341234@localhost:5432/pms"

    # Parking Lot Configuration
    MAX_CAPACITY: int = 5  # Total parking spots available

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
