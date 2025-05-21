import pytest
from app.routes.calculations import calculate_noi
from app.routes.properties import DealInputs

valid_payload = {
    "purchase_price": 300000,
    "expected_profit": 0,
    "closing_costs": 6500,
    "rehab": 25000,
    "arv": 390000,

    "cash": False,
    "down_payment": 8.33,
    "interest_rate": 3.27,
    "lender_charges": 0,
    "loan_fees_wrapped": True,
    "pmi": 81,
    "years_amortized": 30,
    "rehab_months": 3,
    "interest_only": False,

    "refinance_loan_amount": 0,
    "refinance_interest_rate": 0,
    "refinance_lender_charges": 0,
    "refinance_loan_fees_wrapped": True,
    "refinance_pmi": 0,
    "refinance_years_amortized": 0,

    "monthly_rent": 2650,
    "personal_rent_contribution": 0,
    "other_monthly_income": 450,
    "selling_months": 0,

    "yearly_taxes": 2450,
    "monthly_insurance": 1100,
    "cleaning": 0,
    "internet": 0,
    "hoa_fees": 50,
    "gas": 50,
    "electricity": 50,
    "watersewer": 50,
    "garbage": 50,
    "other": 0,

    "vacancy": 5,
    "maintenance": 5,
    "capex": 5,
    "managment": 5
}

def test_analyze_deal_success(async_client):
    response = async_client.post("/analyze-buy-rent-deal", json=valid_payload)
    assert response.status_code == 200
    data = response.json()
    assert "noi" in data
    assert "cap_rate" in data
    assert "coc_return" in data
    assert "monthly_cash_flow" in data

def test_calculate_noi_zero_income():
    zero_income_payload = valid_payload.copy()
    zero_income_payload['monthly_rent'] = 0
    inputs = DealInputs(**zero_income_payload)
    noi, _, _ = calculate_noi(inputs)
    assert noi < 0
