from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import date
from typing import List

from .database import Base, engine, get_db
from . import models, schemas, crud

# Create tables on startup (for the exercise)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Shelter Donations API")

# Allow frontend dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/healthz")
def healthz():
    return {"ok": True, "today": date.today().isoformat()}

# --- Donations CRUD ---

@app.get("/donations", response_model=List[schemas.DonationRead])
def list_donations(db: Session = Depends(get_db)):
    return crud.list_donations(db)

@app.post("/donations", response_model=schemas.DonationRead, status_code=201)
def create_donation(donation: schemas.DonationCreate, db: Session = Depends(get_db)):
    return crud.create_donation(db, donation)

@app.put("/donations/{donation_id}", response_model=schemas.DonationRead)
def update_donation(donation_id: int, patch: schemas.DonationUpdate, db: Session = Depends(get_db)):
    updated = crud.update_donation(db, donation_id, patch)
    if not updated:
        raise HTTPException(status_code=404, detail="Donation not found")
    return updated

@app.delete("/donations/{donation_id}", status_code=204)
def delete_donation(donation_id: int, db: Session = Depends(get_db)):
    ok = crud.delete_donation(db, donation_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Donation not found")
