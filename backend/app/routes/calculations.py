def calculate_noi(inputs):
    # Calculate annual
    annual_gross_income = inputs.monthly_rent * 12
    annual_insurance = inputs.monthly_insurance * 12

    # Calculate operating expenses
    maintenance_cost = (inputs.maintenance / 100) * annual_gross_income
    vacancy_cost = (inputs.vacancy / 100) * annual_gross_income
    capex_cost = (inputs.capex / 100) * annual_gross_income
    management_fees = (inputs.managment / 100) * annual_gross_income
    annual_utilities = (inputs.hoa_fees + inputs.gas + inputs.electricity + inputs.watersewer 
                        + inputs.garbage + inputs.other) * 12

    annual_operating_expenses = (inputs.yearly_taxes + annual_insurance + maintenance_cost 
                                 + vacancy_cost + capex_cost + management_fees + annual_utilities)

    # Calculate Net Operating Income (NOI)
    noi = annual_gross_income - annual_operating_expenses
    return noi, annual_gross_income, annual_operating_expenses

def calculate_cap_rate(noi, purchase_price):
    return (noi / purchase_price) * 100 if purchase_price > 0 else 0

def calculate_monthly_mortgage(inputs):
    if inputs.cash == True:
        return 0, 0, inputs.closing_costs
    
    # Calculate down payment
    down_payment = inputs.purchase_price * (inputs.down_payment / 100)

    # Wrap loan fees
    if inputs.loan_fees_wrapped == True:
        loan_amount = inputs.purchase_price + inputs.lender_charges - down_payment
        closing_costs = inputs.closing_costs
    else:
        loan_amount = inputs.purchase_price - down_payment
        closing_costs = inputs.closing_costs + inputs.lender_charges

    if loan_amount > 0 and inputs.interest_rate > 0 and inputs.years_amortized > 0:
        monthly_interest_rate = inputs.interest_rate / 100 / 12
        number_of_payments = inputs.years_amortized * 12
        principal_and_interest = loan_amount * (monthly_interest_rate * (1 + monthly_interest_rate)**number_of_payments) / \
                        ((1 + monthly_interest_rate)**number_of_payments - 1)
    else:
        principal_and_interest = 0

    total_monthly_payment = principal_and_interest + inputs.pmi

    return total_monthly_payment, down_payment, closing_costs

def calculate_cash_flow(noi, monthly_mortgage):
    annual_mortgage = monthly_mortgage * 12
    annual_cash_flow = noi - annual_mortgage
    monthly_cash_flow = (noi / 12) - monthly_mortgage
    return annual_cash_flow, monthly_cash_flow, annual_mortgage

def calculate_CoC_return(annual_cash_flow, total_cash_invested):
    return (annual_cash_flow / total_cash_invested) * 100 if total_cash_invested > 0 else 0

def calculate_suggested_purchase_price(expected_profit, expected_cash_invested, purchase_price):
    return purchase_price - (expected_profit + expected_cash_invested) 