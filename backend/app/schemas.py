import datetime as dt
from typing import Optional, Literal
from pydantic import BaseModel, Field, constr

DonationType = Literal["money", "food", "clothing", "other"]

class DonationBase(BaseModel):
    """
    Base Pydantic schema for donation data.

    Attributes:
        donor_name (str): Name of the donor. Must be at least 1 character long.
        donation_type (str): Type of donation — one of "money", "food", "clothing", or "other".
        amount (float): Amount or quantity donated. Must be a positive number.
        date (datetime.date): Date when the donation was made.
    """
    donor_name: constr(strip_whitespace=True, min_length=1) = Field(..., description="Name of the donor")
    donation_type: DonationType = Field(..., description="Type of donation (money, food, clothing, other)")
    amount: float = Field(..., gt=0, description="Amount or quantity donated (must be positive)")  # positive number
    date: dt.date = Field(..., description="Date of the donation (YYYY-MM-DD)")  # use dt.date to avoid name clash

class DonationCreate(DonationBase):
    """
    Schema for creating a new donation record.

    Inherits all required fields from DonationBase.
    """
    pass

class DonationUpdate(BaseModel):
    """
    Schema for updating an existing donation record.

    All fields are optional to support partial updates (PATCH-like behavior).
    """
    donor_name: Optional[str] = Field(None, description="Updated donor name")
    donation_type: Optional[DonationType] = Field(None, description="Updated donation type")
    amount: Optional[float] = Field(None, description="Updated donation amount or quantity")
    date: Optional[dt.date] = Field(None, description="Updated donation date")

class DonationRead(DonationBase):
    """
    Schema for reading donation records from the database.

    Includes the primary key `id` and inherits all fields from DonationBase.
    """
    id: int = Field(..., description="Unique identifier for the donation")

    model_config = {"from_attributes": True}
