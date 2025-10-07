from sqlalchemy import Column, Integer, String, Float, Date
from .database import Base

class Donation(Base):
    __tablename__ = "donations"

    id = Column(Integer, primary_key=True, index=True)
    donor_name = Column(String, nullable=False, index=True)
    donation_type = Column(String, nullable=False)  # money, food, clothing, etc.
    amount = Column(Float, nullable=False)          # quantity or amount
    date = Column(Date, nullable=False)
