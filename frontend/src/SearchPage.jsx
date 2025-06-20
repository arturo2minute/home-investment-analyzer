import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { CircleHelp, ChevronDown, ChevronUp } from "lucide-react";

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
  const [hasSearched, setHasSearched] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false); // Filter closed by default
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minsqft, setMinsqft] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [homeType, setHomeType] = useState("");

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
      fetchProperties(zip, { minPrice, maxPrice, minsqft, bedrooms, homeType });
    }
  }, [location.search]);

  const fetchProperties = async (zip, filters = {}) => {
    try {
      setLoading(true);
      const { minPrice, maxPrice, minsqft, bedrooms, homeType } = filters;
      const query = new URLSearchParams({ zipcode: zip });
      if (minPrice) query.append("minPrice", minPrice);
      if (maxPrice) query.append("maxPrice", maxPrice);
      if (minsqft) query.append("minsqft", minsqft);
      if (bedrooms) query.append("bedrooms", bedrooms);
      if (homeType) query.append("homeType", homeType);
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/properties?${query.toString()}`);
      setProperties(res.data);
    } catch (err) {
      console.error("Error fetching properties:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    console.log("Searching ZIP:", zipcode);

    if (!zipcode) return;

    setHasSearched(true);
    navigate(`/?zipcode=${zipcode}`);
  };

  const handleApplyFilters = () => {
    if (!zipcode) return;
    setHasSearched(true);
    fetchProperties(zipcode, { minPrice, maxPrice, minsqft, bedrooms, homeType });
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
                  className="p-1 text-dark-gray">
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

      <main className="flex-1 max-w-8xl mx-auto">
        {/* Sticky Container for Header and Horizontal Menu */}
        <div className="sticky pb-1 top-0 mx-[-1.5rem] z-10 bg-white">
          {/* Header */}
          <div className="flex pt-1 items-center justify-center">
            <img src="/logo.png" alt="Valora Logo" className="h-10 w-10 mr-2" />
            <h1 className="text-3xl font-bold text-dark-gray">Valora</h1>
          </div>

          {/* Horizontal Menu (Visible on md and up) */}
          <div className="hidden md:block mb-4">
            <div className="max-w-7xl mx-auto px-4">
              <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(120px,auto))] justify-center">
                {strategies.map((s) => {
                  const isOpen = openDescriptions[s.id];
                  const isSelected = analysisType === s.id;

                  return (
                    <div key={s.id} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => setAnalysisType(s.id)}
                          className={`w-full text-left py-2 px-3 rounded-md font-medium flex items-center gap-2 ${
                            isSelected ? "bg-teal text-white" : "text-dark-gray hover:bg-soft-teal"
                          }`}>
                          {s.label}
                        </button>
                        <button
                          onClick={() => toggleDescription(s.id)}
                          className="p-1 text-dark-gray">
                          {isOpen ? <CircleHelp size={16} /> : <CircleHelp size={16} />}
                        </button>
                      </div>
                      {isOpen && (
                        <p className="text-sm text-dark-gray px-3">{s.description}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Search with background */}
        <div className="mx-[-1.5rem] mb-6">
          <div
            className="relative py-60"
            style={{ backgroundImage: `url('/home.png')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className="absolute inset-0 bg-black opacity-30"></div>
            {/* Sticky Search Bar */}
            <div className="sticky top-[6rem] flex items-center justify-center gap-4">
              <input
                type="text"
                placeholder="Enter ZIP code"
                value={zipcode}
                onChange={(e) => setZipcode(e.target.value)}
                className="border border-light-gray px-4 py-2 rounded w-48 bg-white shadow-sm"
              />
              <button
                onClick={handleSearch}
                className="bg-teal text-white px-4 py-2 rounded hover:bg-soft-teal hover:text-med-gray"
              >
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Filter Section with Toggle */}
        <div className="max-w-7xl mx-auto mb-6">
          <div className="bg-light-gray p-2 rounded-2xl shadow-lg">
            <div className="flex justify-between px-2 pt-1 items-center mb-2">
              <h2 className="text-xl font-bold text-dark-gray">Filter</h2>
              <button onClick={() => setIsFilterOpen(!isFilterOpen)} className="bg-teal text-white rounded-full hover:bg-soft-teal">
                {isFilterOpen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
            {isFilterOpen && (
              <div>
                <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-4 px-2">
                  <div>
                    <label className="block text-sm font-medium text-dark-gray mb-1">Min Price</label>
                    <input type="number" placeholder="Min Price" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} className="border border-light-gray px-4 py-2 rounded w-full bg-white shadow-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-gray mb-1">Max Price</label>
                    <input type="number" placeholder="Max Price" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="border border-light-gray px-4 py-2 rounded w-full bg-white shadow-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-gray mb-1">Min sqft</label>
                    <input type="number" placeholder="Min sqft" value={minsqft} onChange={(e) => setMinsqft(e.target.value)} className="border border-light-gray px-4 py-2 rounded w-full bg-white shadow-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-gray mb-1">Bedrooms</label>
                    <select value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} className="border border-light-gray px-4 py-2 rounded w-full bg-white shadow-sm">
                      <option value="">Any</option>
                      <option value="1">1+</option>
                      <option value="2">2+</option>
                      <option value="3">3+</option>
                      <option value="4">4+</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-gray mb-1">Home Type</label>
                    <select value={homeType} onChange={(e) => setHomeType(e.target.value)} className="border border-light-gray px-4 py-2 rounded w-full bg-white shadow-sm">
                      <option value="">Any</option>
                      <option value="Single Family">Single Family</option>
                      <option value="Land">Land</option>
                      <option value="Mobile">Mobile</option>
                      <option value="Multi Family">Multi Family</option>
                      <option value="Apartment">Apartment</option>
                    </select>
                  </div>
                </div>
                <div className="mt-4 flex justify-center pb-2">
                  <button onClick={handleApplyFilters} className="bg-teal text-white px-4 py-2 rounded hover:bg-soft-teal hover:text-med-gray">Apply Filters</button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Use Message */}
        {!hasSearched && properties.length === 0 && (
          <div className="bg-light-gray border border-teal text-dark-gray p-5 rounded-xl mb-10 shadow-sm max-w-7xl mx-auto">
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
        <div className="grid gap-14 grid-cols-1 max-w-7xl sm:grid-cols-2 lg:grid-cols-3 mx-auto">
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
                    e.target.src = "/fallback.png";}}/>
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
