import React, { useState } from "react";
import axios from "axios";

const mockProperties = [
  {
    id: 1,
    address: "123 Main St, Portland, OR",
    listing_price: 475000,
    beds: 3,
    baths: 2,
    sqft: 1500,
  },
  {
    id: 2,
    address: "456 Oak Ave, Eugene, OR",
    listing_price: 389000,
    beds: 2,
    baths: 1,
    sqft: 1100,
  },
  {
    id: 3,
    address: "789 Pine Ln, Salem, OR",
    listing_price: 525000,
    beds: 4,
    baths: 3,
    sqft: 2100,
  },
];

export default function SearchPage() {
  //const [properties, setProperties] = useState(mockProperties);
  const [zipcode, setZipcode] = useState("");
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Function handles search capabilities
  const handleSearch = async () => {
    console.log("Searching ZIP:", zipcode);

    if (!zipcode) return;

    try {
      setLoading(true);

      // Connect to backend and scrap for given zip code
      const res = await axios.get(`http://localhost:8000/properties?zipcode=${zipcode}`);
      console.log("API response:", res.data);

      // Set returned data to property
      setProperties(res.data);

    } catch (err) {
      console.error("Error fetching properties:", err);
    } finally {
      setLoading(false);
    }
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
            <h2 className="text-x.75 font-semibold text-slate-800 mb-2">
              {property.address}, {property.city}, {property.state}
            </h2>
            <p className="text-lg font-medium text-green-600">
              ${property.listing_price.toLocaleString()}
            </p>
            <p className="text-gray-700">
              {property.beds} beds | {property.baths} baths | {property.sqft} sqft
            </p>
            <p className="text-gray-600">
              {property.lot_sqft} acres | {property.home_type} | Built {property.year_built}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
