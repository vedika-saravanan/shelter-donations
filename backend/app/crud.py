from sqlalchemy.orm import Session
from . import models, schemas

def list_donations(db: Session):
    """
    Retrieve all donation records from the database, ordered by date (newest first)
    and then by ID (descending).

    Args:
        db (Session): Active SQLAlchemy database session.

    Returns:
        List[Donation]: A list of all donation entries sorted by date and ID.
    """
    return db.query(models.Donation).order_by(models.Donation.date.desc(), models.Donation.id.desc()).all()

def get_donation(db: Session, donation_id: int):
    """
    Retrieve a specific donation record by its ID.

    Args:
        db (Session): Active SQLAlchemy database session.
        donation_id (int): The ID of the donation to retrieve.

    Returns:
        Donation | None: The matching donation record if found, otherwise None.
    """
    return db.query(models.Donation).get(donation_id)

def create_donation(db: Session, donation: schemas.DonationCreate):
    """
    Create and persist a new donation record in the database.

    Args:
        db (Session): Active SQLAlchemy database session.
        donation (DonationCreate): Pydantic schema containing new donation data.

    Returns:
        Donation: The newly created donation database object.
    """
    db_obj = models.Donation(**donation.model_dump())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def update_donation(db: Session, donation_id: int, patch: schemas.DonationUpdate):
    """
    Update an existing donation record in the database.

    Args:
        db (Session): Active SQLAlchemy database session.
        donation_id (int): The ID of the donation to update.
        patch (DonationUpdate): Pydantic schema containing updated fields.

    Returns:
        Donation | None: The updated donation object if found, otherwise None.
    """
    obj = get_donation(db, donation_id)
    if not obj:
        return None
    for k, v in patch.model_dump(exclude_unset=True).items():
        setattr(obj, k, v)
    db.commit()
    db.refresh(obj)
    return obj

def delete_donation(db: Session, donation_id: int) -> bool:
    """
    Delete a donation record from the database by ID.

    Args:
        db (Session): Active SQLAlchemy database session.
        donation_id (int): The ID of the donation to delete.

    Returns:
        bool: True if the deletion was successful, False if no record was found.
    """
    obj = get_donation(db, donation_id)
    if not obj:
        return False
    db.delete(obj)
    db.commit()
    return True
