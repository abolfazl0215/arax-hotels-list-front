/**
 * ساده‌ترین منطق فیلتر کردن برای هتل‌ها
 */

/**
 * بررسی اینکه آیا فاصله هتل با فیلتر مطابقت دارد
 */
const matchesDistanceFilter = (hotel, distanceFilter) => {
  if (!distanceFilter) return true;

  // distanceToCenter یک عدد است که فاصله تا مرکز را به دقیقه نشان می‌دهد
  const distance = hotel.distanceToCenter || 0;

  switch (distanceFilter) {
    case "0":
      return distance === 0;
    case "-5":
      return distance > 0 && distance <= 5;
    case "5-10":
      return distance > 5 && distance <= 10;
    case "+10":
      return distance > 10;
    default:
      return true;
  }
};

/**
 * بررسی اینکه آیا هر فیلتری فعال است
 */
export const hasActiveFilters = (filters) => {
  if (!filters) return false;

  if (filters.stars?.length > 0) return true;
  if (filters.distanceToCenter) return true;
  if (filters.selectedOptions?.length > 0) return true;
  if (filters.options?.trim()) return true;
  if (filters.hasPhoto) return true;
  if (filters.hasWhatsapp) return true;
  if (filters.hasWebsite) return true;
  if (filters.hasEmail) return true;
  if (filters.hasTel) return true;
  if (filters.hotelPhotos) return true;
  if (filters.unitPhotos) return true;
  if (filters.amenities?.length > 0) return true;
  if (filters.squareMetersMin > 0 || filters.squareMetersMax < 500)
    return true;
  if (filters.twinBedsMin > 0 || filters.twinBedsMax < 5) return true;
  if (filters.singleBedsMin > 0 || filters.singleBedsMax < 5)
    return true;
  if (filters.kingBedsMin > 0 || filters.kingBedsMax < 5) return true;
  if (filters.queensBedsMin > 0 || filters.queensBedsMax < 5)
    return true;
  if (filters.fitsMin > 1 || filters.fitsMax < 10) return true;
  if (filters.priceMin > 0 || filters.priceMax < 1000) return true;
  if (filters.seasons?.length > 0) return true;

  return false;
};

/**
 * بررسی اینکه آیا یک واحد تمام فیلترها را برآورده می‌کند
 */
const unitMatchesFilters = (unit, filters) => {
  if (!unit) return false;

  // بررسی اندازه متر مربع
  if (filters.squareMetersMin > 0 || filters.squareMetersMax < 500) {
    const sqm = unit.squareMeters || 0;
    if (
      sqm < filters.squareMetersMin ||
      sqm > filters.squareMetersMax
    ) {
      return false;
    }
  }

  // بررسی عکس واحد
  if (filters.unitPhotos) {
    if (!unit.photos || unit.photos.length === 0) {
      return false;
    }
  }

  // بررسی تخت‌های مختلف
  if (filters.twinBedsMin > 0 || filters.twinBedsMax < 5) {
    const beds = unit.numOftwinBeds || 0;
    if (beds < filters.twinBedsMin || beds > filters.twinBedsMax) {
      return false;
    }
  }

  if (filters.singleBedsMin > 0 || filters.singleBedsMax < 5) {
    const beds = unit.numOfSingleBeds || 0;
    if (
      beds < filters.singleBedsMin ||
      beds > filters.singleBedsMax
    ) {
      return false;
    }
  }

  if (filters.kingBedsMin > 0 || filters.kingBedsMax < 5) {
    const beds = unit.numOfKingBeds || 0;
    if (beds < filters.kingBedsMin || beds > filters.kingBedsMax) {
      return false;
    }
  }

  if (filters.queensBedsMin > 0 || filters.queensBedsMax < 5) {
    const beds = unit.numOfQueenBeds || 0;
    if (
      beds < filters.queensBedsMin ||
      beds > filters.queensBedsMax
    ) {
      return false;
    }
  }

  // بررسی امکانات
  if (filters.amenities?.length > 0) {
    const unitAmenities = unit.amenities || [];
    const hasAllAmenities = filters.amenities.every((required) =>
      unitAmenities.some(
        (amenity) => amenity.toLowerCase() === required.toLowerCase(),
      ),
    );
    if (!hasAllAmenities) {
      return false;
    }
  }

  // بررسی ظرفیت
  if (filters.fitsMin > 1 || filters.fitsMax < 10) {
    const fits = unit.numOfFits || 0;
    if (fits < filters.fitsMin || fits > filters.fitsMax) {
      return false;
    }
  }

  // بررسی قیمت
  if (filters.priceMin > 0 || filters.priceMax < 1000) {
    if (!unit.pricePerNight || unit.pricePerNight.length === 0) {
      return false;
    }

    let hasMatchingPrice = false;

    if (filters.seasons?.length > 0) {
      hasMatchingPrice = unit.pricePerNight.some((p) => {
        if (!filters.seasons.includes(p.season)) return false;
        return (
          p.price >= filters.priceMin && p.price <= filters.priceMax
        );
      });
    } else {
      hasMatchingPrice = unit.pricePerNight.some(
        (p) =>
          p.price >= filters.priceMin && p.price <= filters.priceMax,
      );
    }

    if (!hasMatchingPrice) {
      return false;
    }
  }

  return true;
};

