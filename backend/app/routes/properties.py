# properties.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.database import SessionLocal
from app.models import Property
from app.scraper import scrape_redfin
from pydantic import BaseModel

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
    # listings = scrape_redfin(zipcode)

    # print(f"[DEBUG] Scraper returned {len(listings) if listings else 0} results for {zipcode}")

    # if not listings:
    #     return []
    
    # for home in listings:
    #     # Ensure home doenst already exist in database
    #     # home["zipcode"] = zipcode
    #     try:
    #         db.add(Property(**home))
    #         db.commit()
    #     except IntegrityError:
    #         db.rollback()
    #         print(f"[SKIP] Duplicate: {home['address']} ({zipcode})")

    # db.commit()

    # Return Properties from database
    properties = db.query(Property).filter(Property.zipcode == zipcode).all()
    print(f"[QUERY RESULT] {properties}")

    return [prop.to_dict() for prop in properties]


@router.get("/property/{property_id}/{strategy}")
def get_property_by_id(property_id: int, db: Session = Depends(get_db)):
    property = db.query(Property).filter(Property.id == property_id).first()
    if not property:
        raise HTTPException(status_code=404, detail="Property not found")
    return property

# Pydantic model for input validation
class DealInputs(BaseModel):
    purchase_price: float
    monthly_rent: float
    monthly_mortgage: float
    yearly_taxes: float
    yearly_insurance: float
    maintenance: float
    vacancy: float
    repairs: float
    down_payment: float

# Endpoint to analyze the deal
@router.post("/analyze-deal")
def analyze_deal(inputs: DealInputs):
    # Calculations with intermediate values
    annual_gross_income = inputs.monthly_rent * 12
    annual_operating_expenses = (
        inputs.yearly_taxes +
        inputs.yearly_insurance +
        inputs.maintenance +
        inputs.vacancy +
        inputs.repairs
    )
    noi = annual_gross_income - annual_operating_expenses
    cap_rate = (noi / inputs.purchase_price) * 100 if inputs.purchase_price > 0 else 0
    annual_mortgage = inputs.monthly_mortgage * 12
    annual_cash_flow = noi - annual_mortgage
    coc_return = (annual_cash_flow / inputs.down_payment) * 100 if inputs.down_payment > 0 else 0
    monthly_cash_flow = (noi / 12) - inputs.monthly_mortgage

    # Return results with intermediate values, rounded to 2 decimal places
    return {
        "noi": round(noi, 2),
        "cap_rate": round(cap_rate, 2),
        "coc_return": round(coc_return, 2),
        "monthly_cash_flow": round(monthly_cash_flow, 2),
        "annual_gross_income": round(annual_gross_income, 2),
        "annual_operating_expenses": round(annual_operating_expenses, 2),
        "purchase_price": round(inputs.purchase_price, 2),  # Already available from inputs
        "annual_cash_flow": round(annual_cash_flow, 2),
        "down_payment": round(inputs.down_payment, 2),      # Already available from inputs
        "annual_mortgage": round(annual_mortgage, 2),
        "monthly_mortgage": round(inputs.monthly_mortgage, 2)  # Already available from inputs
    }