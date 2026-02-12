// MoonLight Restaurant - Site Configuration
// Update values here when rebranding to actual restaurant name

const siteConfig = {
  // Restaurant Info
  restaurantName: "MoonLight",
  tagline: "Fine Dining Experience",
  
  // Domain & URLs
  domain: "https://vericavje8-rgb.github.io/MoonLIght",
  homeUrl: "https://vericavje8-rgb.github.io/MoonLIght/index.html",
  menuUrl: "https://vericavje8-rgb.github.io/MoonLIght/menu2.html",
  qrUrl: "https://vericavje8-rgb.github.io/MoonLIght/qr-code.html",
  
  // Contact Information
  phone: "+15551234567",
  email: "info@MoonLight.com",
  
  // Address
  address: {
    street: "123 Culinary Avenue",
    city: "Gourmet City",
    state: "GC",
    zip: "12345",
    country: "USA",
    fullAddress: "123 Culinary Avenue, Gourmet City, GC 12345, USA"
  },
  
  // Hours
  hours: {
    monday_thursday: "5PM - 11PM",
    friday_saturday: "5PM - 12AM",
    sunday: "5PM - 10PM"
  },
  
  // SEO & Meta
  description: "Exquisite fine dining restaurant offering Mediterranean cuisine, fresh seafood, and premium wines",
  keywords: "fine dining, Mediterranean cuisine, seafood, premium wines, restaurant",
  
  // Social Media (if you add these later)
  social: {
    facebook: "",
    instagram: "",
    twitter: ""
  },
  
  // Business Info
  established: 2010,
  cuisine: "Mediterranean",
  priceRange: "$$$$"
};

// Log config loaded (for debugging)
console.log("Site configuration loaded:", siteConfig.restaurantName);
