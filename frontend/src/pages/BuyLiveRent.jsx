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
  const [analysis, setAnalysis] = useState(null);
  const [showNOIFormula, setShowNOIFormula] = useState(false);
  const [showCapFormula, setShowCapFormula] = useState(false);
  const [showCoCFormula, setShowCoCFormula] = useState(false);
  const [showCashFlowFormula, setShowCashFlowFormula] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [inputs, setInputs] = useState({
    purchase_price: 300000,
    closing_costs: 6500,
    arv: 390000,
    rehab: 25000,
    cash: 0,
    down_payment: 15000,
    interest_rate: 6.53,
    loan_term: 30,
    monthly_rent: 2650,
    yearly_taxes: 2450,
    yearly_insurance: 1100,
    maintenance: 5,
    vacancy: 5,
    capex: 5,
    managment: 5,
    electricity: 50,
    gas: 50,
    watersewer: 50,
    hoa_fees: 50,
    garbage: 50,
    other: 0
});

  // Gather general property info from database
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/property/${id}/buy_live_rent`);
        setProperty(res.data);
      } catch (error) {
        console.error("Failed to fetch property:", error);
      }
    };
    fetchProperty();
  }, [id]);

  // Update inputs based on property data
  useEffect(() => {
    if (property && property.listing_price) {
      const downPayment = property.listing_price * 0.2;
      setInputs(prev => ({
        ...prev,
        purchase_price: property.listing_price,
        down_payment: downPayment
      }));
    }
  }, [property]);

  // Handler for Input Changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle deal analysis
  const handleAnalyzeDeal = async () => {
    try {
      const response = await axios.post('http://localhost:8000/analyze-buy-rent-deal', inputs);
      setAnalysis(response.data); // Store results for display
    } catch (error) {
      console.error('Error analyzing deal:', error);
      alert('Failed to analyze deal. Please check your inputs.');
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
      <aside className={`fixed md:sticky top-0 left-0 md:h-screen min-h-screen bg-light-gray border-r p-6 space-y-4 z-40 w-72 overflow-y-auto transform transition-transform duration-300 ease-in-out
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

        {/* Top Sections */}
        <div className="flex flex-col lg:flex-row gap-8 mb-10 px-6 items-stretch">
          {/* Image */}
          {property ? (
          <div className="w-full lg:w-2/3 h-64 lg:h-full">
            <a
              href={property.property_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block mb-4">
              <img
                src={property.image_url || "/fallback.png"}
                alt={`${property.address} Preview`}
                className="w-full h-full object-cover rounded"
                onError={(e) => {
                  e.target.src = "/fallback.png"; // Fallback if image fails to load
                }}/>
            </a>
          </div>
          ) : (
            <p className="text-dark-gray">Loading property details...</p>
          )}
          {/* Deal Inputs Section */}
          <div className="bg-white p-6 rounded-xl shadow border w-full lg:w-1/3 flex flex-col justify-between h-full">
            <h2 className="text-xl font-bold text-dark-gray mb-4">Deal Inputs</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Purchase Price", name: "purchase_price" },
                { label: "Closing Costs", name: "closing_costs" },
                { label: "After Repair Value", name: "arv" },
                { label: "Rehab", name: "rehab" },
                { label: "Cash Purchase", name: "cash" },
                { label: "Down Payment", name: "down_payment" },
                { label: "Interest Rate", name: "interest_rate" },
                { label: "Loan Term", name: "loan_term" },
                { label: "Monthly Rent", name: "monthly_rent" },
                { label: "Yearly Taxes", name: "yearly_taxes" },
                { label: "Yearly Insurance", name: "yearly_insurance" },
                { label: "Maintenance", name: "maintenance" },
                { label: "Vacancy", name: "vacancy" },
                { label: "CapEX", name: "capex" },
                { label: "Managment Fees", name: "managment" },
                { label: "Electricity", name: "electricity" },
                { label: "Gas", name: "gas" },
                { label: "Water & Sewer", name: "watersewer" },
                { label: "HOA Fees", name: "hoa_fees" },
                { label: "Garbage", name: "garbage" },
                { label: "Other", name: "other" },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-dark-gray mb-1">
                    {field.label}
                  </label>
                  <input
                    type="number"
                    name={field.name}
                    value={inputs[field.name]}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2 text-sm"
                    placeholder="$0"/>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <button
                onClick={handleAnalyzeDeal}
                className="w-full bg-teal text-white py-2 rounded hover:bg-soft-teal hover:text-dark-gray">
                Analyze Deal
              </button>
            </div>
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
              <div className="mt-2 text-xs md:text-xl lg:text-2xl text-dark-gray">
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

      </main>
    </div>
  );
}