/**
 * فیلتر کردن هتل‌ها بر اساس فیلترهای پیشرفته
 */
export const applyAdvancedFilters = (hotels, filters) => {
  if (!Array.isArray(hotels)) return [];

  // اگر هیچ فیلتری فعال نیست، همه هتل‌ها را برگردان
  if (!hasActiveFilters(filters)) {
    return hotels;
  }

  return hotels.filter((hotel) => {
    // فیلتر ستاره‌های هتل
    if (filters.stars?.length > 0) {
      if (!filters.stars.includes(hotel.stars)) {
        return false;
      }
    }

    // فیلتر فاصله تا مرکز
    if (filters.distanceToCenter) {
      if (!matchesDistanceFilter(hotel, filters.distanceToCenter)) {
        return false;
      }
    }

    // فیلتر عکس‌های هتل
    if (filters.hasPhoto || filters.hotelPhotos) {
      if (!hotel.photos || hotel.photos.length === 0) {
        return false;
      }
    }

    // فیلتر گزینه‌های هتل (selectedOptions یا options)
    if (filters.selectedOptions?.length > 0) {
      if (!hotel.options || hotel.options.length === 0) {
        return false;
      }

      const hasAllOptions = filters.selectedOptions.every((selectedOpt) =>
        hotel.options.some((opt) =>
          opt.toLowerCase().includes(selectedOpt.toLowerCase()),
        ),
      );

      if (!hasAllOptions) {
        return false;
      }
    } else if (filters.options?.trim()) {
      const searchText = filters.options.toLowerCase();
      if (!hotel.options || hotel.options.length === 0) {
        return false;
      }

      const hasMatchingOption = hotel.options.some((opt) =>
        opt.toLowerCase().includes(searchText),
      );

      if (!hasMatchingOption) {
        return false;
      }
    }

    // فیلتر Website
    if (filters.hasWebsite) {
      if (!hotel.website) {
        return false;
      }
    }

    // فیلتر WhatsApp
    if (filters.hasWhatsapp) {
      if (!hotel.whatsapp) {
        return false;
      }
    }

    // فیلتر ایمیل
    if (filters.hasEmail) {
      if (!hotel.email) {
        return false;
      }
    }

    // فیلتر تلفن
    if (filters.hasTel) {
      if (!hotel.tel || hotel.tel.length === 0) {
        return false;
      }
    }

    // فیلترهای سطح واحد
    // هتل باید حداقل یک واحد داشته باشد که با فیلترها مطابقت داشته باشد
    const hasUnitFilters =
      filters.unitPhotos ||
      filters.squareMetersMin > 0 ||
      filters.squareMetersMax < 500 ||
      filters.twinBedsMin > 0 ||
      filters.twinBedsMax < 5 ||
      filters.singleBedsMin > 0 ||
      filters.singleBedsMax < 5 ||
      filters.kingBedsMin > 0 ||
      filters.kingBedsMax < 5 ||
      filters.queensBedsMin > 0 ||
      filters.queensBedsMax < 5 ||
      filters.amenities?.length > 0 ||
      filters.fitsMin > 1 ||
      filters.fitsMax < 10 ||
      filters.priceMin > 0 ||
      filters.priceMax < 1000 ||
      filters.seasons?.length > 0;

    if (hasUnitFilters) {
      const hasMatchingUnit = hotel.units?.some((unit) =>
        unitMatchesFilters(unit, filters),
      );

      if (!hasMatchingUnit) {
        return false;
      }
    }

    return true;
  });
};

/**
 * استخراج تمام امکانات منحصربه‌فرد از همه هتل‌ها
 */
export const getAllAmenities = (hotels) => {
  const amenitiesSet = new Set();

  if (Array.isArray(hotels)) {
    hotels.forEach((hotel) => {
      if (Array.isArray(hotel.units)) {
        hotel.units.forEach((unit) => {
          if (Array.isArray(unit.amenities)) {
            unit.amenities.forEach((amenity) => {
              amenitiesSet.add(amenity);
            });
          }
        });
      }
    });
  }

  return Array.from(amenitiesSet).sort();
};
