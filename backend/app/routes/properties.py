# properties.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.database import SessionLocal
from app.models import Property
from app.scraper import scrape_redfin

router = APIRouter()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/properties")
def get_properties(zipcode: str, db: Session = Depends(get_db)):
    listings = scrape_redfin(zipcode)

    print(f"[DEBUG] Scraper returned {len(listings) if listings else 0} results for {zipcode}")

    if not listings:
        return []
    
    for home in listings:
        # Ensure home doenst already exist in database
        # home["zipcode"] = zipcode
        try:
            db.add(Property(**home))
            db.commit()
        except IntegrityError:
            db.rollback()
            print(f"[SKIP] Duplicate: {home['address']} ({zipcode})")

    db.commit()

    # Testing
    properties = db.query(Property).filter(Property.zipcode == zipcode).all()
    print(f"[QUERY RESULT] {properties}")

    return [prop.to_dict() for prop in properties]