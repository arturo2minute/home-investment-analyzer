# properties.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
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
    for home in listings:
        db.add(Property(**home))
    db.commit()
    return db.query(Property).filter(Property.address.contains(zipcode)).all()