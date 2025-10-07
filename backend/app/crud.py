from sqlalchemy.orm import Session
from . import models, schemas

def list_donations(db: Session):
    return db.query(models.Donation).order_by(models.Donation.date.desc(), models.Donation.id.desc()).all()

def get_donation(db: Session, donation_id: int):
    return db.query(models.Donation).get(donation_id)

def create_donation(db: Session, donation: schemas.DonationCreate):
    db_obj = models.Donation(**donation.model_dump())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def update_donation(db: Session, donation_id: int, patch: schemas.DonationUpdate):
    obj = get_donation(db, donation_id)
    if not obj:
        return None
    for k, v in patch.model_dump(exclude_unset=True).items():
        setattr(obj, k, v)
    db.commit()
    db.refresh(obj)
    return obj

def delete_donation(db: Session, donation_id: int) -> bool:
    obj = get_donation(db, donation_id)
    if not obj:
        return False
    db.delete(obj)
    db.commit()
    return True
