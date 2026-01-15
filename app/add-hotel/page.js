"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useHotelStore from "../store/hotelStore";
import axios from "axios";
import { ClipLoader } from "react-spinners";

export default function AddHotel() {
  const router = useRouter();
  const { addHotel } = useHotelStore();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    stars: 0,
    location: { lat: 0, lng: 0 },
    tel: [""],
    email: "",
    website: "",
    whatsapp: "",
    retesDescription: "",
    ratesInfo: {
      hotelCost: 0,
      referralCommission: 0,
      referralCommissionType: "percent",
      extraAdultCommission: 0,
      extraAdultCommissionType: "percent",
      extraChildCommission: 0,
      extraChildCommissionType: "percent",
    },
    options: [""],
    photos: [""],
    units: [
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

    console.log({ cleanedData });
    setLoading(true);
    const response = await axios.post(
      "https://arax-hotels-list-back.onrender.com/api/hotels",
      cleanedData,
    );
    console.log(response);
    setLoading(false);
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 glass px-4 py-2 rounded-lg text-white hover:bg-white/20 transition-all duration-300 mb-6">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back
        </Link>

        <div className="glass-strong rounded-2xl p-6">
          <h1 className="text-3xl font-bold text-white mb-6">
            Add New Hotel
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white">
                Basic Information
              </h2>

              <div>
                <label className="block text-gray-300 mb-2">
                  Hotel Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    handleInputChange("name", e.target.value)
                  }
                  className="w-full px-4 py-3 rounded-lg glass text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) =>
                    handleInputChange("address", e.target.value)
                  }
                  className="w-full px-4 py-3 rounded-lg glass text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">
                  تعداد ستاره
                </label>
                <input
                  type="number"
                  min="0"
                  max="5"
                  step="1"
                  value={formData.stars}
                  onChange={(e) =>
                    handleInputChange("stars", Number(e.target.value))
                  }
                  className="w-full px-4 py-3 rounded-lg glass text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 mb-2">
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
                    className="w-full px-4 py-3 rounded-lg glass text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">
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
                    className="w-full px-4 py-3 rounded-lg glass text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">
                  Phone Numbers
                </label>
                {formData.tel.map((tel, index) => (
                  <div key={index} className="flex gap-2 mb-2">
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
                      className="flex-1 px-4 py-3 rounded-lg glass text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="+1234567890"
                    />
                    {formData.tel.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveArrayItem("tel", index)
                        }
                        className="px-4 py-3 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30">
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => handleAddArrayItem("tel")}
                  className="mt-2 px-4 py-2 rounded-lg glass text-white hover:bg-white/20">
                  + Add Phone
                </button>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    handleInputChange("email", e.target.value)
                  }
                  className="w-full px-4 py-3 rounded-lg glass text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) =>
                    handleInputChange("website", e.target.value)
                  }
                  className="w-full px-4 py-3 rounded-lg glass text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">
                  WhatsApp
                </label>
                <input
                  type="text"
                  value={formData.whatsapp}
                  onChange={(e) =>
                    handleInputChange("whatsapp", e.target.value)
                  }
                  className="w-full px-4 py-3 rounded-lg glass text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">
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
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg glass text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Rates Info */}
              <div className="glass rounded-xl p-6 space-y-4">
                <h3 className="text-lg font-semibold text-white mb-4">
                  اطلاعات سود
                </h3>

                <div>
                  <label className="block text-gray-300 mb-2">
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
                    className="w-full px-4 py-3 rounded-lg glass text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-2">
                      کمیسیون معرفی
                    </label>
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
                      className="w-full px-4 py-3 rounded-lg glass text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
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
                      className="w-full px-4 py-3 rounded-lg glass text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="percent">درصد (%)</option>
                      <option value="fixed">مبلغ ثابت ($)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">
                      کمیسیون مهمان اضافه (بزرگسال)
                    </label>
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
                      className="w-full px-4 py-3 rounded-lg glass text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
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
                      className="w-full px-4 py-3 rounded-lg glass text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="percent">درصد (%)</option>
                      <option value="fixed">مبلغ ثابت ($)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">
                      کمیسیون مهمان اضافه (کودک)
                    </label>
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
                      className="w-full px-4 py-3 rounded-lg glass text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
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
                      className="w-full px-4 py-3 rounded-lg glass text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="percent">درصد (%)</option>
                      <option value="fixed">مبلغ ثابت ($)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">
                  Amenities
                </label>
                {formData.options.map((option, index) => (
                  <div key={index} className="flex gap-2 mb-2">
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
                      className="flex-1 px-4 py-3 rounded-lg glass text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {formData.options.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveArrayItem("options", index)
                        }
                        className="px-4 py-3 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30">
                        حذف
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => handleAddArrayItem("options")}
                  className="mt-2 px-4 py-2 rounded-lg glass text-white hover:bg-white/20">
                  + Add Amenity
                </button>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">
                  تصاویر هتل
                </label>
                {formData.photos.map((photo, index) => (
                  <div key={index} className="flex gap-2 mb-2">
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
                      className="flex-1 px-4 py-3 rounded-lg glass text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://example.com/image.jpg"
                    />
                    {formData.photos.length > 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          handleRemoveArrayItem("photos", index)
                        }
                        className="px-4 py-3 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30">
                        حذف
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => handleAddArrayItem("photos")}
                  className="mt-2 px-4 py-2 rounded-lg glass text-white hover:bg-white/20">
                  + افزودن تصویر
                </button>
              </div>
            </div>

            {/* Units */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">
                  Units
                </h2>
                <button
                  type="button"
                  onClick={handleAddUnit}
                  className="px-4 py-2 rounded-lg glass text-white hover:bg-white/20">
                  + Add Unit
                </button>
              </div>

              {formData.units.map((unit, unitIndex) => (
                <div
                  key={unitIndex}
                  className="glass rounded-xl p-6 space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">
                      Unit {unitIndex + 1}
                    </h3>
                    {formData.units.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveUnit(unitIndex)}
                        className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30">
                        Remove Unit
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-gray-300 mb-2">
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
                        className="w-full px-4 py-3 rounded-lg glass text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 mb-2">
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
                        className="w-full px-4 py-3 rounded-lg glass text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 mb-2">
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
                        className="w-full px-4 py-3 rounded-lg glass text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">
                      Unit Photos
                    </label>
                    {unit.photos.map((photo, photoIndex) => (
                      <div
                        key={photoIndex}
                        className="flex gap-2 mb-2">
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
                          className="flex-1 px-4 py-3 rounded-lg glass text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                            className="px-4 py-3 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30">
                            حذف
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
                      className="mt-2 px-4 py-2 rounded-lg glass text-white hover:bg-white/20">
                      + Add Photo
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 mb-2">
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
                        className="w-full px-4 py-3 rounded-lg glass text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2">
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
                        className="w-full px-4 py-3 rounded-lg glass text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2">
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
                        className="w-full px-4 py-3 rounded-lg glass text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2">
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
                        className="w-full px-4 py-3 rounded-lg glass text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">
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
                      className="w-full px-4 py-3 rounded-lg glass text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">
                      Amenities
                    </label>
                    {unit.amenities.map((amenity, amenityIndex) => (
                      <div
                        key={amenityIndex}
                        className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={amenity}
                          onChange={(e) => {
                            const newAmenities = [...unit.amenities];
                            newAmenities[amenityIndex] =
                              e.target.value;
                            handleUnitChange(
                              unitIndex,
                              "amenities",
                              newAmenities,
                            );
                          }}
                          className="flex-1 px-4 py-3 rounded-lg glass text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                            className="px-4 py-3 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30">
                            حذف
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
                      className="mt-2 px-4 py-2 rounded-lg glass text-white hover:bg-white/20">
                      + Add Amenity
                    </button>
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">
                      Prices
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      {unit.pricePerNight.map((price, priceIndex) => (
                        <div key={priceIndex}>
                          <label className="block text-gray-400 mb-1 text-sm">
                            {price.season === "low" && "Low Season"}
                            {price.season === "high" && "High Season"}
                            {price.season === "peak" && "Peak Season"}
                            {price.season === "event" &&
                              "Event Season"}
                          </label>
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
                            className="w-full px-4 py-3 rounded-lg glass text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                className="flex-1 px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 font-semibold">
                {loading ? (
                  <ClipLoader color="white" size={20} />
                ) : (
                  "Save Hotel"
                )}
              </button>
              <Link
                href="/"
                className="px-6 py-3 rounded-lg glass text-white hover:bg-white/20 transition-all duration-300">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
