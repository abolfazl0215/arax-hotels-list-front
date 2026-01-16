"use client";

import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";

export default function AdvancedFilters({
  onFilterChange,
  allAmenities = [],
}) {
  const [filters, setFilters] = useState({
    stars: [],
    distanceToCenter: null,
    selectedOptions: [],
    optionInput: "",
    contactDisplay: null, // 'photo', 'whatsapp', 'website', 'email', 'tel'
  });

  const handleStarsChange = (star) => {
    setFilters((prev) => {
      const newStars = prev.stars.includes(star)
        ? prev.stars.filter((s) => s !== star)
        : [...prev.stars, star];
      return { ...prev, stars: newStars };
    });
  };

  const handleDistanceChange = (distance) => {
    setFilters((prev) => ({
      ...prev,
      distanceToCenter: prev.distanceToCenter === distance ? null : distance,
    }));
  };

  const handleAddOption = () => {
    if (filters.optionInput.trim()) {
      const newOption = filters.optionInput.trim();
      if (!filters.selectedOptions.includes(newOption)) {
        setFilters((prev) => ({
          ...prev,
          selectedOptions: [...prev.selectedOptions, newOption],
          optionInput: "",
        }));
      }
    }
  };

  const handleRemoveOption = (option) => {
    setFilters((prev) => ({
      ...prev,
      selectedOptions: prev.selectedOptions.filter((opt) => opt !== option),
    }));
  };

  const handleContactDisplayChange = (value) => {
    setFilters((prev) => ({
      ...prev,
      contactDisplay: prev.contactDisplay === value ? null : value,
    }));
  };

  const resetFilters = () => {
    setFilters({
      stars: [],
      distanceToCenter: null,
      selectedOptions: [],
      optionInput: "",
      contactDisplay: null,
    });
  };

  // استفاده از useRef برای debounce و جلوگیری از infinite loop
  const debounceTimerRef = useRef(null);

  useEffect(() => {
    // Debounce the filter change callback
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      // تبدیل filters به فرمت مورد نیاز برای filterUtils
      const formattedFilters = {
        stars: filters.stars,
        distanceToCenter: filters.distanceToCenter,
        options: filters.selectedOptions.join(" "), // تبدیل به string برای سازگاری
        selectedOptions: filters.selectedOptions,
        hasPhoto: filters.contactDisplay === "photo",
        hasWhatsapp: filters.contactDisplay === "whatsapp",
        hasWebsite: filters.contactDisplay === "website",
        hasEmail: filters.contactDisplay === "email",
        hasTel: filters.contactDisplay === "tel",
      };
      onFilterChange(formattedFilters);
    }, 100); // 100ms delay

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [filters, onFilterChange]);

  const hasActiveFilters =
    filters.stars.length > 0 ||
    filters.distanceToCenter !== null ||
    filters.selectedOptions.length > 0 ||
    filters.contactDisplay !== null;

  return (
    <div className="space-y-6">
      {/* Header with Clear All */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">فیلترهای پیشرفته</h2>
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="text-sm px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white transition">
            Clear All
          </button>
        )}
      </div>

      {/* Stars Filter */}
      <div>
        <label className="text-white font-medium mb-3 block">Stars</label>
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => handleStarsChange(star)}
              className={`px-4 py-2 rounded transition ${
                filters.stars.includes(star)
                  ? "bg-yellow-500 text-black font-semibold"
                  : "bg-gray-700 text-white hover:bg-gray-600"
              }`}>
              {star}★
            </button>
          ))}
        </div>
      </div>

      {/* Location (distance to center) Filter */}
      <div>
        <label className="text-white font-medium mb-3 block">
          Location (distance to center)
        </label>
        <div className="flex flex-wrap gap-2">
          {[
            { label: "0", value: "0" },
            { label: "-5", value: "-5" },
            { label: "5-10", value: "5-10" },
            { label: "+10", value: "+10" },
          ].map((distance) => (
            <button
              key={distance.value}
              onClick={() => handleDistanceChange(distance.value)}
              className={`px-4 py-2 rounded transition ${
                filters.distanceToCenter === distance.value
                  ? "bg-blue-600 text-white font-semibold"
                  : "bg-gray-700 text-white hover:bg-gray-600"
              }`}>
              {distance.label}
            </button>
          ))}
        </div>
      </div>

      {/* Options Filter */}
      <div>
        <label className="text-white font-medium mb-3 block">Options</label>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={filters.optionInput}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, optionInput: e.target.value }))
            }
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddOption();
              }
            }}
            placeholder="gym, pool, ..."
            className="flex-1 px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
          <button
            onClick={handleAddOption}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition flex items-center justify-center">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        </div>
        {/* Selected Options Tags */}
        {filters.selectedOptions.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {filters.selectedOptions.map((option) => (
              <span
                key={option}
                className="inline-flex items-center gap-1 px-3 py-1 bg-gray-700 text-white rounded-full text-sm">
                {option}
                <button
                  onClick={() => handleRemoveOption(option)}
                  className="hover:text-red-400 transition">
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Contact/Display Options */}
      <div>
        <label className="text-white font-medium mb-3 block">
          Contact / Display
        </label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Photo", value: "photo" },
            { label: "Whatsapp", value: "whatsapp" },
            { label: "Website", value: "website" },
            { label: "Email", value: "email" },
            { label: "Tel", value: "tel" },
          ].map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="contactDisplay"
                checked={filters.contactDisplay === option.value}
                onChange={() => handleContactDisplayChange(option.value)}
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-white">{option.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
