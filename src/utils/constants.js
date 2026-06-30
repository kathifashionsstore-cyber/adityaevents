// src/utils/constants.js

export const BUSINESS_DETAILS = {
  name: 'Adithya Event Management',
  instagram: '@adithya_event_management',
  phone: '+919393217676',
  whatsapp: '+919393217676',
  email: 'info@adithyaevents.com',
  address: 'Near Main Road, Vijayawada, Krishna District, Andhra Pradesh, 521165',
  city: 'Vijayawada',
  district: 'Krishna',
  state: 'Andhra Pradesh',
  country: 'India'
};

export const EVENT_TYPES = [
  { id: 'wedding', label: 'Wedding / Marriage' },
  { id: 'catering', label: 'Premium Catering Only' },
  { id: 'birthday', label: 'Birthday Celebration' },
  { id: 'corporate', label: 'Corporate Event' },
  { id: 'engagement', label: 'Engagement / Half-Saree' }
];

export const PACKAGES = [
  // WEDDING PACKAGES
  {
    id: 'wedding-classic',
    category: 'wedding',
    name: 'Royal Classic Wedding',
    features: [
      'Standard Stage Decoration (up to 20ft)',
      'Traditional Mandapam Setup',
      'Basic Entry Gate decoration',
      'Bride & Groom Seating chairs',
      'Ambient spotlighting & basic flower layout',
      'Stage background curtains with white LED drops'
    ]
  },
  {
    id: 'wedding-royal',
    category: 'wedding',
    name: 'Vijayawada Royal Wedding',
    features: [
      'Grand Stage Decoration (up to 40ft)',
      'Royal Floral Mandapam decoration',
      'Premium Pathway Lighting & LED entrance arch',
      'Special Smoke & Fog effect for couple entry',
      'Car decoration & selfie booth backdrop included',
      'Upholstered VIP seating setup',
      'Flower showers (traditional floral welcome)'
    ]
  },
  {
    id: 'wedding-imperial',
    category: 'wedding',
    name: 'Imperial Andhra Wedding',
    features: [
      'Luxurious Theme Stage Decoration (unlimited size)',
      'Exquisite Fresh flower selection (imported roses, jasmine)',
      'Custom theme design with 3D model pre-visualization',
      'Cinematic couple entry effects (Cold pyro, dry ice, laser)',
      'Full VIP venue decoration including guest corridors',
      'Luxury Car decoration & Premium thematic selfie booths',
      'Dedicated event manager & stage assistants'
    ]
  },

  // CATERING PACKAGES
  {
    id: 'catering-veg-basic',
    category: 'catering',
    name: 'Traditional Veg Delight',
    features: [
      '2 Starters, 1 Sweet, 2 Special Rice, 1 Roti',
      '3 Traditional Andhra Curries, Pappu, Pacchadi',
      'Vijayawada special Sambar, Rasam, Curd, Papads',
      'Mineral Water glasses & buffet counter design',
      'Standard catering service staff'
    ]
  },
  {
    id: 'catering-nonveg-premium',
    category: 'catering',
    name: 'Royal Non-Veg Feast',
    features: [
      '2 Veg Starters, 2 Chicken Starters',
      'Andhra Chicken Biryani & Premium Basmati Veg Biryani',
      'Gongura Mutton curry / Nellore Fish pulusu',
      '2 Traditional Sweets, Hot Jalebi Counter',
      'Ice-cream, Paan Stall, Mineral water bottles',
      'Premium layout with uniformed serving staff'
    ]
  },

  // BIRTHDAY PACKAGES
  {
    id: 'birthday-magic',
    category: 'birthday',
    name: 'Magic Theme Birthday',
    features: [
      'Theme Balloon Arch setup',
      'Happy Birthday cutout with LED lights',
      'Cake table decoration',
      'Standard sound speaker with mic',
      '1 Mascot character (Mickey/Chhota Bheem)'
    ]
  },
  {
    id: 'birthday-princess',
    category: 'birthday',
    name: 'Grand Princess / Jungle Theme',
    features: [
      'Large thematic 3D backdrop',
      'Premium balloon columns & LED name board',
      'Popcorn & Cotton Candy stalls for kids',
      'Magic show or Puppet show (45 mins)',
      'Professional photography included (soft copies)',
      'Theme welcome board at entryway'
    ]
  }
];

export const ADDONS = {
  photography: { name: 'Professional Candid Photography' },
  videography: { name: 'Full HD Traditional Videography' },
  droneFootage: { name: '4K Aerial Drone Coverage' },
  soundSystemDJ: { name: 'Premium DJ Sound & Dancefloor Lighting' }
};
