from sqlalchemy import Column, Integer, String, Float, Date
from .database import Base

class Donation(Base):
    """
    SQLAlchemy ORM model representing a single donation record.

    Attributes:
        id (int): Primary key identifier for each donation.
        donor_name (str): Name of the donor. Required field.
        donation_type (str): Category of donation (money, food, clothing, supplies, etc.).
        amount (float): Donation amount or quantity, depending on the type.
        date (date): The date the donation was made.
    """
    __tablename__ = "donations"

    id = Column(Integer, primary_key=True, index=True)
    donor_name = Column(String, nullable=False, index=True)
    donation_type = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    date = Column(Date, nullable=False)
