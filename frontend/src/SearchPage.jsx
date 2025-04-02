import React, { useState } from "react";

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
  const [properties, setProperties] = useState(mockProperties);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-center text-slate-700">
        Home Investment Analyzer
      </h1>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {properties.map((property) => (
          <div
            key={property.id}
            className="bg-white rounded-xl shadow-md p-6 border hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold text-slate-800 mb-2">
              {property.address}
            </h2>
            <p className="text-lg font-medium text-green-600">
              ${property.listing_price.toLocaleString()}
            </p>
            <p className="text-gray-700">
              {property.beds} beds / {property.baths} baths
            </p>
            <p className="text-gray-600">{property.sqft} sqft</p>
          </div>
        ))}
      </div>
    </div>
  );
}
