import React from "react";
import { useParams } from "react-router-dom";

export default function BuyRent() {
  const { id } = useParams();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Buy & Rent Analysis</h1>
      <p className="mt-4">Analyzing property ID: {id}</p>
    </div>
  );
}