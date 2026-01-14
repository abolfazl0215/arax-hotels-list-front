"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import useHotelStore from "../../store/hotelStore";
import axios from "axios";

export default function HotelDetail() {
  const params = useParams();
  const router = useRouter();
  const { hotels, selectedSeason, setSelectedSeason, deleteHotel } =
    useHotelStore();
  const [activeTab, setActiveTab] = useState("info");
  const [imageErrors, setImageErrors] = useState({});

  const hotel = hotels.find((h) => h._id === params.id);

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

  const getPriceForSeason = (unit) => {
    const priceObj = unit.pricePerNight.find(
      (p) => p.season === selectedSeason,
    );
    return priceObj ? priceObj.price : unit.pricePerNight[0].price;
  };

  const getBedIcon = (type) => {
    switch (type) {
      case "twin":
        return "🛏️";
      case "single":
        return "🛏️";
      case "king":
        return "🛏️👑";
      case "queen":
        return "🛏️👑";
      default:
        return "🛏️";
    }
  };

  const renderBeds = (unit) => {
    // Aggregate bed counts by type and return an array with counts
    const twin = unit.numOftwinBeds || 0;
    const single = unit.numOfSingleBeds || 0;
    const king = unit.numOfKingBeds || 0;
    const queen = unit.numOfQueenBeds || 0;

    const beds = [];
    if (twin > 0)
      beds.push({ type: "twin", label: "Twin Bed", count: twin });
    if (single > 0)
      beds.push({
        type: "single",
        label: "Single Bed",
        count: single,
      });
    if (king > 0)
      beds.push({ type: "king", label: "King Bed", count: king });
    if (queen > 0)
      beds.push({ type: "queen", label: "Queen Bed", count: queen });

    return beds;
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this hotel?")) {
      deleteHotel(hotel._id);
      const response = await axios.delete(
        `http://localhost:5000/api/hotels/${id}`,
      );
      router.push("/");
    }
  };

  const handleImageError = (imageId) => {
    setImageErrors((prev) => ({ ...prev, [imageId]: true }));
  };

  const ImagePlaceholder = ({ text }) => (
    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
      <span className="text-gray-400 text-sm">
        {text || "No Image"}
      </span>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0B0B0D]">
      <div className="container mx-auto px-2 py-6">
        <div className="glass-strong rounded-2xl p-5 mb-3">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex justify-between items-start">
                <h1 className="text-3xl font-bold text-white mb-2">
                  {hotel.name}
                </h1>
                <div className="flex gap-2">
                  <Link
                    href={`/edit-hotel/${hotel._id}`}
                    className="glass px-2 py-2 rounded-lg text-white hover:bg-white/20 transition-all duration-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 12 12">
                      <path
                        stroke="#F6F6F6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5.833 2.89.5 8.225v2.667h2.667L8.5 5.557M5.833 2.891 7.746.978h0c.264-.264.396-.396.548-.445a.67.67 0 0 1 .412 0c.152.049.284.18.547.444l1.16 1.16c.263.263.396.396.445.548a.67.67 0 0 1 0 .412c-.05.152-.181.284-.445.547h0L8.5 5.558M5.833 2.891 8.5 5.557"></path>
                    </svg>
                  </Link>
                  <button
                    onClick={() => handleDelete(hotel._id)}
                    className="glass px-2 py-2 rounded-lg text-red-400 hover:bg-red-500/20 transition-all duration-300">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 23 27">
                      <path
                        stroke="#FF6868"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 14v6M14 14v6M1 7h21M4 11v10.91C4 24.168 5.679 26 7.75 26h7.5c2.071 0 3.75-1.831 3.75-4.09V11M8 4c0-1.657 1.045-3 2.333-3h2.334C13.955 1 15 2.343 15 4v3H8z"></path>
                    </svg>
                  </button>
                </div>
              </div>
              <p className="text-gray-300 flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {hotel.address}
              </p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2 text-gray-300">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <span dir="ltr" className="text-left">
                {hotel.tel[0]}
              </span>
            </div>
            <a
              href={`mailto:${hotel.email}`}
              className="flex items-center gap-2 text-gray-300 hover:text-blue-400 transition-colors">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              {hotel.email}
            </a>
            <a
              href={`https://wa.me/${hotel.whatsapp.replace(
                /[^0-9]/g,
                "",
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-300 hover:text-green-400 transition-colors">
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              <span dir="ltr" className="text-left">
                {hotel.whatsapp}
              </span>
            </a>
            <div className="flex items-center gap-2 text-gray-300">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                />
              </svg>
              {hotel.website}
            </div>
          </div>
        </div>

        {/* Image Swiper */}
        <div className="glass-strong rounded-2xl overflow-hidden mb-3">
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={0}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            className="h-64 sm:h-96">
            {hotel.photos.map((photo, index) => {
              const imageId = `hotel-${index}`;
              const hasError = imageErrors[imageId];
              const isValidSrc =
                typeof photo === "string" && photo.trim() !== "";

              return (
                <SwiperSlide key={index}>
                  <div className="relative w-full h-full">
                    {hasError || !isValidSrc ? (
                      <ImagePlaceholder text={hotel.name} />
                    ) : (
                      <Image
                        src={photo}
                        alt={`${hotel.name} - Image ${index + 1}`}
                        fill
                        className="object-cover"
                        onError={() => handleImageError(imageId)}
                        unoptimized={true}
                      />
                    )}
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>

        {/* Tabs */}
        <div className="glass-strong rounded-2xl overflow-hidden">
          <div className="flex border-b border-white/10">
            <button
              onClick={() => setActiveTab("info")}
              className={`flex-1 px-6 py-4 text-center transition-all duration-300 ${
                activeTab === "info"
                  ? "bg-white/10 text-white border-b-2 border-blue-500"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}>
              Hotel Info
            </button>
            <button
              onClick={() => setActiveTab("rates")}
              className={`flex-1 px-6 py-4 text-center transition-all duration-300 ${
                activeTab === "rates"
                  ? "bg-white/10 text-white border-b-2 border-blue-500"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}>
              سود
            </button>
          </div>

          <div className="p-4">
            {activeTab === "info" && (
              <div className="space-y-6">
                {/* Options */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">
                    Amenities
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {hotel.options.map((option, idx) => (
                      <span
                        key={idx}
                        className="px-4 py-2 rounded-lg glass text-gray-300">
                        {option}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Units */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">
                    Units
                  </h3>
                  <div className="space-y-6">
                    {hotel.units.map((unit, unitIdx) => (
                      <div
                        key={unitIdx}
                        className="glass rounded-xl p-3">
                        {/* Unit Images */}
                        <div className="mb-4">
                          <Swiper
                            modules={[Navigation, Pagination]}
                            spaceBetween={10}
                            slidesPerView={1}
                            navigation
                            pagination={{ clickable: true }}
                            breakpoints={{
                              640: {
                                slidesPerView: 2,
                              },
                            }}
                            className="h-48">
                            {unit.photos.map((photo, photoIdx) => {
                              const imageId = `unit-${unitIdx}-${photoIdx}`;
                              const hasError = imageErrors[imageId];
                              const isValidSrc =
                                typeof photo === "string" &&
                                photo.trim() !== "";

                              return (
                                <SwiperSlide key={photoIdx}>
                                  <div className="relative w-full h-full rounded-lg overflow-hidden">
                                    {hasError || !isValidSrc ? (
                                      <ImagePlaceholder
                                        text={`Unit ${unitIdx + 1}`}
                                      />
                                    ) : (
                                      <Image
                                        src={photo}
                                        alt={`Unit ${
                                          unitIdx + 1
                                        } - Image ${photoIdx + 1}`}
                                        fill
                                        className="object-cover"
                                        onError={() =>
                                          handleImageError(imageId)
                                        }
                                        unoptimized={true}
                                      />
                                    )}
                                  </div>
                                </SwiperSlide>
                              );
                            })}
                          </Swiper>
                        </div>

                        {/* Unit Info */}
                        <div className="space-y-4">
                          {/* Basic Details */}
                          <div>
                            <h4 className="text-lg font-semibold text-white mb-2">
                              Details
                            </h4>
                            <div className="flex flex-wrap gap-4 text-gray-300">
                              {unit.name && (
                                <div className="glass px-3 py-2 rounded-lg">
                                  <span className="text-sm text-gray-400 block">
                                    Name
                                  </span>
                                  <span className="font-semibold">
                                    {unit.name}
                                  </span>
                                </div>
                              )}

                              <div className="glass px-3 py-2 rounded-lg">
                                <span className="text-sm text-gray-400 block">
                                  Quantity
                                </span>
                                <span className="font-semibold">
                                  {unit.quanntity ??
                                    unit.quantity ??
                                    0}
                                </span>
                              </div>

                              <div className="glass px-3 py-2 rounded-lg">
                                <span className="text-sm text-gray-400 block">
                                  Size
                                </span>
                                <span className="font-semibold">
                                  {unit.squareMeters ?? "-"} m²
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Beds */}
                          <div>
                            <h4 className="text-lg font-semibold text-white mb-2">
                              Beds
                            </h4>
                            <div className="flex flex-wrap gap-3">
                              {renderBeds(unit).map((bed, bedIdx) => (
                                <div
                                  key={bedIdx}
                                  className="flex items-center gap-2 glass px-3 py-2 rounded-lg">
                                  <span className="text-2xl">
                                    {getBedIcon(bed.type)}
                                  </span>
                                  <span className="text-gray-300 flex items-center gap-2">
                                    <span>{bed.label}</span>
                                    {bed.count > 1 && (
                                      <span className="text-gray-400">
                                        *{bed.count}
                                      </span>
                                    )}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Guests */}
                          <div>
                            <h4 className="text-lg font-semibold text-white mb-2">
                              Capacity
                            </h4>
                            <div className="flex gap-2">
                              {Array.from({
                                length: unit.numOfFits,
                              }).map((_, idx) => (
                                <svg
                                  key={idx}
                                  className="w-6 h-6"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 16 16">
                                  <path
                                    fill="#90C7FF"
                                    d="M8 7a3 3 0 1 0 0-6 3 3 0 0 0 0 6M14 12a3 3 0 0 0-3-3H5a3 3 0 0 0-3 3v3h12z"></path>
                                </svg>
                              ))}
                            </div>
                          </div>

                          {/* Amenities */}
                          <div>
                            <h4 className="text-lg font-semibold text-white mb-2">
                              Unit Amenities
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {unit.amenities.map(
                                (amenity, amenityIdx) => (
                                  <span
                                    key={amenityIdx}
                                    className="px-3 py-1 rounded-full glass text-sm text-gray-300">
                                    {amenity}
                                  </span>
                                ),
                              )}
                            </div>
                          </div>

                          {/* Price */}
                          <div className="flex items-center justify-between pt-4 border-t border-white/10">
                            <div>
                              <p className="text-sm text-gray-400 mb-1">
                                Price for{" "}
                                {selectedSeason === "low"
                                  ? "Low Season"
                                  : selectedSeason === "high"
                                  ? "High Season"
                                  : selectedSeason === "peak"
                                  ? "Peak Season"
                                  : "Event Season"}
                              </p>
                              <p className="text-2xl font-bold text-blue-400">
                                $
                                {getPriceForSeason(
                                  unit,
                                ).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "rates" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">
                    توضیحات سود
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {hotel.retesDescription}
                  </p>
                </div>

                {/* Rates Info */}
                {hotel.ratesInfo && (
                  <div className="glass rounded-xl p-6 space-y-4">
                    <h3 className="text-xl font-bold text-white mb-4">
                      اطلاعات سود
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-4 glass rounded-lg">
                          <span className="text-gray-300">
                            هزینه هتل (هر شب):
                          </span>
                          <span className="text-white font-semibold">
                            ${hotel.ratesInfo.hotelCost}
                          </span>
                        </div>

                        <div className="flex items-center justify-between p-4 glass rounded-lg">
                          <span className="text-gray-300">
                            کمیسیون معرفی:
                          </span>
                          <span className="text-green-400 font-semibold">
                            {hotel.ratesInfo
                              .referralCommissionType === "percent"
                              ? `${hotel.ratesInfo.referralCommission}%`
                              : `$${hotel.ratesInfo.referralCommission}`}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-4 glass rounded-lg">
                          <span className="text-gray-300">
                            کمیسیون مهمان اضافه (بزرگسال):
                          </span>
                          <span className="text-blue-400 font-semibold">
                            {hotel.ratesInfo
                              .extraAdultCommissionType === "percent"
                              ? `${hotel.ratesInfo.extraAdultCommission}%`
                              : `$${hotel.ratesInfo.extraAdultCommission}`}
                          </span>
                        </div>

                        <div className="flex items-center justify-between p-4 glass rounded-lg">
                          <span className="text-gray-300">
                            کمیسیون مهمان اضافه (کودک):
                          </span>
                          <span className="text-yellow-400 font-semibold">
                            {hotel.ratesInfo
                              .extraChildCommissionType === "percent"
                              ? `${hotel.ratesInfo.extraChildCommission}%`
                              : `$${hotel.ratesInfo.extraChildCommission}`}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Season Selector */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">
                    Select Season
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {["low", "high", "peak", "event"].map(
                      (season) => (
                        <button
                          key={season}
                          onClick={() => setSelectedSeason(season)}
                          className={`px-4 py-3 rounded-lg transition-all duration-300 ${
                            selectedSeason === season
                              ? "bg-blue-600 text-white"
                              : "glass text-gray-300 hover:bg-white/10"
                          }`}>
                          {season === "low" && "Low Season"}
                          {season === "high" && "High Season"}
                          {season === "peak" && "Peak Season"}
                          {season === "event" && "Event Season"}
                        </button>
                      ),
                    )}
                  </div>
                </div>

                {/* Price Table */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">
                    Price Table
                  </h3>
                  <div className="glass rounded-xl overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="px-4 py-3 text-right text-white">
                            Unit
                          </th>
                          <th className="px-4 py-3 text-right text-white">
                            Low
                          </th>
                          <th className="px-4 py-3 text-right text-white">
                            High
                          </th>
                          <th className="px-4 py-3 text-right text-white">
                            Peak
                          </th>
                          <th className="px-4 py-3 text-right text-white">
                            Event
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {hotel.units.map((unit, unitIdx) => {
                          const seasonOrder = [
                            "low",
                            "high",
                            "peak",
                            "event",
                          ];
                          const sortedPrices = seasonOrder.map(
                            (season) =>
                              unit.pricePerNight.find(
                                (p) => p.season === season,
                              ) || { season, price: 0 },
                          );

                          return (
                            <tr
                              key={unitIdx}
                              className="border-b border-white/5">
                              <td className="px-4 py-3 text-gray-300">
                                Unit {unitIdx + 1}
                              </td>
                              {sortedPrices.map((price, priceIdx) => (
                                <td
                                  key={priceIdx}
                                  className={`px-4 py-3 text-gray-300 ${
                                    price.season === selectedSeason
                                      ? "bg-blue-500/20 text-blue-400 font-bold"
                                      : ""
                                  }`}>
                                  ${price.price.toLocaleString()}
                                </td>
                              ))}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
