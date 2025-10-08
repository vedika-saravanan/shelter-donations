from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase

DATABASE_URL = "sqlite:///./donations.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

class Base(DeclarativeBase):
    """
    Declarative base class for all SQLAlchemy ORM models.

    All database models in this application should inherit from this Base class.
    It provides SQLAlchemy with metadata required to create tables and relationships.
    """
    pass

def get_db():
    """
    Dependency function that provides a database session to FastAPI endpoints.

    This function creates a new SQLAlchemy session for each request and ensures
    that the session is properly closed after the request is processed.

    Yields:
        Session: An active SQLAlchemy database session.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
