import React from "react";
import { useParams } from "react-router-dom";

export default function PropertyDetail() {
  const { id } = useParams();

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-700 mb-4">
        Property Detail: {id}
      </h1>
      <p>This page will show detailed investment analysis for the selected property.</p>
    </div>
  );
}