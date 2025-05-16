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
    expected_profit: float
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

@router.post("/analyze-fix-flip")
def analyze_fix_flip(inputs: DealInputs):
    print("Received Inputs:", inputs.dict())

    # Calculate holding costs
    total_monthly_holding_costs = (
        inputs.yearly_taxes / 12 +
        inputs.monthly_insurance +
        inputs.cleaning +
        inputs.internet +
        inputs.hoa_fees +
        inputs.gas +
        inputs.electricity +
        inputs.watersewer +
        inputs.garbage +
        inputs.other
    )
    holding_months = inputs.rehab_months + inputs.selling_months
    holding_costs = total_monthly_holding_costs * holding_months

    # Calculate MAO and Loan Costs
    if inputs.cash == True:
        mao = inputs.arv - inputs.rehab - inputs.expected_profit - inputs.closing_costs - holding_costs
        loan_costs = 0
    else:
        down_payment_rate = inputs.down_payment / 100
        monthly_interest_rate = inputs.interest_rate / 100 / 12
        loan_term_months = inputs.years_amortized * 12

        # Apply correct finance formula
        denominator = 1 + (1 - down_payment_rate) * monthly_interest_rate * holding_months
        numerator = inputs.arv - inputs.expected_profit - inputs.rehab - inputs.closing_costs - holding_costs

        mao_initial = numerator / denominator
        loan_amount = mao_initial * (1 - down_payment_rate)
        if inputs.interest_only == True:
            # Interest-only monthly payment
            monthly_payment = loan_amount * monthly_interest_rate
        else:
            # Fully amortized monthly payment (standard mortgage calculation)
            if loan_term_months > 0 and monthly_interest_rate > 0:
                monthly_payment = loan_amount * (monthly_interest_rate * (1 + monthly_interest_rate) ** loan_term_months) / \
                                  ((1 + monthly_interest_rate) ** loan_term_months - 1)
            else:
                monthly_payment = 0  # Handle zero rate or term to avoid division by zero

        # Total loan costs over the holding period
        loan_costs = monthly_payment * holding_months

        # Final MAO subtracting loan costs
        mao = mao_initial - loan_costs

    # Return all required values
    print("Output:")
    print(f"mao:{round(mao, 2)} arv: {round(inputs.arv, 2)} inputs.expected_profit: {round(inputs.expected_profit, 2)} rehab: {round(inputs.rehab, 2)} closing_costs: {round(inputs.closing_costs, 2)} holding_costs: {round(holding_costs, 2)} loan_costs: {round(loan_costs, 2)}")
    
    return {
        "mao": round(mao, 2),
        "arv": round(inputs.arv, 2),
        "expected_profit": round(inputs.expected_profit, 2),
        "rehab": round(inputs.rehab, 2),
        "closing_costs": round(inputs.closing_costs, 2),
        "holding_costs": round(holding_costs, 2),
        "loan_costs": round(loan_costs, 2),
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
