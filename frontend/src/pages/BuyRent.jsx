// src/pages/BuyRent.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
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

  const [inputs, setInputs] = useState({
    purchase_price: 300000,
    monthly_rent: 2600,
    monthly_mortgage: 1650,
    yearly_taxes: 2400,
    yearly_insurance: 1100,
    maintenance: 600,
    vacancy: 600,
    repairs: 8000,
    down_payment: 20000
});

  // Gather general property info from database
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/property/${id}/buy_and_rent`);
        setProperty(res.data);
      } catch (error) {
        console.error("Failed to fetch property:", error);
      }
    };
    fetchProperty();
  }, [id]);

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
      const response = await axios.post('http://localhost:8000/analyze-deal', inputs);
      setAnalysis(response.data); // Store results for display
    } catch (error) {
      console.error('Error analyzing deal:', error);
      alert('Failed to analyze deal. Please check your inputs.');
    }
  };

  // Temporary static image list
  const mockImages = [
    "/house1.jpg",
    "/house2.jpg",
    "/house3.jpg"
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-80 bg-gray-100 border-r p-6 space-y-4 sticky top-0 h-screen overflow-y-auto">
        {/* Back Button */}
        <button
          className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 hover:bg-blue-200 px-3 py-1 rounded-full font-medium text-sm"
          onClick={() => navigate(-1)}>
          <ArrowLeft size={16} /> Back to Search
        </button>

        {/* Property Details Card */}
        <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2"> <Home size={24} />Property Details</h2>
        {property ? (
          <div className="bg-white rounded-xl shadow p-6 space-y-4 text-slate-700 text-base">
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
              <p className="flex items-center gap-2"><LandPlot size={16} /><strong>Lot:</strong> {property.lot_sqft} Acres</p>
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
          <p className="text-gray-500">Loading property details...</p>
        )}

        {/* Property History Card */}
        <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2"> <History size={24} />Property History</h2>
        {property ? (
          <div className="bg-white rounded-xl shadow p-6 space-y-4 text-slate-700 text-base">
            <div className="space-y-2">
              <p className="flex items-center gap-2"><Calendar size={16} /><strong>Year Built:</strong> {property.year_built}</p>
              <p className="flex items-center gap-2"><Calendar size={16} /><strong>Last Sold Date:</strong> {property.last_sold_date}</p>
              <p className="flex items-center gap-2"><DollarSign size={16} /><strong>Last Sold Price:</strong> ${property.sold_price?.toLocaleString()}</p>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">Loading property details...</p>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">

        {/* Top Sections */}
        <div className="flex flex-col lg:flex-row gap-8 mb-10 px-6 items-stretch">
          {/* Carousel Section */}
          <div className="flex-1 max-w-4xl mx-auto">
            <Swiper
              modules={[Navigation]}
              navigation
              spaceBetween={10}
              slidesPerView={1}
              className="rounded-xl shadow"
            >
              {mockImages.map((img, idx) => (
                <SwiperSlide key={idx}>
                  <img
                    src={img}
                    alt={`Property ${idx + 1}`}
                    className="w-full h-full object-cover rounded-xl"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Deal Inputs Section */}
          <div className="bg-white p-6 rounded-xl shadow border w-full lg:w-1/3 flex flex-col justify-between h-full">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Deal Inputs</h2>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Purchase Price", name: "purchase_price" },
                { label: "Down Payment", name: "down_payment" },
                { label: "Monthly Rent", name: "monthly_rent" },
                { label: "Monthly Mortgage", name: "monthly_mortgage" },
                { label: "Yearly Taxes", name: "yearly_taxes" },
                { label: "Yearly Insurance", name: "yearly_insurance" },
                { label: "Maintenance", name: "maintenance" },
                { label: "Vacancy Reserves", name: "vacancy" },
                { label: "Repairs", name: "repairs" }
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {field.label}
                  </label>
                  <input
                    type="number"
                    name={field.name}
                    value={inputs[field.name]}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2 text-sm"
                    placeholder="$0"
                  />
                </div>
              ))}
            </div>
            {/* Analyze Deal Button */}
            <div className="mt-4">
              <button
                onClick={handleAnalyzeDeal}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                Analyze Deal
              </button>
            </div>
          </div>
        </div>

        {/* Deal Analysis */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* NOI */}
          <div className="p-6 bg-white rounded-xl shadow border">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold">Net Operating Income</h3>
              <button
                onClick={() => setShowNOIFormula(!showNOIFormula)}
                className="p-1 text-gray-600 hover:text-gray-800">
                <CircleHelp size={16} />
              </button>
            </div>
            {showNOIFormula && (
              <div className="mt-2 text-sm text-slate-700">
                <BlockMath math="\text{NOI} = \text{Annual Gross Rental Income} - \text{Annual Operating Expenses}" />
              </div>
            )}
            <div className="flex items-center justify-center flex-col">
            <div className="text-2xl font-semibold text-gray-800">
              {analysis ? (
                <BlockMath math={`\\text{NOI} = \\$${analysis.noi}`} />
              ) : (
                <BlockMath math="\text{1,857} = 29974 - 18,9748" />
              )}
            </div>
            </div>
          </div>
          
          {/* Cap Rate */}
          <div className="p-6 bg-white rounded-xl shadow border">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold">Cap Rate</h3>
              <button
                onClick={() => setShowCapFormula(!showCapFormula)}
                className="p-1 text-gray-600 hover:text-gray-800">
                <CircleHelp size={16} />
              </button>
            </div>
            {showCapFormula && (
              <div className="mt-2 text-sm text-slate-700">
                <BlockMath math="\text{Cap Rate} = \frac{\text{NOI}}{\text{Purchase Price}} \times 100\%" />
              </div>
            )}
            <div className="flex items-center justify-center flex-col">
              <div className="text-2xl font-semibold text-gray-800">
                {/* <BlockMath math={`\\text{Cap Rate} = \\frac{\\$${noi}}{\\$${price}} \\times 100\\% = ${capRate}\\%`} /> */}
                <BlockMath math="\text{9.6\%} = \frac{\text{18,750}}{\text{288,750}} \times 100\%" />
              </div>
            </div>
          </div>

          {/* Cash-on-Cash Return */}
          <div className="p-6 bg-white rounded-xl shadow border">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold">Cash-on-Cash Return</h3>
              <button
                onClick={() => setShowCoCFormula(!showCoCFormula)}
                className="p-1 text-gray-800 hover:text-gray-800">
                <CircleHelp size={16} />
              </button>
            </div>
            {showCoCFormula && (
              <div className="mt-2 text-sm text-slate-700">
                <BlockMath math="\text{CoC Return} = \frac{\text{Annual Cash Flow}}{\text{Total Cash Invested}} \times 100\%" />
              </div>
            )}
            <div className="flex items-center justify-center flex-col">
              <div className="text-2xl font-semibold text-gray-800">
                {/* <BlockMath math={`\\text{CoC} = \\frac{\\$${annualCashFlow}}{\\$${cashInvested}} \\times 100\\% = ${cocReturn}\\%`} /> */}
                <BlockMath math="\text{5.7\%} = \frac{\text{18,750}}{\text{30,000}} \times 100\%" />
              </div>
            </div>
          </div>            

          {/* Monthly Cash Flow */}
          <div className="p-6 bg-white rounded-xl shadow border">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold">Monthly Cash Flow</h3>
              <button
                onClick={() => setShowCashFlowFormula(!showCashFlowFormula)}
                className="p-1 text-gray-600 hover:text-gray-800">
                <CircleHelp size={16} />
              </button>
            </div>
            {showCashFlowFormula && (
              <div className="mt-2 text-sm text-slate-700">
                <BlockMath math="\text{Cash Flow} = \frac{\text{NOI}}{\text{12 Months}} - \text{Mortgage Payment}" />
              </div>
            )}
            <div className="flex items-center justify-center flex-col">
              <div className="text-2xl font-semibold text-gray-800">
                {/* <BlockMath math={`\\$${cashFlow} = \\$${netIncome} - \\$${mortgage}`} /> */}
                <BlockMath math="\text{355} = \frac{\text{4544}}{\text{12 Months}} - \text{1650}" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
