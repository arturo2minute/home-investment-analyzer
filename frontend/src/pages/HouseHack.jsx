// src/pages/BuyRent.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import 'swiper/css';
import 'swiper/css/navigation';
import axios from "axios";
import {MapPin, Home, Bed, Bath, Ruler, LandPlot, Calendar, Layers, DollarSign, Building2, ExternalLink, ArrowLeft, CircleHelp, History} from "lucide-react";
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';


export default function BuyRent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [compProperties, setCompProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [showNOIFormula, setShowNOIFormula] = useState(false);
  const [showCapFormula, setShowCapFormula] = useState(false);
  const [showCoCFormula, setShowCoCFormula] = useState(false);
  const [showCashFlowFormula, setShowCashFlowFormula] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [inputs, setInputs] = useState({
    purchase_price: 300000,
    expected_profit: 0,
    closing_costs: 6500,
    rehab: 25000,
    arv: 390000,

    cash: false,
    down_payment: 8.33,
    interest_rate: 3.27,
    lender_charges: 0,
    loan_fees_wrapped: true,
    pmi: 81,
    years_amortized: 30,
    rehab_months: 3,
    interest_only: false,

    refinance_loan_amount: 0,
    refinance_interest_rate: 0,
    refinance_lender_charges: 0,
    refinance_loan_fees_wrapped: true,
    refinance_pmi: 0,
    refinance_years_amortized: 0,

    monthly_rent: 2650,
    personal_rent_contribution: 0,
    other_monthly_income: 450,
    selling_months: 0,

    yearly_taxes: 2450,
    monthly_insurance: 1100,
    cleaning: 0,
    internet: 0,
    hoa_fees: 50,
    gas: 50,
    electricity: 50,
    watersewer: 50,
    garbage: 50,
    other: 0,

    vacancy: 5,
    maintenance: 5,
    capex: 5,
    managment: 5
  });

  // Fetch property and comparable properties
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch property details
        const propRes = await axios.get(`http://localhost:8000/property/${id}/buy_and_rent`);
        setProperty(propRes.data);

        // Fetch comparable properties using property data
        if (propRes.data) {
          const query = new URLSearchParams({
            zipcode: propRes.data.zipcode || '',
            sqft: propRes.data.sqft || 0,
            lot_size: propRes.data.lot_size || 0,
            year_built: propRes.data.year_built || 0,
            beds: propRes.data.beds || 0,
            baths: propRes.data.baths || 0,
            home_type: propRes.data.home_type || '',
            address: propRes.data.address || ''
          });
          const compRes = await axios.get(`http://localhost:8000/comparables?${query.toString()}`);
          setCompProperties(compRes.data);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setError("Failed to load property or comparable properties.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // Update inputs based on property data
  // useEffect(() => {
  //   if (property && property.listing_price) {
  //     const downPayment = property.listing_price * 0.2;
  //     setInputs(prev => ({
  //       ...prev,
  //       purchase_price: property.listing_price,
  //       down_payment: downPayment
  //     }));
  //   }
  // }, [property]);

  // Handler for Input Changes
  const handleInputChange = (e) => {
    const { name, type, value, checked } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : Number(value) || 0,
    }));
  };

  // Handle deal analysis
  const handleAnalyzeDeal = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post("http://localhost:8000/analyze-buy-rent-deal", inputs);
      setAnalysis(response.data);
    } catch (error) {
      console.error("Error analyzing deal:", error);
      setError(error.response?.data?.message || "Failed to analyze deal. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Mobile Sidebar Toggle */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="bg-teal text-white px-4 py-2 rounded-md shadow-lg">
          ☰
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`fixed md:sticky top-0 left-0 h-screen bg-light-gray border-r p-6 space-y-4 z-40 w-72 overflow-y-auto transform transition-transform duration-300 ease-in-out
                        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
        {/* Close button for mobile */}
        <div className="md:hidden flex justify-end mb-4">
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="text-dark-gray">
            ✕
          </button>
        </div>

        {/* Back Button */}
        <button
          className="inline-flex items-center gap-2 bg-teal text-white-smoke hover:bg-soft-teal hover:text-dark-gray px-3 py-1 rounded-full font-medium text-lg md:text-base"
          onClick={() => navigate(-1)}>
          <ArrowLeft size={16} /> Back to Search
        </button>

        {/* Property Details Card */}
        <h2 className="text-2xl font-bold text-dark-gray mb-4 flex items-center gap-2"> <Home size={24} />Property Details</h2>
        {property ? (
          <div className="bg-white rounded-xl shadow p-6 space-y-4 text-dark-gray text-base">
            <div className="space-y-2">
              <p className="flex items-center gap-2"><MapPin size={16} /><strong>Address:</strong></p>
              <p className="flex items-center gap-2">{property.address}</p>
              <p className="flex items-center gap-2">{property.city}, {property.state}, {property.zipcode}</p>
              <p className="flex items-center gap-2"><DollarSign size={16} /><strong>Price:</strong> ${property.listing_price?.toLocaleString()}</p>
              <p className="flex items-center gap-2"><DollarSign size={16} /><strong>Pice Per sqft:</strong> ${property.price_per_sqft?.toLocaleString()}</p>
              <p className="flex items-center gap-2"><Ruler size={16} /><strong>Sqft:</strong> {property.sqft?.toLocaleString() ?? "N/A"}</p>
              <p className="flex items-center gap-2"><Bed size={16} /><strong>Beds:</strong> {property.beds}</p>
              <p className="flex items-center gap-2"><Bath size={16} /> <strong>Baths:</strong> {property.baths}</p>
              <p className="flex items-center gap-2"><Layers size={16} /><strong>Stories:</strong> {property.stories}</p>
              <p className="flex items-center gap-2"><Building2 size={16} /><strong>Type:</strong> {property.home_type}</p>
              <p className="flex items-center gap-2"><LandPlot size={16} /><strong>Lot:</strong> {property.lot_size} Acres</p>
              <p className="flex items-center gap-2"><DollarSign size={16} /><strong>HOA Fee:</strong> ${property.hoa_fee}</p>
            </div>
            <div>
              <a
                href={property.property_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 mt-3 text-blue-600 font-medium hover:underline">
                <ExternalLink size={16} /> View on Realtor
              </a>
            </div>
          </div>
        ) : (
          <p className="text-dark-gray">Loading property details...</p>
        )}

        {/* Property History Card */}
        <h2 className="text-2xl font-bold text-dark-gray mb-4 flex items-center gap-2"> <History size={24} />Property History</h2>
        {property ? (
          <div className="bg-white rounded-xl shadow p-6 space-y-4 text-dark-gray text-base">
            <div className="space-y-2">
              <p className="flex items-center gap-2"><Calendar size={16} /><strong>Year Built:</strong> {property.year_built}</p>
              <p className="flex items-center gap-2"><Calendar size={16} /><strong>Last Sold Date:</strong> {property.last_sold_date}</p>
              <p className="flex items-center gap-2"><DollarSign size={16} /><strong>Last Sold Price:</strong> ${property.sold_price?.toLocaleString()}</p>
            </div>
          </div>
        ) : (
          <p className="text-dark-gray">Loading property details...</p>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 pt-20 md:pt-6">

        {/* Top Image */}
        <div className="image-wrapper p-5 mx-auto">
          {property ? (
            <a
              href={property.property_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block">
              <img
                src={property.image_url || "/fallback.png"}
                alt={`${property.address} Preview`}
                className="w-full h-full object-cover rounded"
                onError={(e) => {
                  e.target.src = "/fallback.png";
                }}
              />
            </a>
          ) : (
            <p className="text-dark-gray">Loading property details...</p>
          )}
        </div>

        {/* Deal Inputs */}
        <div className="deal-inputs-wrapper p-5 mx-auto space-y-8">

          {/* Purchase Information */}
          <div className="bg-white p-6 rounded-xl shadow border space-y-8">
            <div>
              <h2 className="text-xl font-bold text-dark-gray mb-4">Purchase Information</h2>
              
              {/* Purchase Details */}
              <h3 className="text-lg font-semibold text-dark-gray mb-2">Purchase Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {["purchase_price", "closing_costs", "rehab", "arv"].map((name) => (
                  <div key={name}>
                    <label className="block text-sm font-medium text-dark-gray mb-1">
                      {name.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                    </label>
                    <input
                      type="number"
                      name={name}
                      value={inputs[name]}
                      onChange={handleInputChange}
                      className="w-full border rounded px-3 py-2 text-sm"
                      placeholder="$0"
                    />
                  </div>
                ))}
              </div>

              {/* Purchase Loan Details */}
              <h3 className="text-lg font-semibold text-dark-gray mb-2">Purchase Loan Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark-gray mb-1">
                    Cash Purchase
                  </label>
                  <input
                    type="checkbox"
                    name="cash"
                    checked={inputs.cash}
                    onChange={handleInputChange}
                    className="w-4 h-4"/>
                </div>
                {!inputs.cash && (
                  <>
                    {["down_payment", "interest_rate", "lender_charges", "loan_fees_wrapped", "pmi", "years_amortized"].map((name) => (
                      <div key={name}>
                        <label className="block text-sm font-medium text-dark-gray mb-1">
                          {name === "down_payment" ? "Down Payment (%)" : 
                           name === "loan_fees_wrapped" ? "Loan Fees Wrapped" : 
                           name.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                        </label>
                        <input
                          type={name === "loan_fees_wrapped" ? "checkbox" : "number"}
                          name={name}
                          value={name === "loan_fees_wrapped" ? undefined : inputs[name]}
                          checked={name === "loan_fees_wrapped" ? inputs[name] : undefined}
                          onChange={handleInputChange}
                          className={name === "loan_fees_wrapped" ? "w-4 h-4" : "w-full border rounded px-3 py-2 text-sm"}
                          placeholder={name === "loan_fees_wrapped" ? undefined : "0"}/>
                      </div>
                    ))}
                  </>
                )}
                <div>
                  <label className="block text-sm font-medium text-dark-gray mb-1">
                    Rehab Months
                  </label>
                  <input
                    type="number"
                    name="rehab_months"
                    value={inputs.rehab_months}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2 text-sm"
                    placeholder="0"/>
                </div>
              </div>
            </div>
          </div>
          
          {/* Rental Information */}
          <div className="bg-white p-6 rounded-xl shadow border space-y-8">
            <div>
              <h2 className="text-xl font-bold text-dark-gray mb-4">Rental Information</h2>

              {/* Income */}
              <h3 className="text-lg font-semibold text-dark-gray mb-2">Income</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {["monthly_rent", "personal_rent_contribution", "other_monthly_income"].map((name) => (
                  <div key={name}>
                    <label className="block text-sm font-medium text-dark-gray mb-1">
                      {name.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                    </label>
                    <input
                      type="number"
                      name={name}
                      value={inputs[name]}
                      onChange={handleInputChange}
                      className="w-full border rounded px-3 py-2 text-sm"
                      placeholder="0"
                    />
                  </div>
                ))}
              </div>

              {/* Fixed Landlord-Paid Expenses */}
              <h3 className="text-lg font-semibold text-dark-gray mb-2">Fixed Landlord-Paid Expenses</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {["yearly_taxes", "monthly_insurance", "hoa_fees", "gas", "electricity", "watersewer", "garbage", "other"].map((name) => (
                  <div key={name}>
                    <label className="block text-sm font-medium text-dark-gray mb-1">
                      {name.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                    </label>
                    <input
                      type="number"
                      name={name}
                      value={inputs[name]}
                      onChange={handleInputChange}
                      className="w-full border rounded px-3 py-2 text-sm"
                      placeholder="$0"
                    />
                  </div>
                ))}
              </div>

              {/* Variable Landlord-Paid Expenses */}
              <h3 className="text-lg font-semibold text-dark-gray mb-2">Variable Landlord-Paid Expenses (%)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {["vacancy", "maintenance", "capex", "managment"].map((name) => (
                  <div key={name}>
                    <label className="block text-sm font-medium text-dark-gray mb-1">
                      {name.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                    </label>
                    <input
                      type="number"
                      name={name}
                      value={inputs[name]}
                      onChange={handleInputChange}
                      className="w-full border rounded px-3 py-2 text-sm"
                      placeholder="0%"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-center">
            <button
              onClick={handleAnalyzeDeal} disabled={isLoading}
              className="w-3/4 sm:w-1/4 bg-teal text-white py-2 rounded hover:bg-soft-teal hover:text-dark-gray">
              {isLoading ? "Analyzing..." : "Analyze Deal"}
            </button>
            {error && <p className="text-red-500">{error}</p>}
          </div>
        </div>

        {/* Deal Analysis */}
        <div className="grid p-5 gap-14 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2">

          {/* NOI */}
          <div className="p-6 bg-white rounded-xl shadow border">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-dark-gray">Net Operating Income</h3>
              <button
                onClick={() => setShowNOIFormula(!showNOIFormula)}
                className="p-1 text-dark-gray hover:text-dark-gray">
                <CircleHelp size={16} />
              </button>
            </div>
            {showNOIFormula && (
              <div className="mt-2 text-sm text-dark-gray">
                <span>NOI = Gross Rental Income - Operating Expenses</span>
              </div>
            )}
            <div className="flex items-center justify-center flex-col">
              <div className="text-lg md:text-xl lg:text-2xl font-semibold text-dark-gray overflow-x-auto whitespace-normal max-w-full">
                {analysis ? (
                  <BlockMath math={`\\$${analysis.noi} = \\$${analysis.annual_gross_income} - \\$${analysis.annual_operating_expenses}`} />
                ) : (
                  <span>NOI = Gross Rental Income - Operating Expenses</span>
                )}
              </div>
            </div>
          </div>

          {/* Cap Rate */}
          <div className="p-6 bg-white rounded-xl shadow border">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-dark-gray">Cap Rate</h3>
              <button
                onClick={() => setShowCapFormula(!showCapFormula)}
                className="p-1 text-dark-gray hover:text-dark-gray">
                <CircleHelp size={16} />
              </button>
            </div>
            {showCapFormula && (
              <div className="mt-2 text-sm text-dark-gray">
                <span>Cap Rate = (NOI / Purchase Price) × 100%</span> 
              </div>
            )}
            <div className="flex items-center justify-center flex-col">
              <div className="text-lg md:text-xl lg:text-2xl font-semibold text-dark-gray overflow-x-auto whitespace-normal max-w-full">
                {analysis ? (
                  <BlockMath math={`${analysis.cap_rate}\\% = \\frac{\\$${analysis.noi}}{\\$${analysis.purchase_price}} \\times 100`} />
                ) : (
                  <span>Cap Rate = (NOI / Purchase Price) × 100%</span>                )}
              </div>
            </div>
          </div>

          {/* Cash-on-Cash Return */}
          <div className="p-6 bg-white rounded-xl shadow border">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-dark-gray">Cash-on-Cash Return</h3>
              <button
                onClick={() => setShowCoCFormula(!showCoCFormula)}
                className="p-1 text-dark-gray hover:text-dark-gray">
                <CircleHelp size={16} />
              </button>
            </div>
            {showCoCFormula && (
              <div className="mt-2 text-sm text-slate-700">
                <span>CoC Return = (Annual Cash Flow / Total Cash Invested) × 100%</span>
              </div>
            )}
            <div className="flex items-center justify-center flex-col">
              <div className="text-lg md:text-xl lg:text-2xl font-semibold text-dark-gray overflow-x-auto whitespace-normal max-w-full">
                {analysis ? (
                  <BlockMath math={`${analysis.coc_return}\\% = \\frac{\\$${analysis.annual_cash_flow}}{\\$${analysis.total_cash_invested}} \\times 100`} />
                ) : (
                  <span>CoC Return = (Annual Cash Flow / Total Cash Invested) × 100%</span>
                )}
              </div>
            </div>
          </div>

          {/* Monthly Cash Flow */}
          <div className="p-6 bg-white rounded-xl shadow border">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-dark-gray">Monthly Cash Flow</h3>
              <button
                onClick={() => setShowCashFlowFormula(!showCashFlowFormula)}
                className="p-1 text-dark-gray hover:text-dark-gray">
                <CircleHelp size={16} />
              </button>
            </div>
            {showCashFlowFormula && (
              <div className="mt-2 text-sm text-slate-700">
                <span>Cash Flow = (NOI / 12) - Mortgage Payment</span>
              </div>
            )}
            <div className="flex items-center justify-center flex-col">
              <div className="text-md md:text-xl lg:text-2xl font-semibold text-dark-gray overflow-x-auto whitespace-normal max-w-full">
                {analysis ? (
                  <BlockMath math={`\\$${analysis.monthly_cash_flow} = \\frac{\\$${analysis.noi}}{\\text{12}} - \\$${analysis.monthly_mortgage}`} />
                ) : (
                  <span>Cash Flow = (NOI / 12) - Mortgage Payment</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Comparables */}
        <div className="p-5">
          <h2 className="text-2xl font-bold text-dark-gray mb-6">Comparable Properties</h2>
          {isLoading ? (
            <p className="text-dark-gray">Loading comparable properties...</p>
          ) : compProperties.length === 0 ? (
            <p className="text-dark-gray">No comparable properties found.</p>
          ) : (
            <div className="grid gap-14 grid-cols-1 max-w-7xl sm:grid-cols-2 lg:grid-cols-3 mx-auto">
              {compProperties.map((compProperty) => (
                <div
                  key={compProperty.id}
                  className="bg-light-gray rounded-2xl shadow-lg p-8 border hover:border-teal hover:shadow-xl transition hover:scale-105">
                  <a href={compProperty.property_url} target="_blank" rel="noopener noreferrer" className="block mb-4">
                    <img
                      src={compProperty.image_url || "/fallback.png"}
                      alt={`${compProperty.address} Preview`}
                      className="w-full h-64 object-cover rounded mb-4"
                      onError={(e) => { e.target.src = "/fallback.png"; }}
                    />
                  </a>
                  <h2 className="text-xl font-semibold text-dark-gray mb-2">
                    {compProperty.address}, {compProperty.city}, {compProperty.state}
                  </h2>
                  <p className="text-2xl font-medium text-green">${compProperty.listing_price.toLocaleString()}</p>
                  <p className="text-dark-gray">
                    {compProperty.beds === 0 ? "--" : compProperty.beds} beds | {compProperty.baths === 0 ? "--" : compProperty.baths} baths |{" "}
                    {compProperty.sqft === 0 ? "--" : compProperty.sqft} sqft
                  </p>
                  <p className="text-dark-gray">
                    {compProperty.lot_size === 0 ? "--" : compProperty.lot_size} Acres | {compProperty.home_type} | Built{" "}
                    {compProperty.year_built === 0 ? "N/A" : compProperty.year_built}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>
    </div>
  );
}