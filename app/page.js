"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import useHotelStore from "./store/hotelStore";
import axios from "axios";
import { ClipLoader } from "react-spinners";

export default function Home() {
  const {
    hotels,
    searchQuery,
    setSearchQuery,
    selectedSeason,
    setSelectedSeason,
    setHotels,
  } = useHotelStore();

  const [filterOptions, setFilterOptions] = useState([]);
  const [showImages, setShowImages] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageErrors, setImageErrors] = useState({});

  // بارگذاری مقدار localStorage فقط در کلاینت
  useEffect(() => {
    setMounted(true);

    try {
      const savedValue = localStorage.getItem("showImages");
      if (savedValue !== null) {
        setShowImages(savedValue === "true");
      }
    } catch (error) {
      console.warn("Error reading from localStorage:", error);
    }
  }, []);

  // ذخیره تغییرات showImages در localStorage
  useEffect(() => {
    if (!mounted) return;

    try {
      localStorage.setItem("showImages", String(showImages));
    } catch (error) {
      console.warn("Error writing to localStorage:", error);
    }
  }, [showImages, mounted]);

  const filteredHotels = hotels.filter((hotel) => {
    const matchesSearch =
      hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hotel.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const getPriceForSeason = (unit) => {
    const priceObj = unit.pricePerNight.find(
      (p) => p.season === selectedSeason,
    );
    return priceObj ? priceObj.price : unit.pricePerNight[0].price;
  };

  const getData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:5000/api/hotels",
      );
      setHotels(response.data.data);
    } catch (error) {
      console.error("Error fetching hotels:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const getMinPrice = (hotel) => {
    const prices = hotel.units.flatMap((unit) =>
      unit.pricePerNight.map((p) => p.price),
    );
    return Math.min(...prices);
  };

  const getButtonClassName = (isActive) => {
    if (!mounted) {
      return isActive
        ? "p-2 rounded transition-all duration-200 bg-blue-600 text-white"
        : "p-2 rounded transition-all duration-200 text-gray-400 hover:text-white";
    }

    return isActive
      ? "p-2 rounded transition-all duration-200 bg-blue-600 text-white"
      : "p-2 rounded transition-all duration-200 text-gray-400 hover:text-white";
  };

  // تابع برای دریافت URL تصویر معتبر
  const getValidImageUrl = (hotel) => {
    if (!hotel.photos || hotel.photos.length === 0) {
      return null;
    }
    const imageUrl = hotel.photos[0];
    if (!imageUrl || imageUrl.trim() === "") {
      return null;
    }
    return imageUrl;
  };

  // مدیریت خطای بارگذاری تصویر
  const handleImageError = (hotelId) => {
    setImageErrors((prev) => ({ ...prev, [hotelId]: true }));
  };

  // کامپوننت Placeholder برای تصاویر
  const ImagePlaceholder = ({ name }) => (
    <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
      <div className="text-center p-2">
        <svg
          className="w-8 h-8 text-gray-500 mx-auto mb-1"
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
        <p className="text-xs text-gray-400 line-clamp-2 px-1">
          {name}
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0B0B0D]">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="glass-strong rounded-2xl p-3 mb-6">
          {/* Search Bar */}
          <div className="relative mb-4 flex gap-2">
            <div className="flex-1 flex px-4 py-3 rounded-lg glass text-white has-[:focus]:ring-2 has-[:focus]:ring-blue-500 transition-all duration-200">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-white placeholder-gray-400 outline-none"
              />
              <svg
                className="w-5 h-5 text-gray-400 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {/* View Toggle Buttons */}
            <div className="flex gap-1 glass rounded-lg p-1">
              <button
                onClick={() => setShowImages(true)}
                className={getButtonClassName(showImages === true)}
                title="Grid view with images"
                suppressHydrationWarning>
                <svg
                  className="w-5 h-5"
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
              </button>
              <button
                onClick={() => setShowImages(false)}
                className={getButtonClassName(showImages === false)}
                title="Compact list view"
                suppressHydrationWarning>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>

            <Link
              href="/add-hotel"
              className="glass px-6 py-2 rounded-lg text-white hover:bg-white/20 transition-all duration-300 flex items-center gap-2">
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
            </Link>
          </div>

          {/* Season Selector */}
          <div className="flex gap-2 flex-wrap">
            {["low", "high", "peak", "event"].map((season) => (
              <button
                key={season}
                onClick={() => setSelectedSeason(season)}
                className={`px-4 py-1 rounded-lg transition-all duration-300 ${
                  selectedSeason === season
                    ? "bg-blue-600 text-white"
                    : "glass text-gray-300 hover:bg-white/10"
                }`}>
                {season === "low" && "Low"}
                {season === "high" && "High"}
                {season === "peak" && "Peak"}
                {season === "event" && "Event"}
              </button>
            ))}
          </div>
        </div>

        {/* Hotels List */}
        <div className="space-y-4">
          {filteredHotels.length === 0 ? (
            <>
              {loading ? (
                <div className="flex justify-center pt-20">
                  <ClipLoader
                    className="mx-auto"
                    color="#fff"
                    size={40}
                  />
                </div>
              ) : (
                <div className="glass-strong rounded-2xl p-8 text-center">
                  <p className="text-gray-400 text-lg">
                    No hotels found
                  </p>
                </div>
              )}
            </>
          ) : showImages ? (
            // View with images
            filteredHotels.map((hotel) => {
              const imageUrl = getValidImageUrl(hotel);
              const hasImageError = imageErrors[hotel._id];
              const hotelId = hotel._id;

              return (
                <Link key={hotelId} href={`/hotel/${hotelId}`}>
                  <div className="glass-strong rounded-lg overflow-hidden hover:scale-[1.01] transition-all duration-300 cursor-pointer mb-1.5">
                    <div className="flex flex-row">
                      {/* Hotel Image */}
                      <div className="relative w-24 sm:w-32 shrink-0 self-stretch">
                        {imageUrl && !hasImageError ? (
                          <Image
                            src={imageUrl}
                            alt={hotel.name}
                            fill
                            className="object-cover"
                            onError={() => handleImageError(hotelId)}
                            unoptimized={true}
                          />
                        ) : (
                          <ImagePlaceholder name={hotel.name} />
                        )}
                      </div>

                      {/* Hotel Info */}
                      <div className="flex-1 p-2 sm:p-3 min-w-0 flex flex-col justify-between">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h2 className="text-lg sm:text-base font-bold text-white truncate flex-1 min-w-0">
                            {hotel.name}
                          </h2>
                          <div className="text-right shrink-0">
                            <p className="text-[10px] sm:text-xs text-gray-400 whitespace-nowrap">
                              From
                            </p>
                            <p className="sm:text-lg font-bold text-blue-400 whitespace-nowrap">
                              ${getMinPrice(hotel).toLocaleString()}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1.5 mb-1.5">
                          {[
                            `${hotel.units.length} واحد`,
                            ...hotel.options,
                          ].map((option, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-full glass text-sm sm:text-xs font-light text-gray-300">
                              {option}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })
          ) : (
            // Compact view without images
            filteredHotels.map((hotel) => {
              const hotelId = hotel._id || hotel_.id;

              return (
                <Link key={hotelId} href={`/hotel/${hotelId}`}>
                  <div className="glass-strong rounded-lg hover:scale-[1.005] transition-all duration-300 cursor-pointer p-3 mb-1">
                    <div className="flex items-center justify-between gap-3 min-w-0">
                      {/* Hotel Info */}
                      <div className="flex-1 min-w-0">
                        <h2 className="text-lg font-bold text-white truncate mb-1">
                          {hotel.name}
                        </h2>
                        <div className="flex flex-wrap gap-1.5">
                          {[
                            `${hotel.units.length} واحد`,
                            ...hotel.options.slice(0, 3),
                          ].map((option, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-full glass text-xs font-light text-gray-300">
                              {option}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Price */}
                      <div className="text-right shrink-0">
                        <p className="text-xs text-gray-400 whitespace-nowrap">
                          From
                        </p>
                        <p className="text-xl font-bold text-blue-400 whitespace-nowrap">
                          ${getMinPrice(hotel).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
