"use client";

import { useState } from "react";
import { X } from "lucide-react";
import AdvancedFilters from "./AdvancedFilters";

export default function FilterModal({
  allAmenities,
  onFilterChange,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleFilterChange = (filters) => {
    onFilterChange(filters);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Filter Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="glass px-2 py-2 rounded-lg text-white hover:bg-white/20 transition-all duration-300 flex items-center gap-2 whitespace-nowrap">
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
          />
        </svg>
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black z-40"
          onClick={handleClose}
        />
      )}

      {/* Modal */}
      <div
        className={`fixed top-0 right-0 h-screen w-full sm:w-96 bg-gray-900 border-l border-gray-800 z-50 transform transition-transform duration-300 overflow-y-auto flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-4 flex items-center justify-end z-10">
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-800 rounded transition">
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        <div className="flex-1 p-6 overflow-y-auto">
          <AdvancedFilters
            onFilterChange={handleFilterChange}
            allAmenities={allAmenities}
          />
        </div>

        {/* Footer with Filter and Cancel buttons */}
        <div className="sticky bottom-0 bg-gray-900 border-t border-gray-800 p-4 flex gap-3">
          <button
            onClick={handleClose}
            className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition">
            cancel
          </button>
          <button
            onClick={handleClose}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-semibold">
            Filter
          </button>
        </div>
      </div>
    </>
  );
}
