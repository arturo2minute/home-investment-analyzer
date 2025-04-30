# properties.py
import requests
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.database import SessionLocal
from app.models import Property
from app.scraper import scrape_realtor_dot_com
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
    # print(f"[DEBUG] Received zipcode: {zipcode}")

    # listings = scrape_realtor_dot_com(zipcode, 'for_sale', 1)

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
    closing_costs: float
    arv: float
    rehab: float
    cash: float
    down_payment: float
    interest_rate: float
    loan_term: float
    monthly_rent: float
    yearly_taxes: float
    yearly_insurance: float
    maintenance: float
    vacancy: float
    capex: float
    managment: float
    electricity: float
    gas: float
    watersewer: float
    hoa_fees: float
    garbage: float
    other: float

# Endpoint to analyze the deal
@router.post("/analyze-buy-rent-deal")
def analyze_buy_rent_deal(inputs: DealInputs):
    # Calculate annual gross income
    annual_gross_income = inputs.monthly_rent * 12

    # Calculate operating expenses
    maintenance_cost = (inputs.maintenance / 100) * annual_gross_income
    vacancy_cost = (inputs.vacancy / 100) * annual_gross_income
    capex_cost = (inputs.capex / 100) * annual_gross_income
    management_fees = (inputs.managment / 100) * annual_gross_income
    annual_utilities = (inputs.electricity + inputs.gas + inputs.watersewer + 
                        inputs.hoa_fees + inputs.garbage + inputs.other) * 12

    annual_operating_expenses = (
        inputs.yearly_taxes +
        inputs.yearly_insurance +
        maintenance_cost +
        vacancy_cost +
        capex_cost +
        management_fees +
        annual_utilities
    )

    # Calculate Net Operating Income (NOI)
    noi = annual_gross_income - annual_operating_expenses

    # Calculate loan amount (0 if cash purchase)
    loan_amount = max(0, inputs.purchase_price - inputs.down_payment)

    # Calculate monthly mortgage payment
    if loan_amount > 0 and inputs.interest_rate > 0 and inputs.loan_term > 0:
        monthly_interest_rate = inputs.interest_rate / 100 / 12
        number_of_payments = inputs.loan_term * 12
        monthly_mortgage = loan_amount * (monthly_interest_rate * (1 + monthly_interest_rate)**number_of_payments) / \
                           ((1 + monthly_interest_rate)**number_of_payments - 1)
    else:
        monthly_mortgage = 0

    annual_mortgage = monthly_mortgage * 12

    # Calculate cash flow
    annual_cash_flow = noi - annual_mortgage
    monthly_cash_flow = (noi / 12) - monthly_mortgage

    # Calculate cap rate
    cap_rate = (noi / inputs.purchase_price) * 100 if inputs.purchase_price > 0 else 0

    # Calculate total cash invested for cash-on-cash return
    total_cash_invested = inputs.down_payment + inputs.closing_costs + inputs.rehab

    # Calculate cash-on-cash return
    coc_return = (annual_cash_flow / total_cash_invested) * 100 if total_cash_invested > 0 else 0

    # Return results
    return {
        "noi": round(noi, 2),
        "cap_rate": round(cap_rate, 2),
        "coc_return": round(coc_return, 2),
        "monthly_cash_flow": round(monthly_cash_flow, 2),
        "annual_gross_income": round(annual_gross_income, 2),
        "annual_operating_expenses": round(annual_operating_expenses, 2),
        "purchase_price": round(inputs.purchase_price, 2),
        "annual_cash_flow": round(annual_cash_flow, 2),
        "total_cash_invested": round(total_cash_invested, 2),
        "annual_mortgage": round(annual_mortgage, 2),
        "monthly_mortgage": round(monthly_mortgage, 2)
    }

# # Pydantic model for input validation
# class ComparableInputs(BaseModel):
#     zipcode: str
#     property_type: str
#     sqft: int
#     beds: int
#     baths: float
#     lot_size: float
#     year_built: int

# # Endpoint to get comps
# @router.post("/analyze-buy-rent-deal")
# def get_comparables(inputs: ComparableInputs):
#     return {
#         "zipcode": "97478",
#         "property_type": "Single Family",
#         "sqft": 1245,
#         "beds": 3,
#         "baths": 1.5,
#         "lot_size": .33,
#         "year_built": 1971
#     }
