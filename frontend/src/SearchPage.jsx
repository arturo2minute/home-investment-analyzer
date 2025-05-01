import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronDown, ChevronUp, CircleHelp } from "lucide-react";

const strategies = [
  {id: "buy_and_live_and_rent",
    label: "🏠 Buy & Live & Rent", 
    description: "Purchase a property, live in the property for owner-occupied financing requirements, rent it out long-term for passive income and appreciation." 
  },
  {id: "buy_and_rent",
    label: "🏠 Buy & Rent", 
    description: "Purchase a property and rent it out long-term for passive income and appreciation." 
  },
  {id: "househack",
    label: "🧑‍🤝‍🧑 Househack", 
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
    label: "🏢 Commercial", 
    description: "Invest in multifamily (5+ units), office, or retail properties for stable, large-scale income." 
  }
];

export default function SearchPage() {
  const [zipcode, setZipcode] = useState("");
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [analysisType, setAnalysisType] = useState("buy_and_live_and_rent");
  const [openDescriptions, setOpenDescriptions] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const toggleDescription = (id) => {
    setOpenDescriptions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const zip = queryParams.get("zipcode");
    if (zip) {
      setZipcode(zip);
      fetchProperties(zip);
    }
  }, [location.search]);

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
      {/* Mobile Sidebar Toggle */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="bg-teal text-white px-4 py-2 rounded-md shadow-lg"
        >
          ☰
        </button>
      </div>

      {/* Sidebar (Visible on Mobile Only) */}
      <aside className={`fixed top-0 left-0 min-h-screen bg-light-gray border-r p-6 space-y-4 z-40 w-72 overflow-y-auto transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:hidden`}>
        <div className="md:hidden flex justify-end mb-4">
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="text-dark-gray">
            ✕
          </button>
        </div>

        <h2 className="text-xl font-bold text-dark-gray mb-4">Analysis Mode</h2>
        {strategies.map((s) => {
          const isOpen = openDescriptions[s.id];
          const isSelected = analysisType === s.id;

          return (
            <div key={s.id} className="space-y-1">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setAnalysisType(s.id)}
                  className={`flex-1 text-left py-2 px-3 rounded-md font-medium flex items-center gap-2 ${
                    isSelected ? "bg-teal text-white" : "text-dark-gray hover:bg-soft-teal"
                  }`}>
                  {s.label}
                </button>
                <button
                  onClick={() => toggleDescription(s.id)}
                  className="p-1 text-dark-gray"
                >
                  {isOpen ? <CircleHelp size={16} /> : <CircleHelp size={16} />}
                </button>
              </div>
              {isOpen && (
                <p className="text-sm text-dark-gray px-3">{s.description}</p>
              )}
            </div>
          );
        })}
      </aside>

      <main className="flex-1 p-6 max-w-8xl mx-auto pt-20 md:pt-6">

        {/* Header */}
        <div className="flex items-center justify-center mb-4">
          <img src="/logo.png" alt="Valora Logo" className="h-10 w-10 mr-2" />
          <h1 className="text-3xl font-bold text-dark-gray">Valora</h1>
        </div>

        {/* Horizontal Menu (Visible on md and up) */}
        <div className="hidden md:block mb-4">
          <div className="flex flex-wrap justify-between gap-1 lg:gap-4">
            {strategies.map((s) => {
              const isSelected = analysisType === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setAnalysisType(s.id)}
                  className={`py-2 px-2 rounded-md font-medium ${
                    isSelected ? "bg-teal text-white" : "text-dark-gray hover:bg-soft-teal"
                  }`}>
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Search with background */}
        <div className="mx-[-1.5rem] mb-6">
          <div
            className="relative py-60"
            style={{ backgroundImage: `url('/home.png')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className="absolute inset-0 bg-black opacity-30"></div>
            <div className="relative z-10 flex items-center justify-center gap-4">
              <input
                type="text"
                placeholder="Enter ZIP code"
                value={zipcode}
                onChange={(e) => setZipcode(e.target.value)}
                className="border border-light-gray px-4 py-2 rounded w-48"/>
              <button
                onClick={handleSearch}
                className="bg-teal text-white px-4 py-2 rounded hover:bg-soft-teal hover:text-med-gray">
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Use Message */}
        {!zipcode && properties.length === 0 && (
          <div className="bg-light-gray border border-teal text-dark-gray p-6 rounded-xl mb-10 shadow-sm">
            <h2 className="text-2xl font-bold mb-2 text-dark-gray">Welcome to the Home Investment Analyzer! 🏡</h2>
            <p className="mb-2 text-dark-gray">
              This tool helps you evaluate potential real estate deals across multiple investment strategies — like Buy & Hold, BRRRR, Short-Term Rentals, and more.
            </p>
            <p className="mb-2 text-dark-gray">
              💡 To get started, choose your preferred strategy from the sidebar on the left, then enter a ZIP code above to find and analyze properties in that area.
            </p>
            <p className="text-dark-gray">
              Once results are shown, each property card will give you quick insights based on your selected investment approach.
            </p>
          </div>
        )}

        {/* Property Cards */}
        <div className="grid gap-14 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <div
              key={property.id}
              className="bg-light-gray rounded-2xl shadow-lg p-8 border hover:border-teal hover:shadow-xl transition hover:scale-105">
              <a href={property.property_url} target="_blank" rel="noopener noreferrer" className="block mb-4">
                <img
                  src={property.image_url || "/fallback.png"}
                  alt={`${property.address} Preview`}
                  className="w-full h-64 object-cover rounded mb-4"
                  onError={(e) => {
                    e.target.src = "/fallback.png";}}
                />
              </a>
              <h2 className="text-xl font-semibold text-dark-gray mb-2">
                {property.address}, {property.city}, {property.state}
              </h2>
              <p className="text-2xl font-medium text-green">${property.listing_price.toLocaleString()}</p>
              <p className="text-dark-gray">
                {property.beds === 0 ? "--" : property.beds} beds | {property.baths === 0 ? "--" : property.baths} baths |{" "}
                {property.sqft === 0 ? "--" : property.sqft} sqft
              </p>
              <p className="text-dark-gray">
                {property.lot_size === 0 ? "--" : property.lot_size} Acres | {property.home_type} | Built{" "}
                {property.year_built === 0 ? "N/A" : property.year_built}
              </p>
              <button
                onClick={() => navigate(`/property/${property.id}/${analysisType}`)}
                className="mt-4 bg-teal text-white px-4 py-2 rounded hover:bg-soft-teal hover:text-dark-gray">
                Analyze Deal
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
