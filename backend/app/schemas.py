import datetime as dt
from typing import Optional, Literal
from pydantic import BaseModel, Field, constr

DonationType = Literal["money", "food", "clothing", "other"]

class DonationBase(BaseModel):
    donor_name: constr(strip_whitespace=True, min_length=1) = Field(..., examples=["Jane Doe"])
    donation_type: DonationType = Field(..., examples=["money"])
    amount: float = Field(..., gt=0, examples=[100.0])  # positive number
    date: dt.date = Field(..., examples=["2025-10-07"])  # use dt.date to avoid name clash

class DonationCreate(DonationBase):
    pass

class DonationUpdate(BaseModel):
    donor_name: Optional[str] = None
    donation_type: Optional[DonationType] = None
    amount: Optional[float] = None
    date: Optional[dt.date] = None

class DonationRead(DonationBase):
    id: int

    # pydantic v2 replacement for orm_mode
    model_config = {"from_attributes": True}
