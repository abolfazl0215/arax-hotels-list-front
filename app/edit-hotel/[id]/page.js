"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import useHotelStore from "../../store/hotelStore";
import axios from "axios";

export default function EditHotel() {
  const params = useParams();
  const router = useRouter();
  const { hotels, updateHotel } = useHotelStore();

  const hotel = hotels.find((h) => h._id === params.id);

  const [formData, setFormData] = useState(null);

  useEffect(() => {
    if (hotel) {
      setFormData({
        name: hotel.name || "",
        address: hotel.address || "",
        location: hotel.location || { lat: 0, lng: 0 },
        tel: hotel.tel && hotel.tel.length > 0 ? hotel.tel : [""],
        email: hotel.email || "",
        website: hotel.website || "",
        whatsapp: hotel.whatsapp || "",
        retesDescription: hotel.retesDescription || "",
        stars: hotel.stars || 0,
        ratesInfo: hotel.ratesInfo || {
          hotelCost: 0,
          referralCommission: 0,
          referralCommissionType: "percent",
          extraAdultCommission: 0,
          extraAdultCommissionType: "percent",
          extraChildCommission: 0,
          extraChildCommissionType: "percent",
        },
        options:
          hotel.options && hotel.options.length > 0
            ? hotel.options
            : [""],
        photos:
          hotel.photos && hotel.photos.length > 0
            ? hotel.photos
            : [""],
        units:
          hotel.units && hotel.units.length > 0
            ? hotel.units.map((unit) => ({
                ...unit,
                name: unit.name || "",
                quanntity: unit.quanntity || 1,
                squareMeters: unit.squareMeters || 0,
                photos:
                  unit.photos && unit.photos.length > 0
                    ? unit.photos
                    : [""],
                amenities:
                  unit.amenities && unit.amenities.length > 0
                    ? unit.amenities
                    : [""],
              }))
            : [
                {
                  name: "",
                  quanntity: 1,
                  squareMeters: 0,
                  photos: [""],
                  numOftwinBeds: 0,
                  numOfSingleBeds: 0,
                  numOfKingBeds: 0,
                  numOfQueenBeds: 0,
                  amenities: [""],
                  numOfFits: 1,
                  pricePerNight: [
                    { season: "low", price: 0 },
                    { season: "high", price: 0 },
                    { season: "peak", price: 0 },
                    { season: "event", price: 0 },
                  ],
                },
              ],
      });
    }
  }, [hotel]);

  if (!hotel) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="glass-strong rounded-2xl p-8 text-center">
          <p className="text-gray-400 text-lg mb-4">
            Hotel not found
          </p>
          <Link
            href="/"
            className="text-blue-400 hover:text-blue-300">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="glass-strong rounded-2xl p-8 text-center">
          <p className="text-gray-400 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNestedChange = (field, subField, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        [subField]: value,
      },
    }));
  };

  const handleArrayChange = (field, index, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) =>
        i === index ? value : item,
      ),
    }));
  };

  const handleAddArrayItem = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const handleRemoveArrayItem = (field, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleUnitChange = (unitIndex, field, value) => {
    setFormData((prev) => ({
      ...prev,
      units: prev.units.map((unit, i) =>
        i === unitIndex ? { ...unit, [field]: value } : unit,
      ),
    }));
  };

  const handleUnitPriceChange = (unitIndex, seasonIndex, value) => {
    setFormData((prev) => ({
      ...prev,
      units: prev.units.map((unit, i) =>
        i === unitIndex
          ? {
              ...unit,
              pricePerNight: unit.pricePerNight.map((price, j) =>
                j === seasonIndex
                  ? { ...price, price: Number(value) }
                  : price,
              ),
            }
          : unit,
      ),
    }));
  };

  const handleAddUnit = () => {
    setFormData((prev) => ({
      ...prev,
      units: [
        ...prev.units,
        {
          name: "",
          quanntity: 1,
          squareMeters: 0,
          photos: [""],
          numOftwinBeds: 0,
          numOfSingleBeds: 0,
          numOfKingBeds: 0,
          numOfQueenBeds: 0,
          amenities: [""],
          numOfFits: 1,
          pricePerNight: [
            { season: "low", price: 0 },
            { season: "high", price: 0 },
            { season: "peak", price: 0 },
            { season: "event", price: 0 },
          ],
        },
      ],
    }));
  };

  const handleRemoveUnit = (index) => {
    setFormData((prev) => ({
      ...prev,
      units: prev.units.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clean up empty strings from arrays
    const cleanedData = {
      ...formData,
      tel: formData.tel.filter((t) => t.trim() !== ""),
      options: formData.options.filter((o) => o.trim() !== ""),
      photos: formData.photos.filter((p) => p.trim() !== ""),
      units: formData.units.map((unit) => ({
        ...unit,
        photos: unit.photos.filter((p) => p.trim() !== ""),
        amenities: unit.amenities.filter((a) => a.trim() !== ""),
      })),
    };

    updateHotel(hotel._id, { ...cleanedData, type: "hotel" });
    const response = await axios.put(
      `https://arax-hotels-list-back-1.onrender.com/api/hotels/${hotel._id}`,
      cleanedData,
    );
    router.push(`/hotel/${hotel._id}`);
  };

  return (
    <div className="min-h-screen bg-[#0B0B0D]">
      <div className="container mx-auto px-2 py-6">
        <div className="glass-strong rounded-2xl p-2 sm:p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold p-3 text-white">
              Edit
            </h1>
            <div className="flex gap-1 items-start p-3">
              <Link
                href={`/hotel/${hotel._id}`}
                className="px-6 py-2.5 rounded-lg glass text-white hover:bg-white/20 transition-all duration-300">
                Cancel
              </Link>
              <button
                type="submit"
                form="hotel-form"
                className="px-6 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 font-semibold">
                Save
              </button>
            </div>
          </div>

          <form
            id="hotel-form"
            onSubmit={handleSubmit}
            className="space-y-8">
            {/* Basic Info Section */}
            <div className="glass rounded-xl p-3 py-6">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <svg
                  className="w-6 h-6 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Basic Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Hotel Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      handleInputChange("name", e.target.value)
                    }
                    className="w-full px-4 py-3 rounded-lg glass text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="Enter hotel name"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    className="w-full px-4 py-3 rounded-lg glass text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="Enter full address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    تعداد ستاره (Stars)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    value={formData.stars}
                    onChange={(e) =>
                      handleInputChange(
                        "stars",
                        Number(e.target.value),
                      )
                    }
                    className="w-full px-4 py-3 rounded-lg glass text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.location.lat}
                    onChange={(e) =>
                      handleNestedChange(
                        "location",
                        "lat",
                        Number(e.target.value),
                      )
                    }
                    className="w-full px-4 py-3 rounded-lg glass text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="0.000000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.location.lng}
                    onChange={(e) =>
                      handleNestedChange(
                        "location",
                        "lng",
                        Number(e.target.value),
                      )
                    }
                    className="w-full px-4 py-3 rounded-lg glass text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="0.000000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      handleInputChange("email", e.target.value)
                    }
                    className="w-full px-4 py-3 rounded-lg glass text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="hotel@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) =>
                      handleInputChange("website", e.target.value)
                    }
                    className="w-full px-4 py-3 rounded-lg glass text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="https://example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    WhatsApp
                  </label>
                  <input
                    type="text"
                    value={formData.whatsapp}
                    onChange={(e) =>
                      handleInputChange("whatsapp", e.target.value)
                    }
                    className="w-full px-4 py-3 rounded-lg glass text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="+1234567890"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Phone Numbers
                  </label>
                  <div className="space-y-2">
                    {formData.tel.map((tel, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={tel}
                          onChange={(e) =>
                            handleArrayChange(
                              "tel",
                              index,
                              e.target.value,
                            )
                          }
                          className="flex-1 px-4 py-3 rounded-lg glass text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                          placeholder="+1234567890"
                        />
                        {formData.tel.length > 1 && (
                          <button
                            type="button"
                            onClick={() =>
                              handleRemoveArrayItem("tel", index)
                            }
                            className="px-3 py-3 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all shrink-0"
                            title="Remove">
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => handleAddArrayItem("tel")}
                      className="px-4 py-2 rounded-lg glass text-blue-400 hover:bg-white/10 transition-all text-sm font-medium">
                      + Add Phone Number
                    </button>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Rates Description
                  </label>
                  <textarea
                    value={formData.retesDescription}
                    onChange={(e) =>
                      handleInputChange(
                        "retesDescription",
                        e.target.value,
                      )
                    }
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg glass text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                    placeholder="Describe your rates and policies..."
                  />
                </div>
              </div>
            </div>

            {/* Rates Info Section */}
            <div className="glass rounded-xl p-3 py-6">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <svg
                  className="w-6 h-6 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                اطلاعات سود و کمیسیون
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    هزینه هتل (هر شب - دلار)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.ratesInfo.hotelCost}
                    onChange={(e) =>
                      handleNestedChange(
                        "ratesInfo",
                        "hotelCost",
                        Number(e.target.value),
                      )
                    }
                    className="w-full px-4 py-3 rounded-lg glass text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    کمیسیون معرفی
                  </label>
                  <div className="flex gap-1 w-full overflow-hidden">
                    <input
                      type="number"
                      min="0"
                      value={formData.ratesInfo.referralCommission}
                      onChange={(e) =>
                        handleNestedChange(
                          "ratesInfo",
                          "referralCommission",
                          Number(e.target.value),
                        )
                      }
                      className="flex-1 px-4 py-3 rounded-lg glass text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      placeholder="0"
                    />
                    <select
                      value={
                        formData.ratesInfo.referralCommissionType
                      }
                      onChange={(e) =>
                        handleNestedChange(
                          "ratesInfo",
                          "referralCommissionType",
                          e.target.value,
                        )
                      }
                      className="px-2 py-3 rounded-lg glass text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all">
                      <option value="percent">%</option>
                      <option value="fixed">$</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    کمیسیون مهمان اضافه (بزرگسال)
                  </label>
                  <div className="flex gap-1">
                    <input
                      type="number"
                      min="0"
                      value={formData.ratesInfo.extraAdultCommission}
                      onChange={(e) =>
                        handleNestedChange(
                          "ratesInfo",
                          "extraAdultCommission",
                          Number(e.target.value),
                        )
                      }
                      className="flex-1 px-4 py-3 rounded-lg glass text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      placeholder="0"
                    />
                    <select
                      value={
                        formData.ratesInfo.extraAdultCommissionType
                      }
                      onChange={(e) =>
                        handleNestedChange(
                          "ratesInfo",
                          "extraAdultCommissionType",
                          e.target.value,
                        )
                      }
                      className="w-28 px-1 py-3 rounded-lg glass text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all">
                      <option value="percent">%</option>
                      <option value="fixed">$</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    کمیسیون مهمان اضافه (کودک)
                  </label>
                  <div className="flex gap-1">
                    <input
                      type="number"
                      min="0"
                      value={formData.ratesInfo.extraChildCommission}
                      onChange={(e) =>
                        handleNestedChange(
                          "ratesInfo",
                          "extraChildCommission",
                          Number(e.target.value),
                        )
                      }
                      className="flex-1 px-4 py-3 rounded-lg glass text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      placeholder="0"
                    />
                    <select
                      value={
                        formData.ratesInfo.extraChildCommissionType
                      }
                      onChange={(e) =>
                        handleNestedChange(
                          "ratesInfo",
                          "extraChildCommissionType",
                          e.target.value,
                        )
                      }
                      className="w-28 px-1 py-3 rounded-lg glass text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all">
                      <option value="percent">%</option>
                      <option value="fixed">$</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Amenities Section */}
            <div className="glass rounded-xl p-3 py-6">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <svg
                  className="w-6 h-6 text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
                Amenities
              </h2>
              <div className="space-y-2">
                {formData.options.map((option, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) =>
                        handleArrayChange(
                          "options",
                          index,
                          e.target.value,
                        )
                      }
                      className="flex-1 px-4 py-3 rounded-lg glass text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      placeholder="Enter amenity"
                    />
                    {formData.options.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveArrayItem("options", index)
                        }
                        className="px-3 py-3 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all shrink-0"
                        title="Remove">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => handleAddArrayItem("options")}
                  className="px-4 py-2 rounded-lg glass text-blue-400 hover:bg-white/10 transition-all text-sm font-medium">
                  + Add Amenity
                </button>
              </div>
            </div>

            {/* Photos Section */}
            <div className="glass rounded-xl p-3 py-6">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <svg
                  className="w-6 h-6 text-pink-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                تصاویر هتل
              </h2>
              <div className="space-y-2">
                {formData.photos.map((photo, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="url"
                      value={photo}
                      onChange={(e) =>
                        handleArrayChange(
                          "photos",
                          index,
                          e.target.value,
                        )
                      }
                      className="flex-1 px-4 py-3 rounded-lg glass text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      placeholder="https://example.com/image.jpg"
                    />
                    {formData.photos.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveArrayItem("photos", index)
                        }
                        className="px-3 py-3 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all shrink-0"
                        title="Remove">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => handleAddArrayItem("photos")}
                  className="px-4 py-2 rounded-lg glass text-blue-400 hover:bg-white/10 transition-all text-sm font-medium">
                  + Add Photo
                </button>
              </div>
            </div>

            {/* Units Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
                  <svg
                    className="w-7 h-7 text-yellow-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  Units ({formData.units.length})
                </h2>
                <button
                  type="button"
                  onClick={handleAddUnit}
                  className="px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all font-medium">
                  + Add Unit
                </button>
              </div>

              {formData.units.map((unit, unitIndex) => (
                <div
                  key={unitIndex}
                  className="glass rounded-xl p-6 space-y-6 border border-white/5">
                  <div className="flex items-center justify-between pb-4 border-b border-white/10">
                    <h3 className="text-lg font-semibold text-white">
                      واحد {unitIndex + 1}
                    </h3>
                    {formData.units.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveUnit(unitIndex)}
                        className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all font-medium text-sm">
                        Remove Unit
                      </button>
                    )}
                  </div>

                  {/* Unit basic info: name, quantity, square meters */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Unit Name
                      </label>
                      <input
                        type="text"
                        value={unit.name}
                        onChange={(e) =>
                          handleUnitChange(
                            unitIndex,
                            "name",
                            e.target.value,
                          )
                        }
                        className="w-full px-4 py-3 rounded-lg glass text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        placeholder="e.g., Deluxe Room"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Quantity
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={unit.quanntity}
                        onChange={(e) =>
                          handleUnitChange(
                            unitIndex,
                            "quanntity",
                            Number(e.target.value),
                          )
                        }
                        className="w-full px-4 py-3 rounded-lg glass text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        placeholder="1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Square Meters
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={unit.squareMeters}
                        onChange={(e) =>
                          handleUnitChange(
                            unitIndex,
                            "squareMeters",
                            Number(e.target.value),
                          )
                        }
                        className="w-full px-4 py-3 rounded-lg glass text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  {/* Unit Photos */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      Unit Photos
                    </label>
                    <div className="space-y-2">
                      {unit.photos.map((photo, photoIndex) => (
                        <div key={photoIndex} className="flex gap-2">
                          <input
                            type="url"
                            value={photo}
                            onChange={(e) => {
                              const newPhotos = [...unit.photos];
                              newPhotos[photoIndex] = e.target.value;
                              handleUnitChange(
                                unitIndex,
                                "photos",
                                newPhotos,
                              );
                            }}
                            className="flex-1 px-4 py-3 rounded-lg glass text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            placeholder="https://example.com/image.jpg"
                          />
                          {unit.photos.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                const newPhotos = unit.photos.filter(
                                  (_, i) => i !== photoIndex,
                                );
                                handleUnitChange(
                                  unitIndex,
                                  "photos",
                                  newPhotos,
                                );
                              }}
                              className="px-3 py-3 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all shrink-0"
                              title="Remove">
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          handleUnitChange(unitIndex, "photos", [
                            ...unit.photos,
                            "",
                          ]);
                        }}
                        className="px-4 py-2 rounded-lg glass text-blue-400 hover:bg-white/10 transition-all text-sm font-medium">
                        + Add Photo
                      </button>
                    </div>
                  </div>

                  {/* Beds Configuration */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      Beds Configuration
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-xs text-gray-400 mb-2">
                          Twin Beds
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={unit.numOftwinBeds}
                          onChange={(e) =>
                            handleUnitChange(
                              unitIndex,
                              "numOftwinBeds",
                              Number(e.target.value),
                            )
                          }
                          className="w-full px-4 py-3 rounded-lg glass text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400 mb-2">
                          Single Beds
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={unit.numOfSingleBeds}
                          onChange={(e) =>
                            handleUnitChange(
                              unitIndex,
                              "numOfSingleBeds",
                              Number(e.target.value),
                            )
                          }
                          className="w-full px-4 py-3 rounded-lg glass text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400 mb-2">
                          King Beds
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={unit.numOfKingBeds}
                          onChange={(e) =>
                            handleUnitChange(
                              unitIndex,
                              "numOfKingBeds",
                              Number(e.target.value),
                            )
                          }
                          className="w-full px-4 py-3 rounded-lg glass text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400 mb-2">
                          Queen Beds
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={unit.numOfQueenBeds}
                          onChange={(e) =>
                            handleUnitChange(
                              unitIndex,
                              "numOfQueenBeds",
                              Number(e.target.value),
                            )
                          }
                          className="w-full px-4 py-3 rounded-lg glass text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Capacity */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Capacity (Number of Guests)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={unit.numOfFits}
                      onChange={(e) =>
                        handleUnitChange(
                          unitIndex,
                          "numOfFits",
                          Number(e.target.value),
                        )
                      }
                      className="w-full px-4 py-3 rounded-lg glass text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      placeholder="Maximum number of guests"
                    />
                  </div>

                  {/* Amenities */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      Unit Amenities
                    </label>
                    <div className="space-y-2">
                      {unit.amenities.map((amenity, amenityIndex) => (
                        <div
                          key={amenityIndex}
                          className="flex gap-2">
                          <input
                            type="text"
                            value={amenity}
                            onChange={(e) => {
                              const newAmenities = [
                                ...unit.amenities,
                              ];
                              newAmenities[amenityIndex] =
                                e.target.value;
                              handleUnitChange(
                                unitIndex,
                                "amenities",
                                newAmenities,
                              );
                            }}
                            className="flex-1 px-4 py-3 rounded-lg glass text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            placeholder="Enter amenity"
                          />
                          {unit.amenities.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                const newAmenities =
                                  unit.amenities.filter(
                                    (_, i) => i !== amenityIndex,
                                  );
                                handleUnitChange(
                                  unitIndex,
                                  "amenities",
                                  newAmenities,
                                );
                              }}
                              className="px-3 py-3 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all shrink-0"
                              title="Remove">
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          handleUnitChange(unitIndex, "amenities", [
                            ...unit.amenities,
                            "",
                          ]);
                        }}
                        className="px-4 py-2 rounded-lg glass text-blue-400 hover:bg-white/10 transition-all text-sm font-medium">
                        + Add Amenity
                      </button>
                    </div>
                  </div>

                  {/* Seasonal Prices */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      Seasonal Prices (per night)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {unit.pricePerNight.map((price, priceIndex) => (
                        <div
                          key={priceIndex}
                          className="glass rounded-lg p-4">
                          <label className="block text-xs font-medium text-gray-400 mb-2">
                            {price.season === "low" &&
                              "🌙 Low Season"}
                            {price.season === "high" &&
                              "☀️ High Season"}
                            {price.season === "peak" &&
                              "🔥 Peak Season"}
                            {price.season === "event" &&
                              "🎉 Event Season"}
                          </label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                              $
                            </span>
                            <input
                              type="number"
                              min="0"
                              value={price.price}
                              onChange={(e) =>
                                handleUnitPriceChange(
                                  unitIndex,
                                  priceIndex,
                                  e.target.value,
                                )
                              }
                              className="w-full pl-8 pr-4 py-3 rounded-lg glass text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                              placeholder="0"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
