import { create } from "zustand";

const initialHotels = [
  {
    id: 1,
    type: "hotel",
    name: "The Grand Budapest",
    address: "1 Zubrowka Street, Republic of Zubrowka",
    location: { lat: 47.4979, lng: 19.0402 },
    tel: ["+1234567890", "+0987654321"],
    email: "hotel@gmail.com",
    website: "https://grandbudapest.example.com",
    whatsapp: "+1234567890",
    retesDescription: "30% discount for early booking",
    options: ["لغو رایگان", "پرداخت در هتل", "صبحانه رایگان"],
    ratesInfo: {
      hotelCost: 100,
      referralCommission: 15,
      referralCommissionType: "percent",
      extraAdultCommission: 10,
      extraAdultCommissionType: "percent",
      extraChildCommission: 5,
      extraChildCommissionType: "percent",
    },
    photos: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&h=600&fit=crop",
    ],
    units: [
      {
        id: 1,
        photos: [
          "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&h=600&fit=crop",
        ],
        numOftwinBeds: 2,
        numOfSingleBeds: 0,
        numOfKingBeds: 0,
        numOfQueenBeds: 1,
        amenities: ["وای‌فای رایگان", "صبحانه رایگان", "تهویه مطبوع"],
        numOfFits: 2,
        pricePerNight: [
          { season: "low", price: 120 },
          { season: "high", price: 180 },
          { season: "peak", price: 220 },
          { season: "event", price: 250 },
        ],
      },
      {
        id: 2,
        photos: [
          "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop",
        ],
        numOftwinBeds: 0,
        numOfSingleBeds: 2,
        numOfKingBeds: 1,
        numOfQueenBeds: 0,
        amenities: [
          "وای‌فای رایگان",
          "صبحانه رایگان",
          "تهویه مطبوع",
          "مینی‌بار",
        ],
        numOfFits: 3,
        pricePerNight: [
          { season: "low", price: 150 },
          { season: "high", price: 220 },
          { season: "peak", price: 280 },
          { season: "event", price: 320 },
        ],
      },
    ],
  },
  {
    id: 2,
    type: "hotel",
    name: "Royal Tehran",
    address: "Valiasr Street, Tehran, Iran",
    location: { lat: 35.6892, lng: 51.389 },
    tel: ["+98211234567", "+98219876543"],
    email: "royal@tehran.com",
    website: "https://royaltehran.example.com",
    whatsapp: "+989123456789",
    retesDescription:
      "25% discount for online booking + free breakfast",
    options: [
      "لغو رایگان",
      "پرداخت آنلاین",
      "صبحانه رایگان",
      "پارکینگ رایگان",
    ],
    ratesInfo: {
      hotelCost: 80,
      referralCommission: 20,
      referralCommissionType: "percent",
      extraAdultCommission: 15,
      extraAdultCommissionType: "percent",
      extraChildCommission: 8,
      extraChildCommissionType: "percent",
    },
    photos: [
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=600&fit=crop",
    ],
    units: [
      {
        id: 1,
        photos: [
          "https://images.unsplash.com/photo-1595576508898-0a8ef4d6a0e4?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1618221195710-dd6b41faaea8?w=800&h=600&fit=crop",
        ],
        numOftwinBeds: 1,
        numOfSingleBeds: 0,
        numOfKingBeds: 0,
        numOfQueenBeds: 1,
        amenities: [
          "وای‌فای رایگان",
          "صبحانه رایگان",
          "تهویه مطبوع",
          "تلویزیون",
        ],
        numOfFits: 2,
        pricePerNight: [
          { season: "low", price: 100 },
          { season: "high", price: 150 },
          { season: "peak", price: 200 },
          { season: "event", price: 230 },
        ],
      },
      {
        id: 2,
        photos: [
          "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop",
        ],
        numOftwinBeds: 0,
        numOfSingleBeds: 0,
        numOfKingBeds: 2,
        numOfQueenBeds: 0,
        amenities: [
          "وای‌فای رایگان",
          "صبحانه رایگان",
          "تهویه مطبوع",
          "مینی‌بار",
          "جکوزی",
        ],
        numOfFits: 4,
        pricePerNight: [
          { season: "low", price: 200 },
          { season: "high", price: 280 },
          { season: "peak", price: 350 },
          { season: "event", price: 400 },
        ],
      },
    ],
  },
  {
    id: 3,
    type: "hotel",
    name: "Parsian Isfahan",
    address: "Chahar Bagh Street, Isfahan, Iran",
    location: { lat: 32.6546, lng: 51.668 },
    tel: ["+98311345678"],
    email: "parsian@isfahan.com",
    website: "https://parsianisfahan.example.com",
    whatsapp: "+989123456789",
    retesDescription: "20% discount for stays over 3 nights",
    options: [
      "لغو رایگان تا ۲۴ ساعت قبل",
      "پرداخت در هتل",
      "صبحانه رایگان",
    ],
    ratesInfo: {
      hotelCost: 60,
      referralCommission: 12,
      referralCommissionType: "percent",
      extraAdultCommission: 8,
      extraAdultCommissionType: "percent",
      extraChildCommission: 4,
      extraChildCommissionType: "percent",
    },
    photos: [
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop",
    ],
    units: [
      {
        id: 1,
        photos: [
          "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop",
        ],
        numOftwinBeds: 0,
        numOfSingleBeds: 1,
        numOfKingBeds: 0,
        numOfQueenBeds: 1,
        amenities: ["وای‌فای رایگان", "صبحانه رایگان", "تهویه مطبوع"],
        numOfFits: 2,
        pricePerNight: [
          { season: "low", price: 80 },
          { season: "high", price: 120 },
          { season: "peak", price: 160 },
          { season: "event", price: 180 },
        ],
      },
    ],
  },
  {
    id: 4,
    type: "hotel",
    name: "International Shiraz",
    address: "Zand Boulevard, Shiraz, Iran",
    location: { lat: 29.5918, lng: 52.5837 },
    tel: ["+98711234567"],
    email: "international@shiraz.com",
    website: "https://internationalshiraz.example.com",
    whatsapp: "+989123456789",
    retesDescription:
      "35% discount for group bookings (over 5 rooms)",
    options: [
      "لغو رایگان",
      "پرداخت آنلاین",
      "صبحانه رایگان",
      "ترانسفر فرودگاه",
    ],
    ratesInfo: {
      hotelCost: 90,
      referralCommission: 18,
      referralCommissionType: "percent",
      extraAdultCommission: 12,
      extraAdultCommissionType: "percent",
      extraChildCommission: 6,
      extraChildCommissionType: "percent",
    },
    photos: [
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=600&fit=crop",
    ],
    units: [
      {
        id: 1,
        photos: [
          "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&h=600&fit=crop",
        ],
        numOftwinBeds: 1,
        numOfSingleBeds: 0,
        numOfKingBeds: 0,
        numOfQueenBeds: 1,
        amenities: [
          "وای‌فای رایگان",
          "صبحانه رایگان",
          "تهویه مطبوع",
          "تلویزیون",
          "مینی‌بار",
        ],
        numOfFits: 2,
        pricePerNight: [
          { season: "low", price: 110 },
          { season: "high", price: 170 },
          { season: "peak", price: 210 },
          { season: "event", price: 240 },
        ],
      },
      {
        id: 2,
        photos: [
          "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&h=600&fit=crop",
          "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop",
        ],
        numOftwinBeds: 0,
        numOfSingleBeds: 0,
        numOfKingBeds: 1,
        numOfQueenBeds: 1,
        amenities: [
          "وای‌فای رایگان",
          "صبحانه رایگان",
          "تهویه مطبوع",
          "جکوزی",
          "بالکن",
        ],
        numOfFits: 4,
        pricePerNight: [
          { season: "low", price: 180 },
          { season: "high", price: 260 },
          { season: "peak", price: 320 },
          { season: "event", price: 380 },
        ],
      },
    ],
  },
];

const useHotelStore = create((set) => ({
  hotels: [],
  searchQuery: "",
  selectedSeason: "low",

  setHotels: (hotels) => set({ hotels: hotels }),

  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedSeason: (season) => set({ selectedSeason: season }),

  addHotel: (hotel) =>
    set((state) => ({
      hotels: [...state.hotels, { ...hotel, id: Date.now() }],
    })),

  updateHotel: (id, updatedHotel) =>
    set((state) => ({
      hotels: state.hotels.map((hotel) =>
        hotel._id === id ? { ...updatedHotel, _id: id } : hotel,
      ),
    })),

  deleteHotel: (id) =>
    set((state) => ({
      hotels: state.hotels.filter((hotel) => hotel._id !== id),
    })),
}));

export default useHotelStore;
