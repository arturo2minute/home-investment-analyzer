import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";

const strategies = [
  {id: "buy_and_rent",
    label: "🏠 Buy & Rent",
    description: "Purchase a property and rent it out long-term for passive income and appreciation."
  },
  {id: "buy_and_Live_and_rent",
    label: "🏠 Buy & Live & Rent",
    description: "Purchase a property, live in the property for owner-occupied financing requirements, rent it out long-term for passive income and appreciation."
  },
  {id: "househack",
    label: "🧑‍🤝‍🧑 Househack & Hold",
    description: "Live in one part of the property while renting out the rest to reduce living costs."
  },
  {id: "brrrr",
    label: "🔁 BRRRR",
    description: "Buy, Rehab, Rent, Refinance, Repeat — a strategy to recycle capital into more deals."
  },
  {id: "fix_and_flip",
    label: "🛠 Fix & Flip",
    description: "Purchase undervalued homes, renovate them, and sell for a profit."
  },
  {id: "short_term",
    label: "🏖 Short-Term Rental",
    description: "List the property on Airbnb or similar platforms for nightly income."
  },
  {id: "commercial",
    label: "🏢 Commercial Real Estate",
    description: "Invest in multifamily, office, or retail properties for stable, large-scale income."
  }
];

export default function SearchPage() {
  const [zipcode, setZipcode] = useState("");
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [analysisType, setAnalysisType] = useState("buy_and_hold");
  const [openDescriptions, setOpenDescriptions] = useState({});

  const navigate = useNavigate();
  const location = useLocation();

  const toggleDescription = (id) => {
    setOpenDescriptions((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  // Extract ZIP from URL query parameters
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const zip = queryParams.get("zipcode");
    if (zip) {
      setZipcode(zip);
      fetchProperties(zip);
    }
  }, [location.search]);

  // Gets property data
  const fetchProperties = async (zip) => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:8000/properties?zipcode=${zip}`);
      setProperties(res.data);
    } catch (err) {
      console.error("Error fetching properties:", err);
    } finally {
      setLoading(false);
    }
  };

  // Function handles search capabilities
  const handleSearch = async () => {
    console.log("Searching ZIP:", zipcode);

    if (!zipcode) return;

    navigate(`/?zipcode=${zipcode}`);
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-72 bg-gray-100 border-r p-6 space-y-4 overflow-y-auto">
      <h2 className="text-xl font-bold text-slate-700 mb-4">Analysis Mode</h2>
      {strategies.map((s) => {
        const isOpen = openDescriptions[s.id];
        const isSelected = analysisType === s.id;

        return (
          <div key={s.id} className="space-y-1">
            <div className="flex items-center justify-between">
              <button
                onClick={() => toggleDescription(s.id)}
                className="p-1 text-gray-600 hover:text-gray-800"
              >
                {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              <button
                onClick={() => setAnalysisType(s.id)}
                className={`flex-1 text-left py-2 px-3 rounded-md font-medium flex items-center gap-2 ${
                  isSelected
                    ? "bg-blue-600 text-white"
                    : "hover:bg-blue-100 text-slate-700"
                }`}
              >
                {s.label}
              </button>
            </div>
            {isOpen && (
              <p className="text-sm text-slate-600 px-3">{s.description}</p>
            )}
          </div>
        );
      })}
    </aside>

      <main className="flex-1 p-6 max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl font-bold mb-4 text-center text-slate-700">
          Home Investment Analyzer
        </h1>

        {/* Search */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <input
            type="text"
            placeholder="Enter ZIP code"
            value={zipcode}
            onChange={(e) => setZipcode(e.target.value)}
            className="border px-4 py-2 rounded w-48"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Search
          </button>
        </div>

        {/* Property Cards */}
        <div className="grid gap-14 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <div
              key={property.id}
              className="bg-white rounded-2xl shadow-lg p-8 border hover:shadow-xl transition transform scale-105"
            >
              <a
                href={property.property_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block mb-4">
                <img
                  src={`https://api.microlink.io?url=https://www.realtor.com/realestateandhomes-detail/9459554761&screenshot=true&meta=false&embed=screenshot.url`}
                  alt="Property Preview"
                  className="w-full h-64 object-cover rounded mb-4"
                  onError={(e) => { e.target.src = "/fallback.png"; }}
                />
              </a>
              <h2 className="text-x.75 font-semibold text-slate-800 mb-2">
                {property.address}, {property.city}, {property.state}
              </h2>
              <p className="text-2xl font-medium text-green-600">
                ${property.listing_price.toLocaleString()}
              </p>
              <p className="text-gray-700">
                {property.beds} beds | {property.baths} baths | {property.sqft} sqft
              </p>
              <p className="text-gray-600">
                {property.lot_sqft} Acres | {property.home_type} | Built {property.year_built}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
