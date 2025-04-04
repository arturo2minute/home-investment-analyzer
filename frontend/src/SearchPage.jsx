import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";


export default function SearchPage() {
  const [zipcode, setZipcode] = useState("");
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  
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
    <div className="p-6 max-w-7xl mx-auto">

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
    </div>
  );
}
