# properties.py
import requests
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.database import SessionLocal
from app.models import Property
from app.scraper import scrape_realtor_dot_com
from pydantic import BaseModel
from .calculations import *

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
    rehab: float
    arv: float

    cash: bool
    down_payment: float
    interest_rate: float
    lender_charges: float
    loan_fees_wrapped: bool
    pmi: float
    years_amortized: float
    rehab_months: float
    interest_only: bool

    refinance_loan_amount: float
    refinance_interest_rate: float
    refinance_lender_charges: float
    refinance_loan_fees_wrapped: bool
    refinance_pmi: float
    refinance_years_amortized: float

    monthly_rent: float
    personal_rent_contribution: float
    other_monthly_income: float
    selling_months: float

    yearly_taxes: float
    monthly_insurance: float
    cleaning: float
    internet: float
    hoa_fees: float
    gas: float
    electricity: float
    watersewer: float
    garbage: float
    other: float

    vacancy: float
    maintenance: float
    capex: float
    managment: float

# Endpoint to analyze the deals
@router.post("/analyze-buy-rent-deal")
def analyze_buy_rent_deal(inputs: DealInputs):
    #print("Received Inputs:", inputs.dict())

    ## Calculate NOI
    noi, annual_gross_income, annual_operating_expenses = calculate_noi(inputs)
    
    ## Calculate Cap Rate
    cap_rate = calculate_cap_rate(noi, inputs.purchase_price)

    ## Calculate Monthly Mortgage
    monthly_mortgage, down_payment_amount, closing_costs = calculate_monthly_mortgage(inputs)

    ## Calculate Monthly Cash Flow
    annual_cash_flow, monthly_cash_flow, annual_mortgage = calculate_cash_flow(noi, monthly_mortgage)
    
    ## Calculate Cash-on-Cash return
    if inputs.cash == True:
        total_cash_invested = inputs.purchase_price + inputs.closing_costs + inputs.rehab
    else:
        total_cash_invested = down_payment_amount + closing_costs + inputs.rehab

    coc_return = calculate_CoC_return(annual_cash_flow, total_cash_invested)

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
