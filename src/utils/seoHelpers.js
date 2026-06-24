// src/utils/seoHelpers.js

export const getSEOMetadata = (pageKey) => {
  const meta = {
    home: {
      title: 'Adithya Event Management | Premium Events & Catering Vuyyuru',
      description: 'Award-winning wedding decorators, event planners, and premium catering service in Vuyyuru, Vijayawada, Andhra Pradesh. Trust us for royal weddings and celebrations.',
      keywords: 'event management vuyyuru, wedding decorators vuyyuru, catering service andhra pradesh, birthday organizers krishna district'
    },
    about: {
      title: 'About Us | Adithya Event Management Vuyyuru',
      description: 'Established in Vuyyuru, Adithya Event Management has planned over 500+ premium weddings, receptions, and corporate banquets across Andhra Pradesh.',
      keywords: 'best event planners vuyyuru, catering history, wedding stage decorators'
    },
    services: {
      title: 'Premium Services | Catering & Decorators Vuyyuru',
      description: 'Explore our full suite of premium services including royal wedding decorations, local catering (traditional Andhra feasts), birthday setups, and photography.',
      keywords: 'stage decoration vuyyuru, caterers in vuyyuru, wedding stage design, light and sound systems'
    },
    packages: {
      title: 'Budget Event Packages | Adithya Event Management',
      description: 'Transparent and affordable royal event packages. Custom solutions for standard birthday backdrops, full wedding stages, and veg/non-veg catering.',
      keywords: 'wedding package cost vuyyuru, catering plate price, corporate event packages'
    },
    gallery: {
      title: 'Real Wedding & Event Gallery | Adithya Events',
      description: 'Browse photos of our actual events in Vuyyuru, Vijayawada and Krishna district. Drone footage, stage layouts, wedding decor, and catering arrangements.',
      keywords: 'wedding photos vuyyuru, stage decoration designs, buffet layouts'
    },
    leaders: {
      title: 'Leaders | Adithya Events',
      description: 'Leadership profiles, teams, and public updates.',
      keywords: 'leaders, team updates, public information'
    },
    'daily-work': {
      title: 'Daily Work | Adithya Events',
      description: 'Daily field work, activities, and updates.',
      keywords: 'daily work, updates, activities'
    },
    'super-6': {
      title: 'Super 6 | Adithya Events',
      description: 'Six highlighted priorities and updates.',
      keywords: 'super 6, priorities, updates'
    },
    schemes: {
      title: 'Schemes | Adithya Events',
      description: 'Programs, benefits, and public information.',
      keywords: 'schemes, programs, benefits'
    },
    news: {
      title: 'News | Adithya Events',
      description: 'Latest announcements and updates.',
      keywords: 'news, announcements, updates'
    },
    narasaraopet: {
      title: 'Narasaraopet | Adithya Events',
      description: 'Local updates and information.',
      keywords: 'narasaraopet, local updates, information'
    },
    contact: {
      title: 'Contact Us | Adithya Event Management Vuyyuru',
      description: 'Get in touch with us at +91 93932 17676 or visit our Vuyyuru office. Book a free consultation for your next family function or wedding.',
      keywords: 'event organizers contact number, adithya catering vuyyuru, cell number'
    }
  };

  return meta[pageKey] || meta.home;
};
