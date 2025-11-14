from sqlalchemy.ext.asyncio import AsyncEngine, create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlmodel import SQLModel
from sqlmodel.ext.asyncio.session import AsyncSession

from graph.models.node import GraphNode
from graph.models.edge import GraphEdge
from graph.models.integration import GraphIntegration

from ..config import Config

async_engine: AsyncEngine  = create_async_engine(url=Config.DATABASE_URL, echo=True)

AsyncSessionLocal = sessionmaker(
    bind=async_engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

async def init_db() -> None:
    async with async_engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)
    print("✅ Database connected successfully!")  # Log for DB connection

async def get_session() -> AsyncSession:
    async with AsyncSessionLocal() as session:
        yield session