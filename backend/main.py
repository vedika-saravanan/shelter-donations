from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import date

# --- 1. Pydantic Data Models (for strong validation) ---

class DonationBase(BaseModel):
    """Base model for donation data (used for creation/update)."""
    donorName: str = Field(..., example="Jane Doe")
    type: str = Field(..., example="Money")
    quantity: float = Field(..., gt=0, description="Amount or quantity, must be positive.")
    date: date = Field(..., description="Date of the donation (YYYY-MM-DD format).")

class Donation(DonationBase):
    """Full model including the unique ID."""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))

    class Config:
        # Allows conversion from ORM/dict keys to model fields (e.g., id)
        from_attributes = True

# --- 2. In-Memory Database and Initialization ---

donations_db: List[Donation] = []

# Initial dummy data
donations_db.append(Donation(
    donorName="Initial Donor",
    type="Food",
    quantity=50.0,
    date=date.today(),
    id="initial-1"
))

# --- 3. FastAPI App Configuration ---

app = FastAPI(
    title="Shelter Donation API",
    description="Simple REST API to manage donation inventory."
)

# Configure CORS to allow communication from the React frontend (usually runs on port 3000)
origins = [
    "http://localhost:3000",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 4. API Endpoints (CRUD) ---

@app.get("/api/donations", response_model=List[Donation])
def read_donations():
    """Retrieve a list of all recorded donations."""
    return donations_db

@app.post("/api/donations", response_model=Donation, status_code=201)
def create_donation(donation_data: DonationBase):
    """Create a new donation record."""
    new_donation = Donation(**donation_data.model_dump())
    donations_db.append(new_donation)
    return new_donation

@app.put("/api/donations/{donation_id}", response_model=Donation)
def update_donation(donation_id: str, updated_data: DonationBase):
    """Update an existing donation record by ID."""
    for i, donation in enumerate(donations_db):
        if donation.id == donation_id:
            # Create a new Donation object by merging existing and updated data
            updated_donation = Donation(
                id=donation_id,
                **updated_data.model_dump()
            )
            donations_db[i] = updated_donation
            return updated_donation
    
    # If ID is not found
    raise HTTPException(status_code=404, detail="Donation not found.")

@app.delete("/api/donations/{donation_id}", status_code=204)
def delete_donation(donation_id: str):
    """Delete a donation record by ID."""
    global donations_db
    initial_length = len(donations_db)
    donations_db = [d for d in donations_db if d.id != donation_id]
    
    if len(donations_db) == initial_length:
        raise HTTPException(status_code=404, detail="Donation not found.")
    
    # 204 No Content for successful deletion
    return