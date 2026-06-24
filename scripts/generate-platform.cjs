const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');

function write(file, content) {
  const target = path.join(root, file);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content.replace(/\r?\n/g, '\n').trimStart(), 'utf8');
}

const publicFiles = {
  'public/index.html': `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#D4AF37" />
    <meta name="description" content="Adithya Event Management in Vuyyuru, Andhra Pradesh. Premium weddings, catering, birthdays, corporate events and celebration planning." />
    <meta name="keywords" content="Adithya Event Management, Vuyyuru events, Vijayawada catering, wedding planner Andhra Pradesh, event management Krishna district" />
    <meta property="og:title" content="Adithya Event Management" />
    <meta property="og:description" content="Premium event management and catering in Vuyyuru, Andhra Pradesh." />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://adithyaevents.in" />
    <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
    <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;1,400;1,700&family=Poppins:wght@300;400;500;600;700&family=Great+Vibes&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
    <title>Adithya Event Management | Vuyyuru</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run Adithya Event Management.</noscript>
    <div id="root"></div>
  </body>
</html>`,
  'public/manifest.json': `{
  "short_name": "Adithya Events",
  "name": "Adithya Event Management",
  "description": "Premium event management and catering in Vuyyuru, Andhra Pradesh.",
  "icons": [
    { "src": "favicon.ico", "sizes": "64x64 32x32 24x24 16x16", "type": "image/x-icon" },
    { "src": "logo192.png", "type": "image/png", "sizes": "192x192" },
    { "src": "logo512.png", "type": "image/png", "sizes": "512x512" }
  ],
  "start_url": ".",
  "display": "standalone",
  "theme_color": "#D4AF37",
  "background_color": "#FDF8F0"
}`,
  'public/robots.txt': `User-agent: *
Allow: /
Sitemap: https://adithyaevents.in/sitemap.xml`,
  'public/sitemap.xml': `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://adithyaevents.in/</loc><priority>1.0</priority></url>
  <url><loc>https://adithyaevents.in/services</loc><priority>0.9</priority></url>
  <url><loc>https://adithyaevents.in/packages</loc><priority>0.9</priority></url>
  <url><loc>https://adithyaevents.in/gallery</loc><priority>0.8</priority></url>
  <url><loc>https://adithyaevents.in/book</loc><priority>0.9</priority></url>
  <url><loc>https://adithyaevents.in/contact</loc><priority>0.8</priority></url>
</urlset>`,
  'public/firebase-messaging-sw.js': `/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyCV_Z4BPen7wweLOKtiBc2TmECSO6I5A5M',
  authDomain: 'adithyaevents-a6140.firebaseapp.com',
  projectId: 'adithyaevents-a6140',
  storageBucket: 'adithyaevents-a6140.firebasestorage.app',
  messagingSenderId: '202241262091',
  appId: '1:202241262091:web:a418b19a7e4ae1e6acfd0e',
  measurementId: 'G-9Z6C91736V'
});

const messaging = firebase.messaging();
messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || 'Adithya Event Management';
  const options = {
    body: payload.notification?.body || 'You have a new event update.',
    icon: '/logo192.png',
    badge: '/logo192.png',
    data: payload.data || {}
  };
  self.registration.showNotification(title, options);
});`
};

Object.entries(publicFiles).forEach(([file, content]) => write(file, content));

write('craco.config.js', `module.exports = {
  style: {
    postcss: {
      plugins: [require('tailwindcss'), require('autoprefixer')]
    }
  }
};`);

write('tailwind.config.js', `module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: '#D4AF37',
        burgundy: '#722F37',
        charcoal: '#1A1A1A'
      }
    }
  },
  plugins: []
};`);

write('postcss.config.js', `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  }
};`);

write('.env', `REACT_APP_SITE_URL=https://adithyaevents.in
REACT_APP_RAZORPAY_KEY_ID=
REACT_APP_WHATSAPP_NUMBER=919393217676
REACT_APP_FIREBASE_VAPID_KEY=`);

write('.env.example', `REACT_APP_SITE_URL=https://adithyaevents.in
REACT_APP_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxx
REACT_APP_WHATSAPP_NUMBER=919393217676
REACT_APP_FIREBASE_VAPID_KEY=your_fcm_web_push_certificate_key`);

write('firebase.json', `{
  "hosting": {
    "public": "build",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [{ "source": "**", "destination": "/index.html" }],
    "headers": [
      {
        "source": "**/*.@(js|css|jpg|jpeg|gif|png|svg|webp|woff2)",
        "headers": [{ "key": "Cache-Control", "value": "max-age=31536000, immutable" }]
      },
      {
        "source": "**",
        "headers": [
          { "key": "X-Frame-Options", "value": "DENY" },
          { "key": "X-Content-Type-Options", "value": "nosniff" },
          { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
        ]
      }
    ]
  },
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  },
  "storage": {
    "rules": "storage.rules"
  },
  "functions": {
    "source": "functions",
    "runtime": "nodejs18"
  }
}`);

write('firestore.indexes.json', `{
  "indexes": [
    {
      "collectionGroup": "bookings",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "bookingStatus", "order": "ASCENDING" },
        { "fieldPath": "eventDate", "order": "ASCENDING" }
      ]
    },
    {
      "collectionGroup": "payments",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "bookingId", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    }
  ],
  "fieldOverrides": []
}`);

write('firestore.rules', `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function adminDoc() {
      return get(/databases/$(database)/documents/admins/$(request.auth.uid));
    }
    function isAdmin() {
      return request.auth != null && exists(/databases/$(database)/documents/admins/$(request.auth.uid)) && adminDoc().data.active == true;
    }
    function hasRole(roles) {
      return isAdmin() && adminDoc().data.role in roles;
    }

    match /siteConfig/{docId} {
      allow read: if true;
      allow write: if hasRole(['superadmin', 'manager']);
    }
    match /services/{docId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    match /packages/{docId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    match /gallery/{docId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    match /testimonials/{docId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    match /bookings/{docId} {
      allow create: if true;
      allow read, update, delete: if isAdmin();
    }
    match /customers/{docId} {
      allow create: if true;
      allow read, update: if isAdmin() || (request.auth != null && request.auth.uid == docId);
      allow delete: if hasRole(['superadmin']);
    }
    match /payments/{docId} {
      allow create: if true;
      allow read, update, delete: if isAdmin();
    }
    match /expenses/{docId} {
      allow read, write: if isAdmin();
    }
    match /staff/{docId} {
      allow read: if isAdmin();
      allow write: if hasRole(['superadmin', 'manager']);
    }
    match /admins/{docId} {
      allow read: if request.auth != null && request.auth.uid == docId;
      allow write: if hasRole(['superadmin']);
    }
    match /inquiries/{docId} {
      allow create: if true;
      allow read, update, delete: if isAdmin();
    }
    match /coupons/{docId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    match /blogs/{docId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    match /faqs/{docId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    match /notifications/{docId} {
      allow read: if isAdmin() || (request.auth != null && resource.data.userId == request.auth.uid);
      allow write: if isAdmin();
    }
    match /events/{docId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    match /referrals/{docId} {
      allow read, update: if isAdmin();
      allow create: if true;
    }
    match /leads/{docId} {
      allow create: if true;
      allow read, update, delete: if isAdmin();
    }
    match /festivalBanners/{docId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    match /brochures/{docId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    match /chatMessages/{docId} {
      allow create: if true;
      allow read, update, delete: if isAdmin();
    }
    match /analytics/{docId} {
      allow read: if isAdmin();
      allow write: if true;
    }
    match /activityLogs/{docId} {
      allow read: if isAdmin();
      allow create: if true;
    }
    match /subscribers/{docId} {
      allow create: if true;
      allow read, update, delete: if isAdmin();
    }
    match /mailQueue/{docId} {
      allow create: if true;
      allow read, update, delete: if isAdmin();
    }
    match /smsQueue/{docId} {
      allow create: if true;
      allow read, update, delete: if isAdmin();
    }
    match /whatsappQueue/{docId} {
      allow create: if true;
      allow read, update, delete: if isAdmin();
    }
  }
}`);

write('storage.rules', `rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    function isAuthed() {
      return request.auth != null;
    }
    match /gallery/{allPaths=**} {
      allow read: if true;
      allow write: if isAuthed() && request.resource.size < 50 * 1024 * 1024;
    }
    match /testimonials/{allPaths=**} {
      allow read: if true;
      allow write: if isAuthed();
    }
    match /avatars/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if isAuthed() && request.auth.uid == userId;
    }
    match /brochures/{allPaths=**} {
      allow read: if true;
      allow write: if isAuthed();
    }
    match /festivalBanners/{allPaths=**} {
      allow read: if true;
      allow write: if isAuthed();
    }
    match /receipts/{allPaths=**} {
      allow read, write: if isAuthed();
    }
    match /staffPhotos/{allPaths=**} {
      allow read, write: if isAuthed();
    }
    match /siteAssets/{allPaths=**} {
      allow read: if true;
      allow write: if isAuthed();
    }
  }
}`);

write('src/firebase/config.js', `import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported as analyticsSupported } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getMessaging, isSupported as messagingSupported } from 'firebase/messaging';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: 'AIzaSyCV_Z4BPen7wweLOKtiBc2TmECSO6I5A5M',
  authDomain: 'adithyaevents-a6140.firebaseapp.com',
  projectId: 'adithyaevents-a6140',
  storageBucket: 'adithyaevents-a6140.firebasestorage.app',
  messagingSenderId: '202241262091',
  appId: '1:202241262091:web:a418b19a7e4ae1e6acfd0e',
  measurementId: 'G-9Z6C91736V'
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
const functions = getFunctions(app, 'asia-south1');

let analytics = null;
let messaging = null;

if (typeof window !== 'undefined') {
  analyticsSupported().then((supported) => {
    if (supported) analytics = getAnalytics(app);
  }).catch(() => {});

  messagingSupported().then((supported) => {
    if (supported) messaging = getMessaging(app);
  }).catch(() => {});
}

export { app, analytics, auth, db, functions, messaging, storage };
export default app;
`);

write('src/utils/constants.js', `export const BRAND = {
  name: 'Adithya Event Management',
  shortName: 'Adithya Events',
  instagram: '@adithya_event_management',
  location: 'Vuyyuru, Andhra Pradesh, India',
  serviceArea: 'Vuyyuru, Vijayawada, Krishna District and Andhra Pradesh',
  phone: '+91 93932 17676',
  whatsapp: '919393217676',
  email: 'hello@adithyaevents.in',
  siteUrl: process.env.REACT_APP_SITE_URL || 'https://adithyaevents.in'
};

export const EVENT_TYPES = [
  'Wedding',
  'Engagement',
  'Birthday',
  'Half Saree Function',
  'Annaprasana',
  'House Warming',
  'Corporate Event',
  'Catering Only'
];

export const SERVICES = [
  { id: 'wedding', title: 'Wedding Planning', description: 'Mandap decor, rituals, hospitality, catering and day-long coordination.', icon: 'Crown', priceFrom: 180000 },
  { id: 'catering', title: 'Premium Catering', description: 'Authentic Telugu cuisine, live counters, sweets, snacks and service staff.', icon: 'Utensils', priceFrom: 450 },
  { id: 'birthday', title: 'Birthdays', description: 'Theme decor, cake table, balloons, entertainment, return gifts and food.', icon: 'PartyPopper', priceFrom: 35000 },
  { id: 'corporate', title: 'Corporate Events', description: 'Launches, conferences, team gatherings, stage, sound and branding.', icon: 'BriefcaseBusiness', priceFrom: 75000 },
  { id: 'engagement', title: 'Engagements', description: 'Ring ceremony decor, family dining, photography and guest management.', icon: 'Gem', priceFrom: 90000 },
  { id: 'photo', title: 'Photo and Video', description: 'Candid photography, cinematic film, drone and live streaming support.', icon: 'Camera', priceFrom: 60000 }
];

export const PACKAGES = [
  {
    id: 'silver',
    name: 'Silver',
    tagline: 'Elegant essentials',
    basePrice: 75000,
    guestRate: 420,
    color: '#D4AF37',
    includes: ['Basic stage decor', 'Buffet catering', 'Sound system', 'Event supervisor', 'Welcome board']
  },
  {
    id: 'gold',
    name: 'Gold',
    tagline: 'Premium celebration',
    basePrice: 145000,
    guestRate: 620,
    color: '#B8860B',
    includes: ['Premium stage and floral decor', 'Expanded Telugu menu', 'Photography team', 'Guest welcome desk', 'Live counter']
  },
  {
    id: 'diamond',
    name: 'Diamond',
    tagline: 'Signature royal experience',
    basePrice: 275000,
    guestRate: 850,
    color: '#722F37',
    includes: ['Luxury mandap and entrance', 'Cinematic photo/video', 'Drone coverage', 'Hospitality team', 'VIP dining service']
  }
];

export const ADD_ONS = [
  { id: 'drone', label: 'Drone coverage', price: 25000 },
  { id: 'live-counter', label: 'Live food counter', price: 18000 },
  { id: 'led-wall', label: 'LED wall', price: 35000 },
  { id: 'mehendi', label: 'Mehendi artists', price: 15000 },
  { id: 'return-gifts', label: 'Return gift desk', price: 22000 }
];

export const COUPONS = [
  { code: 'ADITHYA10', label: 'Launch offer', type: 'percent', value: 10, active: true },
  { code: 'VUYURU25K', label: 'Vuyyuru family offer', type: 'flat', value: 25000, active: true }
];

export const STATS = [
  { label: 'Events Managed', value: 500, suffix: '+' },
  { label: 'Years Experience', value: 10, suffix: '+' },
  { label: 'Guests Served', value: 50000, suffix: '+' },
  { label: 'Satisfaction', value: 98, suffix: '%' }
];

export const WHY_CHOOSE_US = [
  { title: '10+ Years Experience', text: 'Local vendor network, practical event timing and calm execution.', icon: 'BadgeCheck' },
  { title: 'Reliable and Punctual', text: 'Vendor arrivals, kitchen prep and stage handovers are tracked.', icon: 'Clock' },
  { title: 'Creative Decorators', text: 'Royal gold, floral, pastel and temple-inspired decor themes.', icon: 'Palette' },
  { title: 'Authentic Telugu Cuisine', text: 'Regional menus built for family functions and large gatherings.', icon: 'Soup' },
  { title: 'Professional Photographers', text: 'Candid, traditional, cinematic, drone and highlight reels.', icon: 'Camera' },
  { title: 'Transparent Pricing', text: 'Clear package scope, add-ons and balance tracking from day one.', icon: 'IndianRupee' }
];

export const GALLERY_ITEMS = [
  { id: 'g1', category: 'Wedding', title: 'Royal mandap night', color: 'gold' },
  { id: 'g2', category: 'Catering', title: 'Traditional festive buffet', color: 'emerald' },
  { id: 'g3', category: 'Birthday', title: 'Pastel birthday stage', color: 'rose' },
  { id: 'g4', category: 'Corporate', title: 'Launch event stage', color: 'burgundy' },
  { id: 'g5', category: 'Engagement', title: 'Ring ceremony florals', color: 'champagne' },
  { id: 'g6', category: 'Wedding', title: 'Bride and groom entry path', color: 'charcoal' }
];

export const TESTIMONIALS = [
  { name: 'Lakshmi Prasad', event: 'Wedding in Vuyyuru', rating: 5, text: 'The team handled decor, food and guest flow beautifully. Our family could actually enjoy the day.' },
  { name: 'Sravani K', event: 'Engagement', rating: 5, text: 'Very punctual, transparent pricing and a premium look without last-minute confusion.' },
  { name: 'Ramesh Foods Pvt Ltd', event: 'Corporate meet', rating: 5, text: 'Professional setup, good sound and excellent catering service for our guests.' }
];

export const FAQS = [
  { q: 'How early should we book?', a: 'For weddings, book 45 to 90 days ahead. Smaller events can usually be planned with 10 to 20 days notice.' },
  { q: 'Do you provide only catering?', a: 'Yes. Catering-only bookings are available with per-plate pricing and staff support.' },
  { q: 'Can packages be customized?', a: 'Every package can be customized by guest count, menu, decor level and add-ons.' },
  { q: 'Do you accept online payments?', a: 'Yes. Razorpay integration is wired through Firebase Cloud Functions so secrets stay on the server.' }
];

export const BLOG_POSTS = [
  { slug: 'telugu-wedding-checklist', title: 'Telugu Wedding Planning Checklist', excerpt: 'A practical planning sequence for families in Krishna district.', date: '2026-02-10' },
  { slug: 'catering-menu-vuyyuru', title: 'How to Build a Memorable Catering Menu', excerpt: 'Balancing traditional dishes, live counters and guest comfort.', date: '2026-03-04' },
  { slug: 'engagement-decor-ideas', title: 'Premium Engagement Decor Ideas', excerpt: 'Florals, lighting and stage cues that photograph beautifully.', date: '2026-04-22' }
];

export const ADMIN_NAV = [
  ['Dashboard', '/admin', 'LayoutDashboard'],
  ['Bookings', '/admin/bookings', 'CalendarCheck'],
  ['Customers', '/admin/customers', 'Users'],
  ['Payments', '/admin/payments', 'CreditCard'],
  ['Expenses', '/admin/expenses', 'ReceiptText'],
  ['Staff', '/admin/staff', 'UserRoundCog'],
  ['Gallery', '/admin/gallery', 'Images'],
  ['Services', '/admin/services', 'Sparkles'],
  ['Packages', '/admin/packages', 'Gem'],
  ['Leads', '/admin/leads', 'MessagesSquare'],
  ['Analytics', '/admin/analytics', 'BarChart3'],
  ['Settings', '/admin/settings', 'Settings']
];

export const COLLECTIONS = {
  bookings: 'bookings',
  customers: 'customers',
  payments: 'payments',
  expenses: 'expenses',
  staff: 'staff',
  services: 'services',
  packages: 'packages',
  gallery: 'gallery',
  testimonials: 'testimonials',
  blogs: 'blogs',
  faqs: 'faqs',
  coupons: 'coupons',
  leads: 'leads',
  notifications: 'notifications',
  subscribers: 'subscribers',
  referrals: 'referrals',
  activityLogs: 'activityLogs',
  siteConfig: 'siteConfig',
  festivalBanners: 'festivalBanners',
  brochures: 'brochures'
};
`);

write('src/utils/formatters.js', `export function formatCurrency(value = 0) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(Number(value || 0));
}

export function formatNumber(value = 0) {
  return new Intl.NumberFormat('en-IN').format(Number(value || 0));
}

export function titleCase(value = '') {
  return String(value).replace(/[-_]/g, ' ').replace(/\\w\\S*/g, (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
}

export function safeText(value, fallback = 'Not provided') {
  return value === undefined || value === null || value === '' ? fallback : String(value);
}
`);

write('src/utils/dateHelpers.js', `import { format, isValid, parseISO, differenceInCalendarDays } from 'date-fns';

export function toDate(value) {
  if (!value) return null;
  if (value.toDate) return value.toDate();
  if (value instanceof Date) return value;
  const parsed = parseISO(String(value));
  return isValid(parsed) ? parsed : null;
}

export function formatDate(value, pattern = 'dd MMM yyyy') {
  const date = toDate(value);
  return date ? format(date, pattern) : 'Date pending';
}

export function daysUntil(value) {
  const date = toDate(value);
  return date ? differenceInCalendarDays(date, new Date()) : null;
}

export function inputDate(date = new Date()) {
  return format(date, 'yyyy-MM-dd');
}
`);

write('src/utils/validators.js', `export function validatePhone(phone = '') {
  return /^\\+?91?[6-9]\\d{9}$/.test(String(phone).replace(/\\s/g, ''));
}

export function validateEmail(email = '') {
  return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(String(email).trim());
}

export function validateBookingStep(step, data) {
  const errors = {};
  if (step === 0 && !data.packageId) errors.packageId = 'Choose a package';
  if (step === 1) {
    if (!data.eventType) errors.eventType = 'Choose an event type';
    if (!data.eventDate) errors.eventDate = 'Choose an event date';
    if (!data.eventLocation) errors.eventLocation = 'Enter event location';
    if (!data.estimatedGuests || Number(data.estimatedGuests) < 25) errors.estimatedGuests = 'Guest count must be at least 25';
  }
  if (step === 2) {
    if (!data.customerName) errors.customerName = 'Enter customer name';
    if (!validatePhone(data.customerPhone)) errors.customerPhone = 'Enter a valid Indian mobile number';
    if (data.customerEmail && !validateEmail(data.customerEmail)) errors.customerEmail = 'Enter a valid email';
  }
  return errors;
}

export function hasErrors(errors) {
  return Object.keys(errors || {}).length > 0;
}
`);

write('src/utils/quoteCalculator.js', `import { ADD_ONS, COUPONS, PACKAGES } from './constants';

export function getPackage(packageId) {
  return PACKAGES.find((pkg) => pkg.id === packageId) || PACKAGES[1];
}

export function calculateQuote(input = {}) {
  const pkg = getPackage(input.packageId);
  const guests = Math.max(25, Number(input.estimatedGuests || 100));
  const eventDays = Math.max(1, Number(input.eventDays || 1));
  const addOns = Array.isArray(input.addOns) ? input.addOns : [];
  const addOnTotal = addOns.reduce((sum, id) => {
    const item = ADD_ONS.find((addon) => addon.id === id);
    return sum + (item ? item.price : 0);
  }, 0);
  const base = pkg.basePrice * eventDays;
  const catering = guests * pkg.guestRate * eventDays;
  const subtotal = base + catering + addOnTotal;
  const coupon = COUPONS.find((item) => item.active && item.code.toLowerCase() === String(input.couponCode || '').toLowerCase());
  const discount = coupon ? (coupon.type === 'percent' ? Math.round(subtotal * coupon.value / 100) : coupon.value) : 0;
  const tax = Math.round((subtotal - discount) * 0.05);
  const total = Math.max(0, subtotal - discount + tax);
  const advance = Math.ceil(total * 0.25 / 1000) * 1000;
  return {
    package: pkg,
    guests,
    eventDays,
    addOnTotal,
    base,
    catering,
    subtotal,
    coupon,
    discount,
    tax,
    total,
    advance,
    balance: Math.max(0, total - advance)
  };
}
`);

write('src/utils/helpers.js', `export function classNames(...values) {
  return values.filter(Boolean).join(' ');
}

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function generateId(prefix = 'AE') {
  const stamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return prefix + '-' + stamp + '-' + random;
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
`);

write('src/utils/seoHelpers.js', `import { BRAND } from './constants';

export function pageSeo(title, description, path = '/') {
  const fullTitle = title ? title + ' | ' + BRAND.name : BRAND.name;
  const url = BRAND.siteUrl.replace(/\\/$/, '') + path;
  return {
    title: fullTitle,
    description: description || 'Premium event management and catering in Vuyyuru, Andhra Pradesh.',
    canonical: url,
    schema: localBusinessSchema(url)
  };
}

export function localBusinessSchema(url = BRAND.siteUrl) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: BRAND.name,
    url,
    telephone: BRAND.phone,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Vuyyuru',
      addressRegion: 'Andhra Pradesh',
      addressCountry: 'IN'
    },
    areaServed: BRAND.serviceArea,
    sameAs: ['https://www.instagram.com/adithya_event_management/']
  };
}

export function faqSchema(items = []) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a }
    }))
  };
}
`);

write('src/utils/whatsappHelper.js', `import { BRAND } from './constants';

export function cleanPhone(phone = BRAND.whatsapp) {
  const digits = String(phone).replace(/\\D/g, '');
  return digits.startsWith('91') ? digits : '91' + digits;
}

export function whatsappUrl(message, phone = BRAND.whatsapp) {
  return 'https://wa.me/' + cleanPhone(phone) + '?text=' + encodeURIComponent(message);
}

export function bookingWhatsAppMessage(booking = {}) {
  return [
    'Hello Adithya Event Management,',
    'I would like to discuss an event booking.',
    'Name: ' + (booking.customerName || ''),
    'Event: ' + (booking.eventType || ''),
    'Date: ' + (booking.eventDate || ''),
    'Guests: ' + (booking.estimatedGuests || ''),
    'Package: ' + (booking.packageName || booking.packageId || '')
  ].join('\\n');
}
`);

write('src/utils/pdfGenerator.js', `import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { BRAND } from './constants';
import { formatCurrency } from './formatters';
import { formatDate } from './dateHelpers';

export function buildQuotePdf(booking, quote) {
  const doc = new jsPDF();
  doc.setFillColor(26, 26, 26);
  doc.rect(0, 0, 210, 38, 'F');
  doc.setTextColor(212, 175, 55);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text(BRAND.name, 14, 17);
  doc.setTextColor(255, 255, 240);
  doc.setFontSize(10);
  doc.text(BRAND.location + ' | ' + BRAND.phone, 14, 26);
  doc.setTextColor(26, 26, 26);
  doc.setFontSize(14);
  doc.text('Event Quote', 14, 52);
  autoTable(doc, {
    startY: 60,
    head: [['Field', 'Details']],
    body: [
      ['Customer', booking.customerName || 'Pending'],
      ['Event', booking.eventType || 'Pending'],
      ['Date', formatDate(booking.eventDate)],
      ['Guests', String(quote.guests)],
      ['Package', quote.package.name],
      ['Subtotal', formatCurrency(quote.subtotal)],
      ['Discount', formatCurrency(quote.discount)],
      ['GST estimate', formatCurrency(quote.tax)],
      ['Total', formatCurrency(quote.total)],
      ['Suggested advance', formatCurrency(quote.advance)]
    ],
    styles: { fontSize: 10 },
    headStyles: { fillColor: [114, 47, 55] }
  });
  doc.setFontSize(9);
  doc.text('This quote is valid for 7 days and may change based on venue access, final menu and decor scope.', 14, 280);
  return doc;
}

export function downloadQuotePdf(booking, quote) {
  const doc = buildQuotePdf(booking, quote);
  doc.save('adithya-event-quote.pdf');
}
`);

write('src/utils/receiptGenerator.js', `import QRCode from 'qrcode';
import jsPDF from 'jspdf';
import { BRAND } from './constants';
import { formatCurrency } from './formatters';
import { formatDate } from './dateHelpers';

export async function buildReceiptPdf(payment = {}, booking = {}) {
  const doc = new jsPDF();
  const qrValue = payment.razorpayPaymentId || payment.id || booking.bookingId || 'Adithya Event Management';
  const qr = await QRCode.toDataURL(qrValue);
  doc.setFillColor(26, 26, 26);
  doc.rect(0, 0, 210, 42, 'F');
  doc.setTextColor(212, 175, 55);
  doc.setFontSize(20);
  doc.text('Payment Receipt', 14, 18);
  doc.setTextColor(255, 255, 240);
  doc.setFontSize(10);
  doc.text(BRAND.name + ' | ' + BRAND.phone, 14, 28);
  doc.addImage(qr, 'PNG', 160, 51, 32, 32);
  doc.setTextColor(26, 26, 26);
  doc.setFontSize(11);
  const rows = [
    ['Receipt ID', payment.id || payment.razorpayPaymentId || 'Pending'],
    ['Booking ID', booking.bookingId || booking.id || payment.bookingId || 'Pending'],
    ['Customer', booking.customerName || payment.customerName || 'Pending'],
    ['Event Date', formatDate(booking.eventDate)],
    ['Amount Paid', formatCurrency(payment.amount || booking.advancePaid || 0)],
    ['Payment Method', payment.method || 'Razorpay'],
    ['Balance Due', formatCurrency(booking.balanceDue || 0)]
  ];
  rows.forEach((row, index) => {
    const y = 60 + index * 12;
    doc.setFont('helvetica', 'bold');
    doc.text(row[0], 18, y);
    doc.setFont('helvetica', 'normal');
    doc.text(String(row[1]), 70, y);
  });
  doc.setFontSize(9);
  doc.text('Scan the QR code for payment reference verification. Thank you for choosing Adithya Event Management.', 18, 150);
  return doc;
}

export async function downloadReceiptPdf(payment, booking) {
  const doc = await buildReceiptPdf(payment, booking);
  doc.save('adithya-payment-receipt.pdf');
}
`);

write('src/services/firebaseCrud.js', `import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where
} from 'firebase/firestore';
import { db } from '../firebase/config';

export function mapDoc(snapshot) {
  return { id: snapshot.id, ...snapshot.data() };
}

export function makeQuery(collectionName, options = {}) {
  const constraints = [];
  (options.where || []).forEach((item) => constraints.push(where(item[0], item[1], item[2])));
  if (options.orderBy) constraints.push(orderBy(options.orderBy[0], options.orderBy[1] || 'asc'));
  if (options.limit) constraints.push(limit(options.limit));
  return constraints.length ? query(collection(db, collectionName), ...constraints) : collection(db, collectionName);
}

export function subscribeCollection(collectionName, callback, errorCallback, options = {}) {
  return onSnapshot(makeQuery(collectionName, options), (snapshot) => {
    callback(snapshot.docs.map(mapDoc));
  }, errorCallback);
}

export async function listDocuments(collectionName, options = {}) {
  const snapshot = await getDocs(makeQuery(collectionName, options));
  return snapshot.docs.map(mapDoc);
}

export async function getDocument(collectionName, id) {
  const snapshot = await getDoc(doc(db, collectionName, id));
  return snapshot.exists() ? mapDoc(snapshot) : null;
}

export async function createDocument(collectionName, data) {
  const payload = {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };
  const ref = await addDoc(collection(db, collectionName), payload);
  return { id: ref.id, ...data };
}

export async function upsertDocument(collectionName, id, data) {
  const payload = { ...data, updatedAt: serverTimestamp() };
  await setDoc(doc(db, collectionName, id), payload, { merge: true });
  return { id, ...data };
}

export async function updateDocument(collectionName, id, data) {
  const payload = { ...data, updatedAt: serverTimestamp() };
  await updateDoc(doc(db, collectionName, id), payload);
  return { id, ...data };
}

export async function removeDocument(collectionName, id) {
  await deleteDoc(doc(db, collectionName, id));
  return id;
}
`);

write('src/services/bookingService.js', `import { arrayUnion, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { COLLECTIONS } from '../utils/constants';
import { calculateQuote } from '../utils/quoteCalculator';
import { createDocument, getDocument, listDocuments, subscribeCollection, updateDocument } from './firebaseCrud';
import { logActivity } from './analyticsService';

export async function createBooking(data) {
  const quote = calculateQuote(data);
  const booking = {
    ...data,
    packageName: quote.package.name,
    totalAmount: quote.total,
    advanceDue: quote.advance,
    advancePaid: 0,
    balanceDue: quote.total,
    bookingStatus: 'pending',
    paymentStatus: 'unpaid',
    timeline: [{ action: 'booking_created', timestamp: new Date().toISOString(), by: 'customer' }]
  };
  const created = await createDocument(COLLECTIONS.bookings, booking);
  await logActivity('booking_created', created.id, { customerName: data.customerName, totalAmount: quote.total });
  return created;
}

export function subscribeBookings(callback, errorCallback) {
  return subscribeCollection(COLLECTIONS.bookings, callback, errorCallback, { orderBy: ['createdAt', 'desc'] });
}

export function listBookings() {
  return listDocuments(COLLECTIONS.bookings, { orderBy: ['createdAt', 'desc'] });
}

export function getBooking(id) {
  return getDocument(COLLECTIONS.bookings, id);
}

export function updateBooking(id, data) {
  return updateDocument(COLLECTIONS.bookings, id, data);
}

export async function updateBookingStatus(id, status, by = 'admin') {
  await updateDoc(doc(db, COLLECTIONS.bookings, id), {
    bookingStatus: status,
    updatedAt: serverTimestamp(),
    timeline: arrayUnion({ action: 'status_changed', status, timestamp: new Date().toISOString(), by })
  });
  return { id, status };
}
`);

write('src/services/paymentService.js', `import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase/config';
import { COLLECTIONS } from '../utils/constants';
import { createDocument, listDocuments, subscribeCollection, updateDocument } from './firebaseCrud';

export function subscribePayments(callback, errorCallback) {
  return subscribeCollection(COLLECTIONS.payments, callback, errorCallback, { orderBy: ['createdAt', 'desc'] });
}

export function listPayments() {
  return listDocuments(COLLECTIONS.payments, { orderBy: ['createdAt', 'desc'] });
}

export function recordPayment(data) {
  return createDocument(COLLECTIONS.payments, { ...data, status: data.status || 'recorded' });
}

export function updatePayment(id, data) {
  return updateDocument(COLLECTIONS.payments, id, data);
}

export async function createRazorpayOrder(payload) {
  const callable = httpsCallable(functions, 'createRazorpayOrder');
  const result = await callable(payload);
  return result.data;
}

export async function verifyRazorpayPayment(payload) {
  const callable = httpsCallable(functions, 'verifyRazorpayPayment');
  const result = await callable(payload);
  return result.data;
}
`);

write('src/services/analyticsService.js', `import { logEvent } from 'firebase/analytics';
import { analytics } from '../firebase/config';
import { COLLECTIONS } from '../utils/constants';
import { createDocument } from './firebaseCrud';

export function trackEvent(name, params = {}) {
  if (analytics) {
    try {
      logEvent(analytics, name, params);
    } catch (error) {
      console.warn('Analytics event failed', error);
    }
  }
  return createDocument(COLLECTIONS.analytics || 'analytics', {
    name,
    params,
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server'
  }).catch(() => null);
}

export function trackPageView(path, title) {
  return trackEvent('page_view', { page_path: path, page_title: title });
}

export function logActivity(action, targetId, metadata = {}) {
  return createDocument(COLLECTIONS.activityLogs, { action, targetId, metadata }).catch(() => null);
}
`);

const serviceMap = {
  notificationService: ['notifications', 'sendNotification', 'Notification'],
  emailService: ['mailQueue', 'queueEmail', 'Email'],
  smsService: ['smsQueue', 'queueSms', 'SMS'],
  whatsappService: ['whatsappQueue', 'queueWhatsApp', 'WhatsApp'],
  couponService: ['coupons', 'saveCoupon', 'Coupon'],
  referralService: ['referrals', 'saveReferral', 'Referral'],
  leadService: ['leads', 'saveLead', 'Lead']
};

Object.entries(serviceMap).forEach(([file, data]) => {
  const collectionName = data[0];
  const saveName = data[1];
  const label = data[2];
  write('src/services/' + file + '.js', `import { createDocument, listDocuments, subscribeCollection, updateDocument, removeDocument } from './firebaseCrud';

const collectionName = '${collectionName}';

export function subscribe${label}s(callback, errorCallback) {
  return subscribeCollection(collectionName, callback, errorCallback, { orderBy: ['createdAt', 'desc'] });
}

export function list${label}s() {
  return listDocuments(collectionName, { orderBy: ['createdAt', 'desc'] });
}

export function ${saveName}(data) {
  return createDocument(collectionName, data);
}

export function update${label}(id, data) {
  return updateDocument(collectionName, id, data);
}

export function delete${label}(id) {
  return removeDocument(collectionName, id);
}
`);
});

write('src/services/storageService.js', `import { getDownloadURL, ref, uploadBytesResumable, deleteObject } from 'firebase/storage';
import { storage } from '../firebase/config';

export function uploadFile(path, file, onProgress) {
  return new Promise((resolve, reject) => {
    const storageRef = ref(storage, path);
    const task = uploadBytesResumable(storageRef, file);
    task.on('state_changed', (snapshot) => {
      const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      if (onProgress) onProgress(progress);
    }, reject, async () => {
      const url = await getDownloadURL(task.snapshot.ref);
      resolve({ url, path, name: file.name, size: file.size, type: file.type });
    });
  });
}

export function deleteFile(path) {
  return deleteObject(ref(storage, path));
}
`);

write('src/context/ThemeContext.jsx', `import { createContext, useEffect, useMemo, useState } from 'react';

export const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('adithya-theme') || 'light');
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('adithya-theme', theme);
  }, [theme]);
  const value = useMemo(() => ({
    theme,
    isDark: theme === 'dark',
    toggleTheme: () => setTheme((current) => current === 'dark' ? 'light' : 'dark'),
    setTheme
  }), [theme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
`);

write('src/context/AuthContext.jsx', `import { createContext, useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import { getDocument } from '../services/firebaseCrud';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const adminDoc = await getDocument('admins', firebaseUser.uid).catch(() => null);
        setAdmin(adminDoc && adminDoc.active ? adminDoc : null);
      } else {
        setAdmin(null);
      }
      setLoading(false);
    });
  }, []);

  async function login(email, password) {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    const adminDoc = await getDocument('admins', credential.user.uid).catch(() => null);
    if (!adminDoc || !adminDoc.active) {
      await signOut(auth);
      throw new Error('Admin account is inactive or not registered.');
    }
    setAdmin(adminDoc);
    return credential.user;
  }

  const value = useMemo(() => ({
    user,
    admin,
    loading,
    isAdmin: Boolean(admin),
    login,
    logout: () => signOut(auth),
    resetPassword: (email) => sendPasswordResetEmail(auth, email)
  }), [user, admin, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
`);

write('src/context/CartContext.jsx', `import { createContext, useMemo, useState } from 'react';

export const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const value = useMemo(() => ({
    items,
    addItem: (item) => setItems((current) => [...current, item]),
    removeItem: (id) => setItems((current) => current.filter((item) => item.id !== id)),
    clearCart: () => setItems([]),
    total: items.reduce((sum, item) => sum + Number(item.price || 0), 0)
  }), [items]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
`);

write('src/context/NotificationContext.jsx', `import { createContext, useCallback, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

export const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const notify = useCallback((message, type = 'success') => {
    const item = { id: Date.now(), message, type, read: false };
    setNotifications((current) => [item, ...current].slice(0, 30));
    toast[type === 'error' ? 'error' : 'success'](message);
    return item;
  }, []);
  const value = useMemo(() => ({
    notifications,
    unreadCount: notifications.filter((item) => !item.read).length,
    notify,
    markAllRead: () => setNotifications((current) => current.map((item) => ({ ...item, read: true })))
  }), [notifications, notify]);
  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}
`);

write('src/context/AdminContext.jsx', `import { createContext, useMemo, useState } from 'react';

export const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  const [dateRange, setDateRange] = useState('month');
  const [search, setSearch] = useState('');
  const value = useMemo(() => ({ dateRange, setDateRange, search, setSearch }), [dateRange, search]);
  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}
`);

write('src/hooks/useAuth.js', `import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used inside AuthProvider');
  return value;
}
`);

write('src/hooks/useTheme.js', `import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

export default function useTheme() {
  const value = useContext(ThemeContext);
  if (!value) throw new Error('useTheme must be used inside ThemeProvider');
  return value;
}
`);

write('src/hooks/useNotifications.js', `import { useContext } from 'react';
import { NotificationContext } from '../context/NotificationContext';

export default function useNotifications() {
  const value = useContext(NotificationContext);
  if (!value) throw new Error('useNotifications must be used inside NotificationProvider');
  return value;
}
`);

write('src/hooks/useFirestore.js', `import { useEffect, useState } from 'react';
import { subscribeCollection } from '../services/firebaseCrud';

export default function useFirestore(collectionName, options = {}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeCollection(collectionName, (items) => {
      setData(items);
      setLoading(false);
    }, (err) => {
      setError(err);
      setLoading(false);
    }, options);
    return unsubscribe;
  }, [collectionName, JSON.stringify(options)]);
  return { data, loading, error };
}
`);

write('src/hooks/useRealtime.js', `import useFirestore from './useFirestore';

export default function useRealtime(collectionName, options = {}) {
  return useFirestore(collectionName, options);
}
`);

write('src/hooks/useBookings.js', `import useFirestore from './useFirestore';

export default function useBookings() {
  return useFirestore('bookings', { orderBy: ['createdAt', 'desc'] });
}
`);

write('src/hooks/usePayments.js', `import useFirestore from './useFirestore';

export default function usePayments() {
  return useFirestore('payments', { orderBy: ['createdAt', 'desc'] });
}
`);

write('src/hooks/useAnalytics.js', `import { useCallback } from 'react';
import { trackEvent, trackPageView } from '../services/analyticsService';

export default function useAnalytics() {
  return {
    trackEvent: useCallback((name, params) => trackEvent(name, params), []),
    trackPageView: useCallback((path, title) => trackPageView(path, title), [])
  };
}
`);

write('src/hooks/useStorage.js', `import { useState } from 'react';
import { uploadFile } from '../services/storageService';

export default function useStorage() {
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  async function upload(path, file) {
    setLoading(true);
    setError(null);
    try {
      const result = await uploadFile(path, file, setProgress);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err);
      setLoading(false);
      throw err;
    }
  }
  return { upload, progress, loading, error };
}
`);

write('src/hooks/useScrollAnimation.js', `import { useEffect, useRef, useState } from 'react';

export default function useScrollAnimation(options = { threshold: 0.2 }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setInView(true);
    }, options);
    observer.observe(node);
    return () => observer.disconnect();
  }, [options.threshold]);
  return { ref, inView };
}
`);

write('src/components/common/Button.jsx', `import { Loader2 } from 'lucide-react';
import { classNames } from '../../utils/helpers';

export default function Button({ children, className = '', variant = 'primary', loading = false, icon: Icon, ...props }) {
  return (
    <button className={classNames('btn', 'btn-' + variant, className)} disabled={loading || props.disabled} {...props}>
      {loading ? <Loader2 size={18} className="spin" /> : Icon ? <Icon size={18} /> : null}
      <span>{children}</span>
    </button>
  );
}
`);

write('src/components/common/Input.jsx', `export default function Input({ label, error, className = '', ...props }) {
  return (
    <label className={'field ' + className}>
      {label && <span>{label}</span>}
      <input {...props} />
      {error && <small className="field-error">{error}</small>}
    </label>
  );
}
`);

write('src/components/common/Select.jsx', `export default function Select({ label, options = [], error, className = '', ...props }) {
  return (
    <label className={'field ' + className}>
      {label && <span>{label}</span>}
      <select {...props}>
        <option value="">Select</option>
        {options.map((option) => (
          <option key={option.value || option} value={option.value || option}>{option.label || option}</option>
        ))}
      </select>
      {error && <small className="field-error">{error}</small>}
    </label>
  );
}
`);

write('src/components/common/DatePicker.jsx', `import Input from './Input';

export default function DatePicker(props) {
  return <Input type="date" {...props} />;
}
`);

write('src/components/common/Spinner.jsx', `import { Loader2 } from 'lucide-react';

export default function Spinner({ label = 'Loading' }) {
  return <div className="spinner"><Loader2 className="spin" size={22} /><span>{label}</span></div>;
}
`);

write('src/components/common/Badge.jsx', `export default function Badge({ children, tone = 'gold' }) {
  return <span className={'badge badge-' + tone}>{children}</span>;
}
`);

write('src/components/common/Card.jsx', `export default function Card({ children, className = '' }) {
  return <article className={'card ' + className}>{children}</article>;
}
`);

write('src/components/common/Modal.jsx', `import { X } from 'lucide-react';
import Button from './Button';

export default function Modal({ open, title, children, onClose }) {
  if (!open) return null;
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="modal" role="dialog" aria-modal="true" onMouseDown={(event) => event.stopPropagation()}>
        <div className="modal-head">
          <h3>{title}</h3>
          <Button variant="ghost" icon={X} aria-label="Close" onClick={onClose}>Close</Button>
        </div>
        {children}
      </section>
    </div>
  );
}
`);

write('src/components/common/Table.jsx', `import EmptyState from './EmptyState';

export default function Table({ columns = [], rows = [], actions }) {
  if (!rows.length) return <EmptyState title="No records yet" text="New records will appear here in real time." />;
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>{columns.map((column) => <th key={column.key}>{column.label}</th>)}{actions && <th>Actions</th>}</tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id || JSON.stringify(row)}>
              {columns.map((column) => <td key={column.key}>{column.render ? column.render(row) : row[column.key]}</td>)}
              {actions && <td>{actions(row)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
`);

write('src/components/common/Pagination.jsx', `import Button from './Button';

export default function Pagination({ page = 1, totalPages = 1, onChange }) {
  return (
    <div className="pagination">
      <Button variant="ghost" disabled={page <= 1} onClick={() => onChange(page - 1)}>Previous</Button>
      <span>Page {page} of {totalPages}</span>
      <Button variant="ghost" disabled={page >= totalPages} onClick={() => onChange(page + 1)}>Next</Button>
    </div>
  );
}
`);

write('src/components/common/SearchBar.jsx', `import { Search } from 'lucide-react';

export default function SearchBar({ value, onChange, placeholder = 'Search' }) {
  return (
    <label className="search-bar">
      <Search size={18} />
      <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
    </label>
  );
}
`);

write('src/components/common/EmptyState.jsx', `import { Sparkles } from 'lucide-react';

export default function EmptyState({ title = 'Nothing here yet', text = 'Once data is added, it will show up here.' }) {
  return <div className="empty-state"><Sparkles size={28} /><h3>{title}</h3><p>{text}</p></div>;
}
`);

write('src/components/common/ConfirmDialog.jsx', `import Modal from './Modal';
import Button from './Button';

export default function ConfirmDialog({ open, title = 'Confirm action', text, onCancel, onConfirm }) {
  return (
    <Modal open={open} title={title} onClose={onCancel}>
      <p>{text || 'This action cannot be undone.'}</p>
      <div className="modal-actions">
        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button variant="danger" onClick={onConfirm}>Confirm</Button>
      </div>
    </Modal>
  );
}
`);

write('src/components/common/NotificationBell.jsx', `import { Bell } from 'lucide-react';
import useNotifications from '../../hooks/useNotifications';
import Button from './Button';

export default function NotificationBell() {
  const { unreadCount, markAllRead } = useNotifications();
  return <Button variant="ghost" icon={Bell} onClick={markAllRead}>Alerts {unreadCount ? '(' + unreadCount + ')' : ''}</Button>;
}
`);

write('src/components/common/BackButton.jsx', `import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';

export default function BackButton() {
  const navigate = useNavigate();
  return <Button variant="ghost" icon={ArrowLeft} onClick={() => navigate(-1)}>Back</Button>;
}
`);

write('src/components/common/StarRating.jsx', `import { Star } from 'lucide-react';

export default function StarRating({ value = 5 }) {
  return <span className="stars" aria-label={value + ' star rating'}>{Array.from({ length: 5 }, (_, index) => <Star key={index} size={16} fill={index < value ? 'currentColor' : 'none'} />)}</span>;
}
`);

write('src/components/common/ProgressBar.jsx', `export default function ProgressBar({ value = 0 }) {
  return <div className="progress"><span style={{ width: Math.min(100, Math.max(0, value)) + '%' }} /></div>;
}
`);

write('src/components/common/Countdown.jsx', `import { useEffect, useState } from 'react';

function getRemaining(target) {
  const diff = Math.max(0, new Date(target).getTime() - Date.now());
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor(diff / 3600000) % 24,
    minutes: Math.floor(diff / 60000) % 60
  };
}

export default function Countdown({ target }) {
  const [remaining, setRemaining] = useState(() => getRemaining(target));
  useEffect(() => {
    const timer = setInterval(() => setRemaining(getRemaining(target)), 60000);
    return () => clearInterval(timer);
  }, [target]);
  return <div className="countdown"><span>{remaining.days}d</span><span>{remaining.hours}h</span><span>{remaining.minutes}m</span></div>;
}
`);

write('src/components/common/FileUpload.jsx', `import { UploadCloud } from 'lucide-react';

export default function FileUpload({ label = 'Upload file', onChange, accept = 'image/*,application/pdf' }) {
  return (
    <label className="file-upload">
      <UploadCloud size={22} />
      <span>{label}</span>
      <input type="file" accept={accept} onChange={(event) => onChange(event.target.files?.[0])} />
    </label>
  );
}
`);

write('src/components/common/Toast.jsx', `import { Toaster } from 'react-hot-toast';

export default function Toast() {
  return <Toaster position="top-right" toastOptions={{ duration: 3500, style: { border: '1px solid rgba(212,175,55,.3)' } }} />;
}
`);

write('src/components/common/LazyImage.jsx', `export default function LazyImage({ title, className = '', style = {} }) {
  return (
    <div className={'lazy-visual ' + className} style={style} role="img" aria-label={title || 'Event visual'}>
      <span>{title}</span>
    </div>
  );
}
`);

write('src/components/common/PageTransition.jsx', `import { motion } from 'framer-motion';

export default function PageTransition({ children }) {
  return (
    <motion.main initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ type: 'spring', stiffness: 120, damping: 20 }}>
      {children}
    </motion.main>
  );
}
`);

write('src/components/common/SEOHead.jsx', `import { Helmet } from 'react-helmet-async';
import { BRAND } from '../../utils/constants';

export default function SEOHead({ title, description, canonical, schema }) {
  const pageTitle = title || BRAND.name;
  const metaDescription = description || 'Premium event management and catering in Vuyyuru, Andhra Pradesh.';
  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content="website" />
      {canonical && <link rel="canonical" href={canonical} />}
      {schema && <script type="application/ld+json">{JSON.stringify(schema)}</script>}
    </Helmet>
  );
}
`);

write('src/components/common/ThemeToggle.jsx', `import { Moon, Sun } from 'lucide-react';
import useTheme from '../../hooks/useTheme';
import Button from './Button';

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();
  return <Button variant="ghost" icon={isDark ? Sun : Moon} onClick={toggleTheme}>{isDark ? 'Light' : 'Dark'}</Button>;
}
`);

write('src/components/common/Navbar.jsx', `import { Menu, Sparkles } from 'lucide-react';
import { NavLink, Link } from 'react-router-dom';
import { BRAND } from '../../utils/constants';
import Button from './Button';
import ThemeToggle from './ThemeToggle';

const links = [
  ['Home', '/'],
  ['Services', '/services'],
  ['Packages', '/packages'],
  ['Gallery', '/gallery'],
  ['Quote', '/quote'],
  ['Contact', '/contact']
];

export default function Navbar() {
  return (
    <header className="site-nav">
      <Link to="/" className="brand-mark"><span>AE</span><strong>{BRAND.name}</strong></Link>
      <nav>
        {links.map(([label, path]) => <NavLink key={path} to={path}>{label}</NavLink>)}
      </nav>
      <div className="nav-actions">
        <ThemeToggle />
        <Button as="a" icon={Sparkles} onClick={() => { window.location.href = '/book'; }}>Book</Button>
        <Button className="nav-menu" variant="ghost" icon={Menu}>Menu</Button>
      </div>
    </header>
  );
}
`);

write('src/components/common/MobileNavbar.jsx', `import { CalendarCheck, Home, Image, MessageCircle, Sparkles } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const items = [
  ['Home', '/', Home],
  ['Gallery', '/gallery', Image],
  ['Book', '/book', Sparkles],
  ['Track', '/track', CalendarCheck],
  ['Chat', '/contact', MessageCircle]
];

export default function MobileNavbar() {
  return (
    <nav className="mobile-nav">
      {items.map(([label, path, Icon]) => (
        <NavLink key={path} to={path} className={label === 'Book' ? 'mobile-primary' : ''}><Icon size={19} /><span>{label}</span></NavLink>
      ))}
    </nav>
  );
}
`);

write('src/components/common/Footer.jsx', `import { Instagram, Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BRAND } from '../../utils/constants';
import { saveLead } from '../../services/leadService';
import Button from './Button';
import Input from './Input';
import { useState } from 'react';
import useNotifications from '../../hooks/useNotifications';

export default function Footer() {
  const [form, setForm] = useState({ email: '', phone: '' });
  const { notify } = useNotifications();
  async function submit(event) {
    event.preventDefault();
    await saveLead({ type: 'subscriber', ...form });
    setForm({ email: '', phone: '' });
    notify('Subscription saved. We will share offers with you.');
  }
  return (
    <footer className="site-footer">
      <section className="newsletter-band">
        <div>
          <span className="eyebrow">Exclusive Offers</span>
          <h2>Stay updated on premium event packages</h2>
        </div>
        <form onSubmit={submit} className="newsletter-form">
          <Input aria-label="Email" placeholder="Email address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Input aria-label="WhatsApp" placeholder="WhatsApp number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <Button>Subscribe</Button>
        </form>
      </section>
      <section className="footer-grid">
        <div><h3>{BRAND.name}</h3><p>Premium event management and catering for families and businesses across Krishna district.</p></div>
        <div><h4>Explore</h4><Link to="/wedding">Weddings</Link><Link to="/catering">Catering</Link><Link to="/corporate">Corporate</Link><Link to="/faq">FAQ</Link></div>
        <div><h4>Contact</h4><p><Phone size={16} /> {BRAND.phone}</p><p><MapPin size={16} /> {BRAND.location}</p><p><Instagram size={16} /> {BRAND.instagram}</p><p><Mail size={16} /> {BRAND.email}</p></div>
      </section>
    </footer>
  );
}
`);

write('src/components/common/FloatingButtons.jsx', `import { MessageCircle, Phone, ReceiptText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { whatsappUrl } from '../../utils/whatsappHelper';
import { BRAND } from '../../utils/constants';

export default function FloatingButtons() {
  return (
    <div className="floating-actions">
      <a href={whatsappUrl('Hello Adithya Event Management, I want to plan an event.')} target="_blank" rel="noreferrer" aria-label="WhatsApp"><MessageCircle /></a>
      <a href={'tel:' + BRAND.phone.replace(/\\s/g, '')} aria-label="Call"><Phone /></a>
      <Link to="/track" aria-label="Track booking"><ReceiptText /></Link>
    </div>
  );
}
`);

write('src/components/common/ScrollToTop.jsx', `import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);
  return null;
}
`);

write('src/components/common/LoadingScreen.jsx', `import { useEffect, useState } from 'react';

export default function LoadingScreen() {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setHidden(true), 900);
    return () => clearTimeout(timer);
  }, []);
  if (hidden) return null;
  return (
    <div className="loading-screen">
      <div className="mandala"><span /><span /><span /></div>
      <h1>Adithya Event Management</h1>
    </div>
  );
}
`);

write('src/components/common/FeaturePanel.jsx', `import * as Icons from 'lucide-react';
import { motion } from 'framer-motion';
import Card from './Card';

export default function FeaturePanel({ eyebrow, title, text, items = [], dark = false, columns = 3 }) {
  return (
    <section className={'section-band ' + (dark ? 'section-dark' : '')}>
      <div className="section-inner">
        <div className="section-heading">
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
          <h2>{title}</h2>
          {text && <p>{text}</p>}
        </div>
        <div className="feature-grid" style={{ '--cols': columns }}>
          {items.map((item, index) => {
            const Icon = Icons[item.icon] || Icons.Sparkles;
            return (
              <motion.div key={item.id || item.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.04 }}>
                <Card className="feature-card">
                  <Icon size={26} />
                  <h3>{item.title || item.name}</h3>
                  <p>{item.description || item.text || item.excerpt}</p>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
`);

write('src/components/home/HeroSection.jsx', `import { CalendarCheck, MapPin, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../common/Button';
import { BRAND } from '../../utils/constants';
import StatsCounter from './StatsCounter';

export default function HeroSection() {
  return (
    <section className="hero-section">
      <div className="hero-pattern" aria-hidden="true" />
      <motion.div className="hero-content" initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 90, damping: 16 }}>
        <span className="script">Celebrations with royal warmth</span>
        <h1>{BRAND.name}</h1>
        <p>Premium event planning, catering, decor, photography and guest hospitality for families and corporates in Vuyyuru and Vijayawada.</p>
        <div className="hero-actions">
          <Button icon={Sparkles} onClick={() => { window.location.href = '/book'; }}>Book an Event</Button>
          <Link to="/quote" className="btn btn-outline"><CalendarCheck size={18} /><span>Get Quote</span></Link>
        </div>
        <p className="hero-location"><MapPin size={16} /> {BRAND.location}</p>
      </motion.div>
      <StatsCounter compact />
    </section>
  );
}
`);

write('src/components/home/StatsCounter.jsx', `import CountUp from 'react-countup';
import { STATS } from '../../utils/constants';

export default function StatsCounter({ compact = false }) {
  return (
    <section className={compact ? 'stats-strip compact' : 'stats-strip'}>
      {STATS.map((stat) => (
        <div key={stat.label}>
          <strong><CountUp end={stat.value} duration={2.2} enableScrollSpy />{stat.suffix}</strong>
          <span>{stat.label}</span>
        </div>
      ))}
    </section>
  );
}
`);

write('src/components/home/PackageCircles.jsx', `import { useState } from 'react';
import { PACKAGES } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatters';
import Button from '../common/Button';
import Modal from '../common/Modal';

export default function PackageCircles() {
  const [selected, setSelected] = useState(null);
  return (
    <section className="section-band packages-band">
      <div className="section-inner">
        <div className="section-heading"><span className="eyebrow">Packages</span><h2>Choose your celebration level</h2><p>Each package can be tailored by guest count, menu, decor, venue and add-ons.</p></div>
        <div className="package-circles">
          {PACKAGES.map((pkg) => (
            <button key={pkg.id} className="package-circle" style={{ '--accent': pkg.color }} onClick={() => setSelected(pkg)}>
              <span>{pkg.name}</span>
              <strong>{formatCurrency(pkg.basePrice)}</strong>
              <small>{pkg.tagline}</small>
            </button>
          ))}
        </div>
      </div>
      <Modal open={Boolean(selected)} title={selected?.name + ' Package'} onClose={() => setSelected(null)}>
        {selected && <div><p>{selected.tagline}</p><ul className="check-list">{selected.includes.map((item) => <li key={item}>{item}</li>)}</ul><Button onClick={() => { window.location.href = '/book?package=' + selected.id; }}>Start Booking</Button></div>}
      </Modal>
    </section>
  );
}
`);

const homeSimple = {
  ServicesSection: ['Premium Services', 'Everything your event needs in one accountable team.', 'SERVICES', 'Services'],
  WhyChooseUs: ['Why Families Choose Us', 'Practical planning, beautiful design and transparent delivery.', 'WHY_CHOOSE_US', 'Strengths'],
  TestimonialsSection: ['Client Stories', 'Families and businesses trust us with their biggest days.', 'TESTIMONIALS', 'Reviews'],
  BlogPreview: ['Planning Journal', 'Useful ideas for Telugu celebrations, menus and event timelines.', 'BLOG_POSTS', 'Insights']
};
Object.entries(homeSimple).forEach(([name, cfg]) => {
  write('src/components/home/' + name + '.jsx', `import FeaturePanel from '../common/FeaturePanel';
import { ${cfg[2]} } from '../../utils/constants';

export default function ${name}() {
  return <FeaturePanel eyebrow="${cfg[3]}" title="${cfg[0]}" text="${cfg[1]}" items={${cfg[2]}} columns={${name === 'TestimonialsSection' ? 3 : 3}} ${name === 'WhyChooseUs' ? 'dark' : ''} />;
}
`);
});

write('src/components/home/GallerySection.jsx', `import { Link } from 'react-router-dom';
import { GALLERY_ITEMS } from '../../utils/constants';
import Button from '../common/Button';
import LazyImage from '../common/LazyImage';

export default function GallerySection() {
  return (
    <section className="section-band">
      <div className="section-inner">
        <div className="section-heading"><span className="eyebrow">Gallery</span><h2>Recent celebration moods</h2><p>Gradient panels stand in until the admin uploads real event images.</p></div>
        <div className="gallery-preview">
          {GALLERY_ITEMS.slice(0, 6).map((item) => <LazyImage key={item.id} title={item.title} className={'visual-' + item.color} />)}
        </div>
        <div className="center-actions"><Link to="/gallery" className="btn btn-outline"><span>Open Gallery</span></Link><Button onClick={() => { window.location.href = '/book'; }}>Plan Similar Event</Button></div>
      </div>
    </section>
  );
}
`);

write('src/components/home/EventShowcase.jsx', `import { EVENT_TYPES } from '../../utils/constants';

export default function EventShowcase() {
  return (
    <section className="parallax-band">
      <h2>Creating Memories That Last A Lifetime</h2>
      <div>{EVENT_TYPES.slice(0, 6).map((item) => <span key={item}>{item}</span>)}</div>
    </section>
  );
}
`);

write('src/components/home/AboutSection.jsx', `import { BRAND } from '../../utils/constants';

export default function AboutSection() {
  return (
    <section className="section-band about-band">
      <div className="section-inner split-layout">
        <div><span className="eyebrow">About</span><h2>Local roots, premium execution</h2><p>{BRAND.name} brings a polished, accountable planning process to celebrations across {BRAND.serviceArea}. The team combines regional food knowledge, trusted vendor coordination and warm family hospitality.</p></div>
        <div className="timeline">
          {['Started premium family event planning', 'Expanded catering and decor network', '500+ events completed', 'Digital booking platform launched'].map((item, index) => <p key={item}><strong>{2016 + index * 3}</strong>{item}</p>)}
        </div>
      </div>
    </section>
  );
}
`);

write('src/components/home/FestivalBannersSection.jsx', `import Button from '../common/Button';

export default function FestivalBannersSection() {
  return (
    <section className="festival-banner">
      <div><span className="eyebrow">Seasonal Offer</span><h2>Wedding season premium decor slots are open</h2><p>Reserve early for better date availability and vendor selection.</p></div>
      <Button onClick={() => { window.location.href = '/book'; }}>Reserve Date</Button>
    </section>
  );
}
`);

write('src/components/home/FAQSection.jsx', `import { useState } from 'react';
import { FAQS } from '../../utils/constants';

export default function FAQSection() {
  const [open, setOpen] = useState(0);
  return (
    <section className="section-band">
      <div className="section-inner narrow">
        <div className="section-heading"><span className="eyebrow">FAQ</span><h2>Common planning questions</h2></div>
        <div className="faq-list">
          {FAQS.map((item, index) => <button key={item.q} className={open === index ? 'active' : ''} onClick={() => setOpen(open === index ? -1 : index)}><strong>{item.q}</strong>{open === index && <p>{item.a}</p>}</button>)}
        </div>
      </div>
    </section>
  );
}
`);

write('src/components/home/ContactSection.jsx', `import { useState } from 'react';
import { Send } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
import { EVENT_TYPES } from '../../utils/constants';
import { saveLead } from '../../services/leadService';
import useNotifications from '../../hooks/useNotifications';

export default function ContactSection() {
  const [form, setForm] = useState({ name: '', phone: '', eventType: '', message: '' });
  const [loading, setLoading] = useState(false);
  const { notify } = useNotifications();
  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    await saveLead({ ...form, source: 'contact_form' });
    setLoading(false);
    setForm({ name: '', phone: '', eventType: '', message: '' });
    notify('Inquiry sent. The team will contact you soon.');
  }
  return (
    <section className="section-band contact-band">
      <div className="section-inner split-layout">
        <div><span className="eyebrow">Contact</span><h2>Tell us what you are planning</h2><p>Share the event type, date and rough guest count. We will respond with the most practical package path.</p></div>
        <form className="form-panel" onSubmit={submit}>
          <Input label="Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input label="Phone" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <Select label="Event Type" options={EVENT_TYPES} value={form.eventType} onChange={(e) => setForm({ ...form, eventType: e.target.value })} />
          <label className="field"><span>Message</span><textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} /></label>
          <Button icon={Send} loading={loading}>Send Inquiry</Button>
        </form>
      </div>
    </section>
  );
}
`);

write('src/components/home/LiveCountdown.jsx', `import Countdown from '../common/Countdown';

export default function LiveCountdown() {
  const target = new Date();
  target.setDate(target.getDate() + 30);
  return (
    <section className="countdown-band">
      <span className="eyebrow">Next premium slot window</span>
      <h2>Book early for next month celebrations</h2>
      <Countdown target={target} />
    </section>
  );
}
`);

write('src/components/home/SocialFeed.jsx', `import { Instagram } from 'lucide-react';
import { BRAND, GALLERY_ITEMS } from '../../utils/constants';

export default function SocialFeed() {
  return (
    <section className="section-band">
      <div className="section-inner">
        <div className="section-heading"><span className="eyebrow">Instagram</span><h2>Follow {BRAND.instagram}</h2><p>Manual curation is ready for admin-uploaded Instagram post assets.</p></div>
        <div className="social-grid">{GALLERY_ITEMS.map((item) => <a key={item.id} href="https://www.instagram.com/adithya_event_management/" target="_blank" rel="noreferrer" className={'social-tile visual-' + item.color}><Instagram /><span>{item.category}</span></a>)}</div>
      </div>
    </section>
  );
}
`);

write('src/components/home/GoogleReviews.jsx', `import StarRating from '../common/StarRating';
import { TESTIMONIALS } from '../../utils/constants';

export default function GoogleReviews() {
  return (
    <section className="section-band section-dark">
      <div className="section-inner">
        <div className="section-heading"><span className="eyebrow">Google Reviews</span><h2>4.9 rating from local families</h2><p>Admin can replace these curated reviews with Google Business Profile data.</p></div>
        <div className="review-row">{TESTIMONIALS.map((item) => <article key={item.name} className="review-card"><StarRating value={item.rating} /><p>{item.text}</p><strong>{item.name}</strong><span>{item.event}</span></article>)}</div>
      </div>
    </section>
  );
}
`);

write('src/components/home/BrochureDownload.jsx', `import { Download } from 'lucide-react';
import Button from '../common/Button';

export default function BrochureDownload() {
  return (
    <section className="brochure-band">
      <div><span className="eyebrow">Brochure</span><h2>Need package details for a family discussion?</h2><p>Downloadable brochures can be managed from the admin panel.</p></div>
      <Button icon={Download} onClick={() => window.print()}>Print Overview</Button>
    </section>
  );
}
`);

write('src/components/home/VideoReel.jsx', `import { useState } from 'react';
import ReactPlayer from 'react-player';
import { Play } from 'lucide-react';
import Button from '../common/Button';

export default function VideoReel() {
  const [playing, setPlaying] = useState(false);
  return (
    <section className="video-reel section-dark">
      <div className="section-inner">
        <div className="section-heading"><span className="eyebrow">Video Reel</span><h2>See the magic in action</h2><p>Drone footage, highlights and behind-the-scenes clips can be uploaded by admin.</p></div>
        <div className="video-frame">
          {playing ? <ReactPlayer url="https://www.youtube.com/watch?v=dQw4w9WgXcQ" playing controls width="100%" height="100%" /> : <button onClick={() => setPlaying(true)}><Play size={46} fill="currentColor" /><span>Highlights</span></button>}
        </div>
        <div className="tab-row"><Button variant="ghost">Drone Footage</Button><Button variant="ghost">Highlights</Button><Button variant="ghost">Behind the Scenes</Button></div>
      </div>
    </section>
  );
}
`);

write('src/components/home/CouponBanner.jsx', `import { useState } from 'react';
import { COUPONS } from '../../utils/constants';
import Button from '../common/Button';

export default function CouponBanner() {
  const [hidden, setHidden] = useState(sessionStorage.getItem('coupon-hidden') === 'true');
  const [copied, setCopied] = useState(false);
  const coupon = COUPONS[0];
  if (hidden || !coupon) return null;
  async function copy() {
    await navigator.clipboard.writeText(coupon.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }
  return (
    <div className="coupon-banner">
      <strong>{coupon.label}: use {coupon.code}</strong>
      <div><Button variant="ghost" onClick={copy}>{copied ? 'Copied' : 'Copy Code'}</Button><Button variant="ghost" onClick={() => { sessionStorage.setItem('coupon-hidden', 'true'); setHidden(true); }}>Dismiss</Button></div>
    </div>
  );
}
`);

write('src/components/booking/BookingSteps.jsx', `export default function BookingSteps({ steps, current }) {
  return (
    <ol className="booking-steps">
      {steps.map((step, index) => <li key={step} className={index <= current ? 'active' : ''}><span>{index + 1}</span>{step}</li>)}
    </ol>
  );
}
`);

write('src/components/booking/PackageSelector.jsx', `import { PACKAGES } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatters';

export default function PackageSelector({ value, onChange }) {
  return (
    <div className="selector-grid">
      {PACKAGES.map((pkg) => <button key={pkg.id} className={value === pkg.id ? 'selected' : ''} onClick={() => onChange(pkg.id)}><strong>{pkg.name}</strong><span>{pkg.tagline}</span><small>{formatCurrency(pkg.basePrice)} base</small></button>)}
    </div>
  );
}
`);

write('src/components/booking/EventDetailsForm.jsx', `import { ADD_ONS, EVENT_TYPES } from '../../utils/constants';
import DatePicker from '../common/DatePicker';
import Input from '../common/Input';
import Select from '../common/Select';

export default function EventDetailsForm({ data, setData, errors = {} }) {
  function toggleAddon(id) {
    const current = data.addOns || [];
    setData({ ...data, addOns: current.includes(id) ? current.filter((item) => item !== id) : [...current, id] });
  }
  return (
    <div className="form-grid">
      <Select label="Event Type" options={EVENT_TYPES} value={data.eventType || ''} error={errors.eventType} onChange={(e) => setData({ ...data, eventType: e.target.value })} />
      <DatePicker label="Event Date" value={data.eventDate || ''} error={errors.eventDate} onChange={(e) => setData({ ...data, eventDate: e.target.value })} />
      <Input label="Event Location" value={data.eventLocation || ''} error={errors.eventLocation} onChange={(e) => setData({ ...data, eventLocation: e.target.value })} />
      <Input label="Estimated Guests" type="number" min="25" value={data.estimatedGuests || ''} error={errors.estimatedGuests} onChange={(e) => setData({ ...data, estimatedGuests: e.target.value })} />
      <Input label="Event Days" type="number" min="1" value={data.eventDays || 1} onChange={(e) => setData({ ...data, eventDays: e.target.value })} />
      <div className="addon-list">{ADD_ONS.map((addon) => <label key={addon.id}><input type="checkbox" checked={(data.addOns || []).includes(addon.id)} onChange={() => toggleAddon(addon.id)} />{addon.label}</label>)}</div>
    </div>
  );
}
`);

write('src/components/booking/ContactDetailsForm.jsx', `import Input from '../common/Input';

export default function ContactDetailsForm({ data, setData, errors = {} }) {
  return (
    <div className="form-grid">
      <Input label="Customer Name" value={data.customerName || ''} error={errors.customerName} onChange={(e) => setData({ ...data, customerName: e.target.value })} />
      <Input label="Phone / WhatsApp" value={data.customerPhone || ''} error={errors.customerPhone} onChange={(e) => setData({ ...data, customerPhone: e.target.value })} />
      <Input label="Email" type="email" value={data.customerEmail || ''} error={errors.customerEmail} onChange={(e) => setData({ ...data, customerEmail: e.target.value })} />
      <label className="field wide"><span>Special Notes</span><textarea value={data.notes || ''} onChange={(e) => setData({ ...data, notes: e.target.value })} /></label>
    </div>
  );
}
`);

write('src/components/booking/QuoteReview.jsx', `import { formatCurrency } from '../../utils/formatters';
import { calculateQuote } from '../../utils/quoteCalculator';
import Input from '../common/Input';
import Button from '../common/Button';
import { downloadQuotePdf } from '../../utils/pdfGenerator';

export default function QuoteReview({ data, setData }) {
  const quote = calculateQuote(data);
  return (
    <div className="quote-review">
      <div className="quote-lines">
        <p><span>Package</span><strong>{quote.package.name}</strong></p>
        <p><span>Base</span><strong>{formatCurrency(quote.base)}</strong></p>
        <p><span>Catering</span><strong>{formatCurrency(quote.catering)}</strong></p>
        <p><span>Add-ons</span><strong>{formatCurrency(quote.addOnTotal)}</strong></p>
        <p><span>Discount</span><strong>{formatCurrency(quote.discount)}</strong></p>
        <p><span>GST estimate</span><strong>{formatCurrency(quote.tax)}</strong></p>
        <p className="total"><span>Total</span><strong>{formatCurrency(quote.total)}</strong></p>
        <p><span>Advance</span><strong>{formatCurrency(quote.advance)}</strong></p>
      </div>
      <Input label="Coupon Code" value={data.couponCode || ''} onChange={(e) => setData({ ...data, couponCode: e.target.value.toUpperCase() })} />
      <Button variant="outline" onClick={() => downloadQuotePdf(data, quote)}>Download Quote PDF</Button>
    </div>
  );
}
`);

write('src/components/payment/RazorpayButton.jsx', `import { CreditCard } from 'lucide-react';
import { createRazorpayOrder, verifyRazorpayPayment } from '../../services/paymentService';
import Button from '../common/Button';

function loadScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function RazorpayButton({ booking, amount, onSuccess, disabled }) {
  async function pay() {
    const key = process.env.REACT_APP_RAZORPAY_KEY_ID;
    if (!key) throw new Error('Razorpay public key is missing in REACT_APP_RAZORPAY_KEY_ID.');
    const loaded = await loadScript();
    if (!loaded) throw new Error('Unable to load Razorpay checkout.');
    const order = await createRazorpayOrder({ amount, bookingId: booking.id || booking.bookingId });
    const checkout = new window.Razorpay({
      key,
      amount: order.amount,
      currency: order.currency || 'INR',
      name: 'Adithya Event Management',
      description: booking.eventType || 'Event booking advance',
      order_id: order.orderId,
      prefill: { name: booking.customerName, email: booking.customerEmail, contact: booking.customerPhone },
      handler: async (response) => {
        const verified = await verifyRazorpayPayment({ ...response, bookingId: booking.id, amountPaid: amount });
        onSuccess?.(verified);
      },
      theme: { color: '#D4AF37' }
    });
    checkout.open();
  }
  return <Button icon={CreditCard} disabled={disabled} onClick={pay}>Pay Advance</Button>;
}
`);

write('src/components/booking/PaymentStep.jsx', `import { useState } from 'react';
import confetti from 'canvas-confetti';
import Button from '../common/Button';
import { createBooking } from '../../services/bookingService';
import { recordPayment } from '../../services/paymentService';
import { calculateQuote } from '../../utils/quoteCalculator';
import { formatCurrency } from '../../utils/formatters';
import useNotifications from '../../hooks/useNotifications';

export default function PaymentStep({ data, onComplete }) {
  const [loading, setLoading] = useState(false);
  const quote = calculateQuote(data);
  const { notify } = useNotifications();
  async function submit(paymentMethod) {
    setLoading(true);
    const booking = await createBooking({ ...data, paymentMethod });
    if (paymentMethod !== 'razorpay') {
      await recordPayment({ bookingId: booking.id, amount: 0, method: paymentMethod, status: 'pending' });
    }
    confetti({ particleCount: 90, spread: 70, origin: { y: 0.7 } });
    notify('Booking request created successfully.');
    setLoading(false);
    onComplete(booking);
  }
  return (
    <div className="payment-step">
      <h3>Advance due: {formatCurrency(quote.advance)}</h3>
      <p>Razorpay is wired through Firebase Cloud Functions. If the live key is not configured yet, record the booking for offline confirmation.</p>
      <div className="modal-actions">
        <Button loading={loading} onClick={() => submit('razorpay')}>Create Booking for Razorpay</Button>
        <Button variant="outline" loading={loading} onClick={() => submit('offline')}>Confirm Offline</Button>
      </div>
    </div>
  );
}
`);

write('src/components/booking/BookingSuccess.jsx', `import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import Button from '../common/Button';
import { whatsappUrl, bookingWhatsAppMessage } from '../../utils/whatsappHelper';

export default function BookingSuccess({ booking }) {
  return (
    <section className="success-panel">
      <CheckCircle2 size={52} />
      <h2>Booking request received</h2>
      <p>Your reference is {booking?.bookingId || booking?.id}. The Adithya team will confirm availability and final details.</p>
      <div className="center-actions">
        <a className="btn btn-primary" href={whatsappUrl(bookingWhatsAppMessage(booking))} target="_blank" rel="noreferrer"><span>Open WhatsApp</span></a>
        <Link to="/track" className="btn btn-outline"><span>Track Booking</span></Link>
      </div>
    </section>
  );
}
`);

write('src/components/booking/BookingForm.jsx', `import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Button from '../common/Button';
import BookingSteps from './BookingSteps';
import PackageSelector from './PackageSelector';
import EventDetailsForm from './EventDetailsForm';
import ContactDetailsForm from './ContactDetailsForm';
import QuoteReview from './QuoteReview';
import PaymentStep from './PaymentStep';
import BookingSuccess from './BookingSuccess';
import { validateBookingStep, hasErrors } from '../../utils/validators';

const steps = ['Package', 'Event', 'Contact', 'Review', 'Payment'];

export default function BookingForm() {
  const [params] = useSearchParams();
  const [current, setCurrent] = useState(0);
  const [errors, setErrors] = useState({});
  const [created, setCreated] = useState(null);
  const [data, setData] = useState({ packageId: params.get('package') || 'gold', eventDays: 1, estimatedGuests: 150, addOns: [] });
  const content = useMemo(() => {
    if (created) return <BookingSuccess booking={created} />;
    if (current === 0) return <PackageSelector value={data.packageId} onChange={(packageId) => setData({ ...data, packageId })} />;
    if (current === 1) return <EventDetailsForm data={data} setData={setData} errors={errors} />;
    if (current === 2) return <ContactDetailsForm data={data} setData={setData} errors={errors} />;
    if (current === 3) return <QuoteReview data={data} setData={setData} />;
    return <PaymentStep data={data} onComplete={setCreated} />;
  }, [current, data, errors, created]);
  function next() {
    const stepErrors = validateBookingStep(current, data);
    setErrors(stepErrors);
    if (!hasErrors(stepErrors)) setCurrent((value) => Math.min(steps.length - 1, value + 1));
  }
  if (created) return content;
  return (
    <section className="booking-panel">
      <BookingSteps steps={steps} current={current} />
      <div className="booking-card">{content}</div>
      <div className="booking-actions">
        <Button variant="ghost" disabled={current === 0} onClick={() => setCurrent((value) => value - 1)}>Previous</Button>
        {current < steps.length - 1 ? <Button onClick={next}>Next</Button> : null}
      </div>
    </section>
  );
}
`);

write('src/components/booking/QuoteCalculator.jsx', `import { useState } from 'react';
import { ADD_ONS, EVENT_TYPES, PACKAGES } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatters';
import { calculateQuote } from '../../utils/quoteCalculator';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
import { downloadQuotePdf } from '../../utils/pdfGenerator';

export default function QuoteCalculator() {
  const [data, setData] = useState({ packageId: 'gold', estimatedGuests: 150, eventDays: 1, eventType: 'Wedding', addOns: [] });
  const quote = calculateQuote(data);
  function toggleAddon(id) {
    const current = data.addOns || [];
    setData({ ...data, addOns: current.includes(id) ? current.filter((item) => item !== id) : [...current, id] });
  }
  return (
    <section className="quote-calculator">
      <div className="form-grid">
        <Select label="Package" options={PACKAGES.map((pkg) => ({ value: pkg.id, label: pkg.name }))} value={data.packageId} onChange={(e) => setData({ ...data, packageId: e.target.value })} />
        <Select label="Event Type" options={EVENT_TYPES} value={data.eventType} onChange={(e) => setData({ ...data, eventType: e.target.value })} />
        <Input label="Guests" type="number" value={data.estimatedGuests} onChange={(e) => setData({ ...data, estimatedGuests: e.target.value })} />
        <Input label="Days" type="number" value={data.eventDays} onChange={(e) => setData({ ...data, eventDays: e.target.value })} />
        <Input label="Coupon" value={data.couponCode || ''} onChange={(e) => setData({ ...data, couponCode: e.target.value.toUpperCase() })} />
      </div>
      <div className="addon-list">{ADD_ONS.map((addon) => <label key={addon.id}><input type="checkbox" checked={data.addOns.includes(addon.id)} onChange={() => toggleAddon(addon.id)} />{addon.label}</label>)}</div>
      <div className="quote-total"><span>Total estimate</span><strong>{formatCurrency(quote.total)}</strong><small>Advance: {formatCurrency(quote.advance)}</small></div>
      <Button onClick={() => downloadQuotePdf(data, quote)}>Download Quote PDF</Button>
    </section>
  );
}
`);

write('src/components/booking/BookingTracker.jsx', `import { useState } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import { getBooking } from '../../services/bookingService';
import { formatCurrency } from '../../utils/formatters';
import { formatDate } from '../../utils/dateHelpers';

export default function BookingTracker() {
  const [id, setId] = useState('');
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState('');
  async function track() {
    setError('');
    const result = await getBooking(id).catch(() => null);
    setBooking(result);
    if (!result) setError('No booking found for this reference.');
  }
  return (
    <section className="tracker-panel">
      <div className="inline-form"><Input label="Booking Reference" value={id} onChange={(e) => setId(e.target.value)} /><Button onClick={track}>Track</Button></div>
      {error && <p className="field-error">{error}</p>}
      {booking && <div className="status-card"><h3>{booking.eventType}</h3><p>{formatDate(booking.eventDate)} at {booking.eventLocation}</p><p>Status: <strong>{booking.bookingStatus}</strong></p><p>Total: {formatCurrency(booking.totalAmount)}</p></div>}
    </section>
  );
}
`);

write('src/components/payment/PaymentReceipt.jsx', `import { Download } from 'lucide-react';
import Button from '../common/Button';
import { downloadReceiptPdf } from '../../utils/receiptGenerator';
import { formatCurrency } from '../../utils/formatters';

export default function PaymentReceipt({ payment = {}, booking = {} }) {
  return (
    <article className="receipt-card">
      <h2>Payment Receipt</h2>
      <p>Booking: {booking.bookingId || payment.bookingId || 'Pending'}</p>
      <p>Amount: {formatCurrency(payment.amount || 0)}</p>
      <p>Status: {payment.status || 'recorded'}</p>
      <Button icon={Download} onClick={() => downloadReceiptPdf(payment, booking)}>Download PDF</Button>
    </article>
  );
}
`);

write('src/components/payment/PaymentHistory.jsx', `import usePayments from '../../hooks/usePayments';
import { formatCurrency } from '../../utils/formatters';
import Table from '../common/Table';

export default function PaymentHistory() {
  const { data } = usePayments();
  return <Table rows={data} columns={[{ key: 'bookingId', label: 'Booking' }, { key: 'amount', label: 'Amount', render: (row) => formatCurrency(row.amount) }, { key: 'method', label: 'Method' }, { key: 'status', label: 'Status' }]} />;
}
`);

write('src/components/payment/BalanceTracker.jsx', `import ProgressBar from '../common/ProgressBar';
import { formatCurrency } from '../../utils/formatters';

export default function BalanceTracker({ total = 0, paid = 0 }) {
  const percent = total ? Math.round((paid / total) * 100) : 0;
  return (
    <div className="balance-tracker">
      <div><span>Paid</span><strong>{formatCurrency(paid)}</strong></div>
      <ProgressBar value={percent} />
      <div><span>Balance</span><strong>{formatCurrency(Math.max(0, total - paid))}</strong></div>
    </div>
  );
}
`);

write('src/components/gallery/GalleryFilter.jsx', `export default function GalleryFilter({ categories, value, onChange }) {
  return <div className="filter-row">{categories.map((category) => <button key={category} className={value === category ? 'active' : ''} onClick={() => onChange(category)}>{category}</button>)}</div>;
}
`);

write('src/components/gallery/GalleryLightbox.jsx', `import Modal from '../common/Modal';
import LazyImage from '../common/LazyImage';

export default function GalleryLightbox({ item, onClose }) {
  return <Modal open={Boolean(item)} title={item?.title} onClose={onClose}>{item && <LazyImage title={item.title} className={'large visual-' + item.color} />}</Modal>;
}
`);

write('src/components/gallery/GalleryGrid.jsx', `import { useState } from 'react';
import { GALLERY_ITEMS } from '../../utils/constants';
import LazyImage from '../common/LazyImage';
import GalleryFilter from './GalleryFilter';
import GalleryLightbox from './GalleryLightbox';

export default function GalleryGrid() {
  const categories = ['All', ...Array.from(new Set(GALLERY_ITEMS.map((item) => item.category)))];
  const [category, setCategory] = useState('All');
  const [selected, setSelected] = useState(null);
  const items = category === 'All' ? GALLERY_ITEMS : GALLERY_ITEMS.filter((item) => item.category === category);
  return (
    <section className="gallery-page-grid">
      <GalleryFilter categories={categories} value={category} onChange={setCategory} />
      <div className="gallery-preview">{items.map((item) => <button key={item.id} onClick={() => setSelected(item)}><LazyImage title={item.title} className={'visual-' + item.color} /></button>)}</div>
      <GalleryLightbox item={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
`);

write('src/components/gallery/VideoPlayer.jsx', `import ReactPlayer from 'react-player';

export default function VideoPlayer({ url }) {
  return <div className="video-frame"><ReactPlayer url={url} controls width="100%" height="100%" /></div>;
}
`);

write('src/components/gallery/DroneFootage.jsx', `import VideoPlayer from './VideoPlayer';

export default function DroneFootage() {
  return <VideoPlayer url="https://www.youtube.com/watch?v=dQw4w9WgXcQ" />;
}
`);

write('src/components/chat/ChatMessage.jsx', `export default function ChatMessage({ message }) {
  return <div className={'chat-message ' + message.role}><p>{message.text}</p></div>;
}
`);

write('src/components/chat/ChatInput.jsx', `import { Send } from 'lucide-react';
import Button from '../common/Button';

export default function ChatInput({ value, onChange, onSend }) {
  return (
    <form className="chat-input" onSubmit={(event) => { event.preventDefault(); onSend(); }}>
      <input value={value} onChange={(event) => onChange(event.target.value)} placeholder="Ask about packages, catering or dates" />
      <Button icon={Send}>Send</Button>
    </form>
  );
}
`);

write('src/components/chat/ChatHistory.jsx', `import ChatMessage from './ChatMessage';

export default function ChatHistory({ messages }) {
  return <div className="chat-history">{messages.map((message) => <ChatMessage key={message.id} message={message} />)}</div>;
}
`);

write('src/components/chat/AIChatbot.jsx', `import { useState } from 'react';
import { saveLead } from '../../services/leadService';
import ChatHistory from './ChatHistory';
import ChatInput from './ChatInput';

function answer(input) {
  const text = input.toLowerCase();
  if (text.includes('price') || text.includes('package')) return 'Our Silver, Gold and Diamond packages start from Rs. 75,000 before catering and custom add-ons. Use the Quote page for a live estimate.';
  if (text.includes('catering') || text.includes('food')) return 'We provide authentic Telugu catering, live counters, sweets, snacks and service staff. Per-guest pricing depends on menu and package.';
  if (text.includes('date') || text.includes('available')) return 'Share your event date and guest count, and our team will confirm availability quickly.';
  return 'I can help with packages, catering, decor, photography, booking status and WhatsApp follow-up. What are you planning?';
}

export default function AIChatbot() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([{ id: 1, role: 'assistant', text: 'Namaste. How can I help plan your event?' }]);
  async function send() {
    if (!input.trim()) return;
    const userMessage = { id: Date.now(), role: 'user', text: input };
    const botMessage = { id: Date.now() + 1, role: 'assistant', text: answer(input) };
    setMessages((current) => [...current, userMessage, botMessage]);
    await saveLead({ type: 'chat', message: input }).catch(() => null);
    setInput('');
  }
  return <section className="chatbot"><ChatHistory messages={messages} /><ChatInput value={input} onChange={setInput} onSend={send} /></section>;
}
`);

write('src/components/admin/AdminSidebar.jsx', `import * as Icons from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { ADMIN_NAV, BRAND } from '../../utils/constants';

export default function AdminSidebar() {
  return (
    <aside className="admin-sidebar">
      <div className="admin-brand"><span>AE</span><strong>{BRAND.shortName}</strong></div>
      <nav>{ADMIN_NAV.map(([label, path, icon]) => { const Icon = Icons[icon] || Icons.Circle; return <NavLink key={path} to={path} end={path === '/admin'}><Icon size={18} />{label}</NavLink>; })}</nav>
    </aside>
  );
}
`);

write('src/components/admin/AdminTopbar.jsx', `import { LogOut, Search } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import NotificationBell from '../common/NotificationBell';
import Button from '../common/Button';

export default function AdminTopbar() {
  const { admin, logout } = useAuth();
  return (
    <header className="admin-topbar">
      <label><Search size={18} /><input placeholder="Search bookings, customers, payments" /></label>
      <div><NotificationBell /><span>{admin?.name || 'Admin'}</span><Button variant="ghost" icon={LogOut} onClick={logout}>Logout</Button></div>
    </header>
  );
}
`);

write('src/components/admin/AdminLayout.jsx', `import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminTopbar from './AdminTopbar';

export default function AdminLayout() {
  return (
    <div className="admin-shell">
      <AdminSidebar />
      <main className="admin-main">
        <AdminTopbar />
        <Outlet />
      </main>
    </div>
  );
}
`);

write('src/components/admin/DashboardCards.jsx', `import { CalendarCheck, CreditCard, IndianRupee, Users } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export default function DashboardCards({ bookings = [], payments = [] }) {
  const revenue = payments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
  const cards = [
    ['Bookings', bookings.length, CalendarCheck],
    ['Revenue', formatCurrency(revenue), IndianRupee],
    ['Customers', new Set(bookings.map((item) => item.customerPhone)).size, Users],
    ['Payments', payments.length, CreditCard]
  ];
  return <div className="dashboard-cards">{cards.map(([label, value, Icon]) => <article key={label}><Icon /><span>{label}</span><strong>{value}</strong></article>)}</div>;
}
`);

write('src/components/admin/RevenueCharts.jsx', `import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export default function RevenueCharts({ payments = [] }) {
  const data = payments.slice(0, 8).map((payment, index) => ({ name: payment.bookingId || 'P' + (index + 1), amount: Number(payment.amount || 0) }));
  return (
    <section className="chart-panel">
      <h3>Revenue Snapshot</h3>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="amount" fill="#D4AF37" radius={[8, 8, 0, 0]} /></BarChart>
      </ResponsiveContainer>
    </section>
  );
}
`);

write('src/components/admin/AdminCrud.jsx', `import { useMemo, useState } from 'react';
import useFirestore from '../../hooks/useFirestore';
import { createDocument, removeDocument, updateDocument } from '../../services/firebaseCrud';
import Button from '../common/Button';
import Input from '../common/Input';
import SearchBar from '../common/SearchBar';
import Table from '../common/Table';

export default function AdminCrud({ collectionName, title, fields = ['title', 'status'], seed = {} }) {
  const { data, loading, error } = useFirestore(collectionName, { orderBy: ['createdAt', 'desc'] });
  const [form, setForm] = useState(seed);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState('');
  const rows = useMemo(() => data.filter((row) => JSON.stringify(row).toLowerCase().includes(search.toLowerCase())), [data, search]);
  async function submit(event) {
    event.preventDefault();
    if (editing) {
      await updateDocument(collectionName, editing, form);
    } else {
      await createDocument(collectionName, form);
    }
    setEditing(null);
    setForm(seed);
  }
  return (
    <section className="admin-screen">
      <div className="admin-heading"><div><span className="eyebrow">Admin</span><h1>{title}</h1></div><SearchBar value={search} onChange={setSearch} placeholder={'Search ' + title} /></div>
      <form className="admin-form" onSubmit={submit}>
        {fields.map((field) => <Input key={field} label={field} value={form[field] || ''} onChange={(e) => setForm({ ...form, [field]: e.target.value })} />)}
        <Button>{editing ? 'Update' : 'Create'}</Button>
      </form>
      {error && <p className="field-error">{error.message}</p>}
      <Table rows={rows} columns={fields.map((field) => ({ key: field, label: field }))} actions={(row) => <div className="table-actions"><Button variant="ghost" onClick={() => { setEditing(row.id); setForm(row); }}>Edit</Button><Button variant="danger" onClick={() => removeDocument(collectionName, row.id)}>Delete</Button></div>} />
      {loading && <p>Loading records...</p>}
    </section>
  );
}
`);

const adminComponents = {
  BookingTable: ['bookings', 'Bookings', ['customerName', 'eventType', 'bookingStatus', 'totalAmount']],
  CustomerTable: ['customers', 'Customers', ['name', 'phone', 'email', 'status']],
  StaffTable: ['staff', 'Staff', ['name', 'role', 'phone', 'status']],
  PaymentTable: ['payments', 'Payments', ['bookingId', 'amount', 'method', 'status']],
  ExpenseTable: ['expenses', 'Expenses', ['title', 'amount', 'category', 'status']],
  GalleryManager: ['gallery', 'Gallery', ['title', 'category', 'imageUrl', 'status']],
  ServiceManager: ['services', 'Services', ['title', 'priceFrom', 'description', 'status']],
  PackageManager: ['packages', 'Packages', ['name', 'basePrice', 'guestRate', 'status']],
  TestimonialManager: ['testimonials', 'Testimonials', ['name', 'event', 'rating', 'text']],
  BlogManager: ['blogs', 'Blog Posts', ['title', 'slug', 'excerpt', 'status']],
  FAQManager: ['faqs', 'FAQs', ['q', 'a', 'status', 'order']],
  CouponManager: ['coupons', 'Coupons', ['code', 'type', 'value', 'active']],
  LeadManager: ['leads', 'Leads', ['name', 'phone', 'eventType', 'status']],
  NotificationManager: ['notifications', 'Notifications', ['title', 'body', 'userId', 'status']],
  SEOManager: ['siteConfig', 'SEO Settings', ['title', 'description', 'keywords', 'path']],
  SiteConfigManager: ['siteConfig', 'Site Config', ['key', 'title', 'value', 'status']],
  FestivalBannerManager: ['festivalBanners', 'Festival Banners', ['title', 'subtitle', 'validUntil', 'status']],
  BrochureManager: ['brochures', 'Brochures', ['title', 'fileUrl', 'version', 'status']],
  ReferralManager: ['referrals', 'Referrals', ['name', 'phone', 'referralCode', 'status']],
  ActivityLog: ['activityLogs', 'Activity Logs', ['action', 'targetId', 'metadata', 'status']],
  BackupManager: ['backups', 'Backups', ['title', 'fileUrl', 'createdBy', 'status']]
};

Object.entries(adminComponents).forEach(([name, cfg]) => {
  write('src/components/admin/' + name + '.jsx', `import AdminCrud from './AdminCrud';

export default function ${name}() {
  return <AdminCrud collectionName="${cfg[0]}" title="${cfg[1]}" fields={${JSON.stringify(cfg[2])}} />;
}
`);
});

write('src/pages/public/HomePage.jsx', `import SEOHead from '../../components/common/SEOHead';
import CouponBanner from '../../components/home/CouponBanner';
import HeroSection from '../../components/home/HeroSection';
import PackageCircles from '../../components/home/PackageCircles';
import ServicesSection from '../../components/home/ServicesSection';
import GallerySection from '../../components/home/GallerySection';
import EventShowcase from '../../components/home/EventShowcase';
import AboutSection from '../../components/home/AboutSection';
import WhyChooseUs from '../../components/home/WhyChooseUs';
import FestivalBannersSection from '../../components/home/FestivalBannersSection';
import VideoReel from '../../components/home/VideoReel';
import TestimonialsSection from '../../components/home/TestimonialsSection';
import GoogleReviews from '../../components/home/GoogleReviews';
import BlogPreview from '../../components/home/BlogPreview';
import FAQSection from '../../components/home/FAQSection';
import BrochureDownload from '../../components/home/BrochureDownload';
import ContactSection from '../../components/home/ContactSection';
import SocialFeed from '../../components/home/SocialFeed';
import LiveCountdown from '../../components/home/LiveCountdown';
import { pageSeo } from '../../utils/seoHelpers';

export default function HomePage() {
  const seo = pageSeo('Premium Events in Vuyyuru', 'Weddings, catering, birthdays and corporate events by Adithya Event Management.');
  return (
    <>
      <SEOHead {...seo} />
      <CouponBanner />
      <HeroSection />
      <PackageCircles />
      <ServicesSection />
      <EventShowcase />
      <AboutSection />
      <WhyChooseUs />
      <FestivalBannersSection />
      <GallerySection />
      <VideoReel />
      <TestimonialsSection />
      <GoogleReviews />
      <LiveCountdown />
      <BlogPreview />
      <SocialFeed />
      <BrochureDownload />
      <FAQSection />
      <ContactSection />
    </>
  );
}
`);

write('src/pages/public/SectionPage.jsx', `import SEOHead from '../../components/common/SEOHead';
import FeaturePanel from '../../components/common/FeaturePanel';
import { BLOG_POSTS, EVENT_TYPES, FAQS, PACKAGES, SERVICES, TESTIMONIALS, WHY_CHOOSE_US } from '../../utils/constants';
import { pageSeo, faqSchema } from '../../utils/seoHelpers';
import PackageCircles from '../../components/home/PackageCircles';
import ServicesSection from '../../components/home/ServicesSection';
import TestimonialsSection from '../../components/home/TestimonialsSection';
import FAQSection from '../../components/home/FAQSection';
import ContactSection from '../../components/home/ContactSection';

export function SimplePage({ title, description, type = 'services' }) {
  const seo = pageSeo(title, description, '/' + title.toLowerCase().replace(/\\s+/g, '-'));
  const items = type === 'blog' ? BLOG_POSTS : type === 'testimonials' ? TESTIMONIALS : type === 'why' ? WHY_CHOOSE_US : SERVICES;
  return (
    <>
      <SEOHead {...seo} />
      <FeaturePanel eyebrow={type} title={title} text={description} items={items} />
      <ContactSection />
    </>
  );
}

export function ServicesLanding() {
  return <><SEOHead {...pageSeo('Services', 'Premium planning, catering, decor and production services.')} /><ServicesSection /><FeaturePanel eyebrow="Events" title="Events we manage" text="From intimate family functions to large corporate gatherings." items={EVENT_TYPES.map((title) => ({ title, text: 'Custom planning, decor, food and coordination for ' + title + '.', icon: 'Sparkles' }))} /><ContactSection /></>;
}

export function PackagesLanding() {
  return <><SEOHead {...pageSeo('Packages', 'Silver, Gold and Diamond packages for event planning and catering.')} /><PackageCircles /><FeaturePanel eyebrow="Package Logic" title="Transparent inclusions" text="Packages are priced by base scope, guest count, event days and add-ons." items={PACKAGES.map((pkg) => ({ title: pkg.name, text: pkg.includes.join(', '), icon: 'Gem' }))} /></>;
}

export function TestimonialsLanding() {
  return <><SEOHead {...pageSeo('Testimonials', 'Reviews from families and corporate clients.')} /><TestimonialsSection /></>;
}

export function FAQLanding() {
  return <><SEOHead {...pageSeo('FAQ', 'Answers to common event planning questions.', '/faq')} schema={faqSchema(FAQS)} /><FAQSection /></>;
}
`);

const simplePublicPages = {
  AboutPage: ['About Adithya Events', 'A premium event management and catering company rooted in Vuyyuru.', 'why'],
  WeddingPage: ['Wedding Planning', 'Royal mandaps, Telugu rituals, catering and guest hospitality.', 'services'],
  CateringPage: ['Catering Services', 'Authentic Telugu menus, live counters and professional service staff.', 'services'],
  BirthdayPage: ['Birthday Events', 'Theme decor, cake tables, entertainment and joyful food counters.', 'services'],
  CorporatePage: ['Corporate Events', 'Launches, conferences, team events and brand-ready production.', 'services'],
  EngagementPage: ['Engagement Events', 'Elegant ring ceremony decor, photography and family dining.', 'services'],
  BlogPage: ['Planning Journal', 'Event planning ideas, catering tips and celebration checklists.', 'blog'],
  PrivacyPage: ['Privacy Policy', 'How Adithya Event Management handles inquiries, bookings and customer data.', 'why'],
  TermsPage: ['Terms and Conditions', 'Booking, payment, cancellation and service terms for event clients.', 'why']
};

Object.entries(simplePublicPages).forEach(([name, cfg]) => {
  write('src/pages/public/' + name + '.jsx', `import { SimplePage } from './SectionPage';

export default function ${name}() {
  return <SimplePage title="${cfg[0]}" description="${cfg[1]}" type="${cfg[2]}" />;
}
`);
});

write('src/pages/public/ServicesPage.jsx', `import { ServicesLanding } from './SectionPage';
export default function ServicesPage() { return <ServicesLanding />; }
`);
write('src/pages/public/PackagesPage.jsx', `import { PackagesLanding } from './SectionPage';
export default function PackagesPage() { return <PackagesLanding />; }
`);
write('src/pages/public/TestimonialsPage.jsx', `import { TestimonialsLanding } from './SectionPage';
export default function TestimonialsPage() { return <TestimonialsLanding />; }
`);
write('src/pages/public/FAQPage.jsx', `import { FAQLanding } from './SectionPage';
export default function FAQPage() { return <FAQLanding />; }
`);

write('src/pages/public/GalleryPage.jsx', `import SEOHead from '../../components/common/SEOHead';
import GalleryGrid from '../../components/gallery/GalleryGrid';
import DroneFootage from '../../components/gallery/DroneFootage';
import { pageSeo } from '../../utils/seoHelpers';

export default function GalleryPage() {
  return <><SEOHead {...pageSeo('Gallery', 'Event decor, catering and celebration gallery.')} /><section className="page-hero"><h1>Gallery</h1><p>Explore event styles and upload real assets through admin.</p></section><GalleryGrid /><DroneFootage /></>;
}
`);

write('src/pages/public/BookingPage.jsx', `import SEOHead from '../../components/common/SEOHead';
import BookingForm from '../../components/booking/BookingForm';
import { pageSeo } from '../../utils/seoHelpers';

export default function BookingPage() {
  return <><SEOHead {...pageSeo('Book an Event', 'Start a premium event booking request.')} /><section className="page-hero"><h1>Book an Event</h1><p>Five focused steps from package choice to confirmation.</p></section><BookingForm /></>;
}
`);

write('src/pages/public/QuotePage.jsx', `import SEOHead from '../../components/common/SEOHead';
import QuoteCalculator from '../../components/booking/QuoteCalculator';
import { pageSeo } from '../../utils/seoHelpers';

export default function QuotePage() {
  return <><SEOHead {...pageSeo('Quote Calculator', 'Estimate your event package and download a quote PDF.')} /><section className="page-hero"><h1>Quote Calculator</h1><p>Live pricing for packages, guests, days and add-ons.</p></section><QuoteCalculator /></>;
}
`);

write('src/pages/public/TrackBookingPage.jsx', `import SEOHead from '../../components/common/SEOHead';
import BookingTracker from '../../components/booking/BookingTracker';
import { pageSeo } from '../../utils/seoHelpers';

export default function TrackBookingPage() {
  return <><SEOHead {...pageSeo('Track Booking', 'Track booking status and balances.')} /><section className="page-hero"><h1>Track Booking</h1><p>Enter your booking reference to check current status.</p></section><BookingTracker /></>;
}
`);

write('src/pages/public/ContactPage.jsx', `import SEOHead from '../../components/common/SEOHead';
import ContactSection from '../../components/home/ContactSection';
import AIChatbot from '../../components/chat/AIChatbot';
import { pageSeo } from '../../utils/seoHelpers';

export default function ContactPage() {
  return <><SEOHead {...pageSeo('Contact', 'Contact Adithya Event Management in Vuyyuru.')} /><section className="page-hero"><h1>Contact</h1><p>Call, WhatsApp or send an inquiry to plan your event.</p></section><ContactSection /><AIChatbot /></>;
}
`);

write('src/pages/public/ReceiptPage.jsx', `import SEOHead from '../../components/common/SEOHead';
import PaymentReceipt from '../../components/payment/PaymentReceipt';
import PaymentHistory from '../../components/payment/PaymentHistory';
import BalanceTracker from '../../components/payment/BalanceTracker';
import { pageSeo } from '../../utils/seoHelpers';

export default function ReceiptPage() {
  return <><SEOHead {...pageSeo('Receipt', 'Download payment receipts.')} /><section className="page-hero"><h1>Receipt</h1><p>Receipt download and payment history view.</p></section><PaymentReceipt payment={{ amount: 0, status: 'pending' }} booking={{}} /><BalanceTracker total={100000} paid={25000} /><PaymentHistory /></>;
}
`);

write('src/pages/public/BlogPostPage.jsx', `import { useParams } from 'react-router-dom';
import SEOHead from '../../components/common/SEOHead';
import { BLOG_POSTS } from '../../utils/constants';
import { pageSeo } from '../../utils/seoHelpers';

export default function BlogPostPage() {
  const { slug } = useParams();
  const post = BLOG_POSTS.find((item) => item.slug === slug) || BLOG_POSTS[0];
  return <><SEOHead {...pageSeo(post.title, post.excerpt, '/blog/' + post.slug)} /><article className="article-page"><span className="eyebrow">{post.date}</span><h1>{post.title}</h1><p>{post.excerpt}</p><p>Use this checklist as a starting point, then customize the package, menu and decor around your venue, guests and family priorities.</p></article></>;
}
`);

write('src/pages/public/NotFoundPage.jsx', `import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';

export default function NotFoundPage() {
  return (
    <section className="not-found">
      <div className="crown-mark">AE</div>
      <h1>Oops! Page Not Found</h1>
      <p>The celebration you are looking for does not exist here.</p>
      <div className="center-actions"><Link to="/" className="btn btn-outline"><span>Back to Home</span></Link><Button onClick={() => { window.location.href = '/book'; }}>Book an Event</Button></div>
    </section>
  );
}
`);

write('src/pages/admin/AdminLoginPage.jsx', `import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import useAuth from '../../hooks/useAuth';

export default function AdminLoginPage() {
  const [form, setForm] = useState({ email: '', password: '', remember: true });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, resetPassword } = useAuth();
  const navigate = useNavigate();
  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(form.email, form.password);
      navigate('/admin');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }
  return (
    <section className="admin-login">
      <form onSubmit={submit} className="login-card">
        <div className="brand-mark large"><span>AE</span><strong>Adithya Admin</strong></div>
        <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <Input label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <label className="check-row"><input type="checkbox" checked={form.remember} onChange={(e) => setForm({ ...form, remember: e.target.checked })} />Remember me</label>
        {error && <p className="field-error">{error}</p>}
        <Button loading={loading}>Login</Button>
        <button type="button" className="link-button" onClick={() => resetPassword(form.email)}>Forgot password</button>
      </form>
    </section>
  );
}
`);

write('src/pages/admin/AdminDashboardPage.jsx', `import DashboardCards from '../../components/admin/DashboardCards';
import RevenueCharts from '../../components/admin/RevenueCharts';
import useBookings from '../../hooks/useBookings';
import usePayments from '../../hooks/usePayments';

export default function AdminDashboardPage() {
  const { data: bookings } = useBookings();
  const { data: payments } = usePayments();
  return <section className="admin-screen"><div className="admin-heading"><div><span className="eyebrow">Overview</span><h1>Dashboard</h1></div></div><DashboardCards bookings={bookings} payments={payments} /><RevenueCharts payments={payments} /></section>;
}
`);

const adminPages = {
  AdminBookingsPage: 'BookingTable',
  AdminCustomersPage: 'CustomerTable',
  AdminPaymentsPage: 'PaymentTable',
  AdminExpensesPage: 'ExpenseTable',
  AdminStaffPage: 'StaffTable',
  AdminGalleryPage: 'GalleryManager',
  AdminServicesPage: 'ServiceManager',
  AdminPackagesPage: 'PackageManager',
  AdminTestimonialsPage: 'TestimonialManager',
  AdminBlogPage: 'BlogManager',
  AdminFAQPage: 'FAQManager',
  AdminCouponsPage: 'CouponManager',
  AdminLeadsPage: 'LeadManager',
  AdminNotificationsPage: 'NotificationManager',
  AdminSEOPage: 'SEOManager',
  AdminSiteConfigPage: 'SiteConfigManager',
  AdminFestivalBannersPage: 'FestivalBannerManager',
  AdminBrochuresPage: 'BrochureManager',
  AdminReferralsPage: 'ReferralManager',
  AdminActivityPage: 'ActivityLog',
  AdminBackupPage: 'BackupManager',
  AdminSettingsPage: 'SiteConfigManager',
  AdminAnalyticsPage: 'RevenueCharts'
};

Object.entries(adminPages).forEach(([page, component]) => {
  const importLine = component === 'RevenueCharts'
    ? `import RevenueCharts from '../../components/admin/RevenueCharts';\nimport usePayments from '../../hooks/usePayments';`
    : `import ${component} from '../../components/admin/${component}';`;
  const body = component === 'RevenueCharts'
    ? `const { data } = usePayments();\n  return <section className="admin-screen"><div className="admin-heading"><div><span className="eyebrow">Admin</span><h1>Analytics</h1></div></div><RevenueCharts payments={data} /></section>;`
    : `return <${component} />;`;
  write('src/pages/admin/' + page + '.jsx', `${importLine}

export default function ${page}() {
  ${body}
}
`);
});

write('src/AppRoutes.jsx', `import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Spinner from './components/common/Spinner';
import AdminLayout from './components/admin/AdminLayout';

const HomePage = lazy(() => import('./pages/public/HomePage'));
const AboutPage = lazy(() => import('./pages/public/AboutPage'));
const ServicesPage = lazy(() => import('./pages/public/ServicesPage'));
const WeddingPage = lazy(() => import('./pages/public/WeddingPage'));
const CateringPage = lazy(() => import('./pages/public/CateringPage'));
const BirthdayPage = lazy(() => import('./pages/public/BirthdayPage'));
const CorporatePage = lazy(() => import('./pages/public/CorporatePage'));
const EngagementPage = lazy(() => import('./pages/public/EngagementPage'));
const GalleryPage = lazy(() => import('./pages/public/GalleryPage'));
const PackagesPage = lazy(() => import('./pages/public/PackagesPage'));
const TestimonialsPage = lazy(() => import('./pages/public/TestimonialsPage'));
const BlogPage = lazy(() => import('./pages/public/BlogPage'));
const BlogPostPage = lazy(() => import('./pages/public/BlogPostPage'));
const ContactPage = lazy(() => import('./pages/public/ContactPage'));
const BookingPage = lazy(() => import('./pages/public/BookingPage'));
const QuotePage = lazy(() => import('./pages/public/QuotePage'));
const ReceiptPage = lazy(() => import('./pages/public/ReceiptPage'));
const TrackBookingPage = lazy(() => import('./pages/public/TrackBookingPage'));
const FAQPage = lazy(() => import('./pages/public/FAQPage'));
const PrivacyPage = lazy(() => import('./pages/public/PrivacyPage'));
const TermsPage = lazy(() => import('./pages/public/TermsPage'));
const NotFoundPage = lazy(() => import('./pages/public/NotFoundPage'));
const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage'));
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage'));
const AdminBookingsPage = lazy(() => import('./pages/admin/AdminBookingsPage'));
const AdminCustomersPage = lazy(() => import('./pages/admin/AdminCustomersPage'));
const AdminPaymentsPage = lazy(() => import('./pages/admin/AdminPaymentsPage'));
const AdminExpensesPage = lazy(() => import('./pages/admin/AdminExpensesPage'));
const AdminStaffPage = lazy(() => import('./pages/admin/AdminStaffPage'));
const AdminGalleryPage = lazy(() => import('./pages/admin/AdminGalleryPage'));
const AdminServicesPage = lazy(() => import('./pages/admin/AdminServicesPage'));
const AdminPackagesPage = lazy(() => import('./pages/admin/AdminPackagesPage'));
const AdminTestimonialsPage = lazy(() => import('./pages/admin/AdminTestimonialsPage'));
const AdminBlogPage = lazy(() => import('./pages/admin/AdminBlogPage'));
const AdminFAQPage = lazy(() => import('./pages/admin/AdminFAQPage'));
const AdminCouponsPage = lazy(() => import('./pages/admin/AdminCouponsPage'));
const AdminLeadsPage = lazy(() => import('./pages/admin/AdminLeadsPage'));
const AdminNotificationsPage = lazy(() => import('./pages/admin/AdminNotificationsPage'));
const AdminSEOPage = lazy(() => import('./pages/admin/AdminSEOPage'));
const AdminSiteConfigPage = lazy(() => import('./pages/admin/AdminSiteConfigPage'));
const AdminFestivalBannersPage = lazy(() => import('./pages/admin/AdminFestivalBannersPage'));
const AdminBrochuresPage = lazy(() => import('./pages/admin/AdminBrochuresPage'));
const AdminReferralsPage = lazy(() => import('./pages/admin/AdminReferralsPage'));
const AdminAnalyticsPage = lazy(() => import('./pages/admin/AdminAnalyticsPage'));
const AdminActivityPage = lazy(() => import('./pages/admin/AdminActivityPage'));
const AdminBackupPage = lazy(() => import('./pages/admin/AdminBackupPage'));
const AdminSettingsPage = lazy(() => import('./pages/admin/AdminSettingsPage'));

export default function AppRoutes() {
  return (
    <Suspense fallback={<Spinner label="Loading page" />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/wedding" element={<WeddingPage />} />
        <Route path="/catering" element={<CateringPage />} />
        <Route path="/birthday" element={<BirthdayPage />} />
        <Route path="/corporate" element={<CorporatePage />} />
        <Route path="/engagement" element={<EngagementPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/packages" element={<PackagesPage />} />
        <Route path="/testimonials" element={<TestimonialsPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/book" element={<BookingPage />} />
        <Route path="/quote" element={<QuotePage />} />
        <Route path="/receipt" element={<ReceiptPage />} />
        <Route path="/track" element={<TrackBookingPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="bookings" element={<AdminBookingsPage />} />
          <Route path="customers" element={<AdminCustomersPage />} />
          <Route path="payments" element={<AdminPaymentsPage />} />
          <Route path="expenses" element={<AdminExpensesPage />} />
          <Route path="staff" element={<AdminStaffPage />} />
          <Route path="gallery" element={<AdminGalleryPage />} />
          <Route path="services" element={<AdminServicesPage />} />
          <Route path="packages" element={<AdminPackagesPage />} />
          <Route path="testimonials" element={<AdminTestimonialsPage />} />
          <Route path="blog" element={<AdminBlogPage />} />
          <Route path="faq" element={<AdminFAQPage />} />
          <Route path="coupons" element={<AdminCouponsPage />} />
          <Route path="leads" element={<AdminLeadsPage />} />
          <Route path="notifications" element={<AdminNotificationsPage />} />
          <Route path="seo" element={<AdminSEOPage />} />
          <Route path="site-config" element={<AdminSiteConfigPage />} />
          <Route path="festival-banners" element={<AdminFestivalBannersPage />} />
          <Route path="brochures" element={<AdminBrochuresPage />} />
          <Route path="referrals" element={<AdminReferralsPage />} />
          <Route path="analytics" element={<AdminAnalyticsPage />} />
          <Route path="activity" element={<AdminActivityPage />} />
          <Route path="backup" element={<AdminBackupPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
          <Route path="*" element={<Navigate to="/admin" />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
`);

write('src/App.jsx', `import { BrowserRouter, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import AppRoutes from './AppRoutes';
import { AdminProvider } from './context/AdminContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { NotificationProvider } from './context/NotificationContext';
import { ThemeProvider } from './context/ThemeContext';
import FloatingButtons from './components/common/FloatingButtons';
import Footer from './components/common/Footer';
import LoadingScreen from './components/common/LoadingScreen';
import MobileNavbar from './components/common/MobileNavbar';
import Navbar from './components/common/Navbar';
import ScrollToTop from './components/common/ScrollToTop';
import Toast from './components/common/Toast';

function Chrome() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  return (
    <>
      <ScrollToTop />
      {!isAdmin && <Navbar />}
      <AppRoutes />
      {!isAdmin && <FloatingButtons />}
      {!isAdmin && <MobileNavbar />}
      {!isAdmin && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <NotificationProvider>
          <AuthProvider>
            <AdminProvider>
              <CartProvider>
                <BrowserRouter>
                  <LoadingScreen />
                  <Chrome />
                  <Toast />
                </BrowserRouter>
              </CartProvider>
            </AdminProvider>
          </AuthProvider>
        </NotificationProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}
`);

write('src/index.js', `import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/variables.css';
import './styles/typography.css';
import './styles/animations.css';
import './styles/glassmorphism.css';
import './styles/components.css';
import './styles/admin.css';
import './styles/globals.css';
import App from './App.jsx';
import reportWebVitals from './reportWebVitals';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

serviceWorkerRegistration.register();
reportWebVitals();
`);

write('src/styles/variables.css', `:root {
  --gold: #D4AF37;
  --deep-gold: #B8860B;
  --rich-gold: #FFD700;
  --champagne: #F7E7CE;
  --burgundy: #722F37;
  --ivory: #FFFFF0;
  --charcoal: #1A1A1A;
  --warm-white: #FDF8F0;
  --rose-gold: #E8B4A0;
  --emerald: #2ECC71;
  --danger: #E74C3C;
  --ink: #241F1A;
  --muted: #756C62;
  --line: rgba(36, 31, 26, 0.12);
  --surface: rgba(255, 255, 255, 0.78);
  --shadow-gold: rgba(212, 175, 55, 0.3);
  --glass-bg: rgba(255, 255, 255, 0.08);
  --glass-border: rgba(212, 175, 55, 0.2);
}

[data-theme='dark'] {
  --warm-white: #14110F;
  --ivory: #1F1A16;
  --ink: #FFF8E8;
  --muted: #C9BDA9;
  --line: rgba(247, 231, 206, 0.15);
  --surface: rgba(26, 26, 26, 0.82);
}
`);

write('src/styles/typography.css', `body {
  font-family: 'Poppins', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  color: var(--ink);
}
h1, h2, h3, h4 {
  font-family: 'Playfair Display', Georgia, serif;
  letter-spacing: 0;
  margin: 0;
}
h1 { font-size: clamp(2.6rem, 7vw, 6.6rem); line-height: .94; }
h2 { font-size: clamp(2rem, 4vw, 3.7rem); line-height: 1; }
h3 { font-size: 1.35rem; }
p { line-height: 1.75; color: var(--muted); }
.script { font-family: 'Great Vibes', cursive; font-size: clamp(2rem, 5vw, 4rem); color: var(--rich-gold); }
.eyebrow { text-transform: uppercase; font-weight: 700; letter-spacing: .12em; color: var(--deep-gold); font-size: .76rem; }
`);

write('src/styles/animations.css', `@keyframes spin { to { transform: rotate(360deg); } }
@keyframes shimmer { 0% { background-position: 0% 50%; } 100% { background-position: 200% 50%; } }
@keyframes rise { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
.spin { animation: spin 1s linear infinite; }
`);

write('src/styles/glassmorphism.css', `.glass-card,
.card,
.form-panel,
.booking-card,
.login-card,
.modal,
.chart-panel,
.receipt-card,
.status-card {
  background: var(--surface);
  backdrop-filter: blur(18px);
  border: 1px solid var(--line);
  border-radius: 8px;
  box-shadow: 0 18px 44px rgba(0, 0, 0, 0.08);
}
.gold-gradient-text {
  background: linear-gradient(135deg, var(--gold), var(--rich-gold), var(--deep-gold));
  -webkit-background-clip: text;
  color: transparent;
}
`);

write('src/styles/components.css', `* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body { margin: 0; background: var(--warm-white); min-width: 320px; }
a { color: inherit; text-decoration: none; }
button, input, select, textarea { font: inherit; }
button { cursor: pointer; }
.site-nav { position: sticky; top: 0; z-index: 30; display: flex; align-items: center; justify-content: space-between; gap: 20px; padding: 14px clamp(16px, 4vw, 56px); background: color-mix(in srgb, var(--warm-white) 86%, transparent); backdrop-filter: blur(18px); border-bottom: 1px solid var(--line); }
.brand-mark { display: inline-flex; align-items: center; gap: 10px; font-weight: 700; }
.brand-mark span, .admin-brand span, .crown-mark { width: 42px; height: 42px; display: inline-grid; place-items: center; border-radius: 50%; background: radial-gradient(circle, var(--rich-gold), var(--deep-gold)); color: var(--charcoal); font-family: 'Playfair Display', serif; font-weight: 800; }
.brand-mark.large span { width: 58px; height: 58px; }
.site-nav nav { display: flex; gap: 18px; }
.site-nav nav a { font-size: .92rem; color: var(--muted); }
.site-nav nav a.active { color: var(--deep-gold); font-weight: 700; }
.nav-actions, .center-actions, .modal-actions, .tab-row, .table-actions { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }
.nav-menu { display: none; }
.btn { min-height: 44px; border: 0; border-radius: 8px; padding: 0 18px; display: inline-flex; align-items: center; justify-content: center; gap: 8px; font-weight: 700; transition: transform .2s ease, box-shadow .2s ease, background .2s ease; }
.btn:hover { transform: translateY(-1px); }
.btn-primary { background: linear-gradient(135deg, var(--gold), var(--rich-gold)); color: var(--charcoal); box-shadow: 0 12px 24px var(--shadow-gold); }
.btn-outline { border: 1px solid var(--gold); color: var(--ink); background: transparent; }
.btn-ghost { background: transparent; color: var(--ink); border: 1px solid var(--line); }
.btn-danger { background: var(--danger); color: white; }
.hero-section { min-height: 92vh; position: relative; display: grid; place-items: center; overflow: hidden; padding: 110px 18px 30px; background: linear-gradient(135deg, #1A1A1A 0%, #392022 48%, #1A1A1A 100%); color: var(--ivory); }
.hero-pattern { position: absolute; inset: 0; background-image: radial-gradient(circle at 20% 20%, rgba(212,175,55,.28), transparent 28%), linear-gradient(45deg, rgba(255,255,255,.06) 25%, transparent 25%), linear-gradient(-45deg, rgba(255,255,255,.04) 25%, transparent 25%); background-size: auto, 42px 42px, 42px 42px; opacity: .8; }
.hero-content { position: relative; max-width: 980px; text-align: center; }
.hero-content p { color: rgba(255,255,240,.82); font-size: 1.08rem; max-width: 760px; margin: 20px auto; }
.hero-actions { display: flex; justify-content: center; flex-wrap: wrap; gap: 12px; margin-top: 28px; }
.hero-location { display: inline-flex; gap: 8px; align-items: center; }
.stats-strip { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0; width: min(100%, 980px); margin: 38px auto 0; border: 1px solid rgba(212,175,55,.28); border-radius: 8px; overflow: hidden; background: rgba(0,0,0,.24); }
.stats-strip div { padding: 20px; text-align: center; border-right: 1px solid rgba(212,175,55,.24); }
.stats-strip div:last-child { border-right: 0; }
.stats-strip strong { display: block; color: var(--rich-gold); font-size: clamp(1.4rem, 3vw, 2.2rem); }
.stats-strip span { color: rgba(255,255,240,.78); font-size: .85rem; }
.section-band { padding: clamp(58px, 8vw, 110px) 18px; }
.section-dark { background: var(--charcoal); color: var(--ivory); }
.section-dark p { color: rgba(255,255,240,.72); }
.section-inner { width: min(1160px, 100%); margin: 0 auto; }
.section-inner.narrow { width: min(820px, 100%); }
.section-heading { max-width: 760px; margin-bottom: 34px; }
.section-heading p { font-size: 1.02rem; }
.feature-grid { display: grid; grid-template-columns: repeat(var(--cols, 3), minmax(0, 1fr)); gap: 18px; }
.feature-card { padding: 24px; min-height: 220px; display: flex; flex-direction: column; gap: 12px; }
.feature-card svg { color: var(--deep-gold); }
.package-circles { display: grid; grid-template-columns: repeat(3, minmax(180px, 1fr)); gap: 24px; }
.package-circle { aspect-ratio: 1; border-radius: 50%; border: 2px solid var(--accent); background: radial-gradient(circle at 35% 28%, rgba(255,255,255,.9), var(--champagne)); color: var(--charcoal); display: grid; place-items: center; padding: 28px; text-align: center; box-shadow: 0 18px 38px rgba(0,0,0,.12); }
.package-circle span { font-family: 'Great Vibes', cursive; font-size: 2.5rem; }
.gallery-preview, .social-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
.gallery-preview button { border: 0; background: transparent; padding: 0; }
.lazy-visual { min-height: 230px; border-radius: 8px; display: grid; place-items: end start; padding: 18px; color: white; font-weight: 700; overflow: hidden; position: relative; }
.lazy-visual.large { min-height: 430px; }
.visual-gold { background: linear-gradient(135deg, #6E4F12, #D4AF37, #FFF2A3); }
.visual-emerald { background: linear-gradient(135deg, #0D3B2E, #2ECC71, #F7E7CE); }
.visual-rose { background: linear-gradient(135deg, #722F37, #E8B4A0, #FDF8F0); }
.visual-burgundy { background: linear-gradient(135deg, #1A1A1A, #722F37, #D4AF37); }
.visual-champagne { background: linear-gradient(135deg, #B8860B, #F7E7CE, #FFFFFF); color: var(--charcoal); }
.visual-charcoal { background: linear-gradient(135deg, #1A1A1A, #48413A, #D4AF37); }
.split-layout { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(24px, 6vw, 72px); align-items: center; }
.timeline p { display: grid; grid-template-columns: 80px 1fr; gap: 12px; padding: 16px 0; border-bottom: 1px solid var(--line); }
.festival-banner, .brochure-band, .countdown-band, .parallax-band, .newsletter-band { padding: 36px clamp(18px, 5vw, 70px); display: flex; justify-content: space-between; gap: 20px; align-items: center; background: var(--charcoal); color: var(--ivory); }
.festival-banner p, .brochure-band p, .countdown-band p { color: rgba(255,255,240,.75); }
.parallax-band { min-height: 310px; flex-direction: column; justify-content: center; text-align: center; background: linear-gradient(rgba(26,26,26,.86), rgba(26,26,26,.88)), repeating-linear-gradient(45deg, #2A2017 0 14px, #1A1A1A 14px 28px); background-attachment: fixed; }
.parallax-band div { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; }
.parallax-band span, .badge { border: 1px solid var(--glass-border); border-radius: 999px; padding: 7px 12px; }
.faq-list { display: grid; gap: 10px; }
.faq-list button { text-align: left; padding: 18px; border-radius: 8px; border: 1px solid var(--line); background: var(--surface); color: var(--ink); }
.form-panel, .booking-panel, .quote-calculator, .tracker-panel, .chatbot, .receipt-card, .balance-tracker { width: min(980px, calc(100% - 32px)); margin: 30px auto; padding: 24px; }
.field { display: grid; gap: 7px; }
.field span { font-weight: 700; font-size: .86rem; }
.field input, .field select, .field textarea, .search-bar input, .chat-input input, .admin-topbar input { min-height: 44px; border-radius: 8px; border: 1px solid var(--line); padding: 10px 12px; background: var(--surface); color: var(--ink); width: 100%; }
.field textarea { min-height: 110px; resize: vertical; }
.field-error { color: var(--danger); }
.form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
.wide { grid-column: 1 / -1; }
.addon-list { display: flex; flex-wrap: wrap; gap: 10px; margin: 16px 0; }
.addon-list label, .check-row { min-height: 40px; border: 1px solid var(--line); border-radius: 8px; padding: 8px 12px; display: inline-flex; align-items: center; gap: 8px; }
.booking-steps { display: grid; grid-template-columns: repeat(5, 1fr); list-style: none; padding: 0; margin: 0 0 20px; gap: 8px; }
.booking-steps li { display: flex; align-items: center; gap: 8px; color: var(--muted); }
.booking-steps span { width: 30px; height: 30px; display: grid; place-items: center; border-radius: 50%; border: 1px solid var(--line); }
.booking-steps .active span { background: var(--gold); color: var(--charcoal); }
.selector-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
.selector-grid button { min-height: 160px; border: 1px solid var(--line); border-radius: 8px; background: var(--surface); color: var(--ink); display: grid; gap: 8px; padding: 18px; text-align: left; }
.selector-grid .selected { border-color: var(--gold); box-shadow: 0 0 0 3px rgba(212,175,55,.18); }
.quote-lines p { display: flex; justify-content: space-between; border-bottom: 1px solid var(--line); padding: 10px 0; margin: 0; }
.quote-lines .total strong { font-size: 1.5rem; color: var(--deep-gold); }
.success-panel, .not-found, .page-hero, .article-page { padding: clamp(80px, 12vw, 140px) 18px 60px; text-align: center; width: min(960px, 100%); margin: 0 auto; }
.success-panel svg { color: var(--emerald); }
.filter-row { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 20px; }
.filter-row button { border: 1px solid var(--line); background: var(--surface); border-radius: 999px; padding: 9px 14px; color: var(--ink); }
.filter-row .active { background: var(--gold); color: var(--charcoal); }
.video-frame { width: min(860px, 100%); aspect-ratio: 16 / 9; margin: 0 auto; background: #080808; border-radius: 8px; overflow: hidden; display: grid; place-items: center; }
.video-frame button { width: 100%; height: 100%; color: var(--gold); background: radial-gradient(circle, rgba(212,175,55,.16), rgba(0,0,0,.9)); border: 0; display: grid; place-items: center; }
.review-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.review-card { border: 1px solid var(--glass-border); border-radius: 8px; padding: 20px; }
.stars { color: var(--gold); display: inline-flex; gap: 2px; }
.coupon-banner { position: sticky; top: 72px; z-index: 24; display: flex; justify-content: space-between; gap: 12px; align-items: center; padding: 10px 18px; background: linear-gradient(135deg, var(--burgundy), var(--deep-gold)); color: white; }
.modal-backdrop { position: fixed; inset: 0; z-index: 60; display: grid; place-items: center; background: rgba(0,0,0,.58); padding: 18px; }
.modal { width: min(720px, 100%); max-height: 90vh; overflow: auto; padding: 24px; }
.modal-head { display: flex; justify-content: space-between; gap: 12px; align-items: center; }
.table-wrap { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; }
th, td { text-align: left; padding: 12px; border-bottom: 1px solid var(--line); }
.search-bar, .inline-form, .chat-input, .admin-topbar label { display: flex; align-items: center; gap: 8px; }
.empty-state { padding: 32px; text-align: center; border: 1px dashed var(--line); border-radius: 8px; }
.floating-actions { position: fixed; right: 18px; bottom: 92px; z-index: 35; display: grid; gap: 10px; }
.floating-actions a { width: 48px; height: 48px; border-radius: 50%; background: var(--gold); color: var(--charcoal); display: grid; place-items: center; box-shadow: 0 12px 28px var(--shadow-gold); }
.mobile-nav { display: none; }
.newsletter-form { display: grid; grid-template-columns: 1fr 1fr auto; gap: 10px; align-items: end; }
.site-footer { background: #101010; color: var(--ivory); padding-bottom: 40px; }
.footer-grid { display: grid; grid-template-columns: 1.5fr 1fr 1.2fr; gap: 30px; padding: 46px clamp(18px, 5vw, 70px); }
.footer-grid a, .footer-grid p { display: flex; gap: 8px; color: rgba(255,255,240,.75); }
.loading-screen { position: fixed; inset: 0; z-index: 100; background: var(--charcoal); color: var(--gold); display: grid; place-items: center; text-align: center; }
.mandala { width: 96px; height: 96px; border: 2px solid var(--gold); border-radius: 50%; position: relative; animation: spin 4s linear infinite; }
.mandala span { position: absolute; inset: 14px; border: 1px solid var(--rich-gold); border-radius: 50%; }
.mandala span:nth-child(2) { inset: 28px; }
.mandala span:nth-child(3) { inset: 42px; }
.countdown { display: flex; gap: 10px; }
.countdown span { min-width: 70px; min-height: 58px; border: 1px solid var(--glass-border); border-radius: 8px; display: grid; place-items: center; color: var(--gold); font-weight: 800; }
.progress { height: 10px; background: rgba(0,0,0,.12); border-radius: 999px; overflow: hidden; }
.progress span { display: block; height: 100%; background: linear-gradient(90deg, var(--gold), var(--emerald)); }
.balance-tracker { display: grid; gap: 14px; }
.chat-history { height: 360px; overflow: auto; display: grid; align-content: start; gap: 10px; padding: 12px; border: 1px solid var(--line); border-radius: 8px; }
.chat-message { max-width: 78%; padding: 10px 14px; border-radius: 8px; }
.chat-message.user { justify-self: end; background: var(--gold); color: var(--charcoal); }
.chat-message.assistant { background: var(--surface); border: 1px solid var(--line); }
.file-upload { min-height: 120px; border: 1px dashed var(--gold); border-radius: 8px; display: grid; place-items: center; gap: 8px; position: relative; }
.file-upload input { position: absolute; inset: 0; opacity: 0; }
@media (max-width: 860px) {
  .site-nav nav, .nav-actions .btn:not(.nav-menu) { display: none; }
  .nav-menu { display: inline-flex; }
  .hero-section { min-height: 86vh; padding-bottom: 88px; }
  .stats-strip, .feature-grid, .package-circles, .gallery-preview, .social-grid, .split-layout, .review-row, .footer-grid, .form-grid, .selector-grid { grid-template-columns: 1fr; }
  .stats-strip div { border-right: 0; border-bottom: 1px solid rgba(212,175,55,.24); }
  .festival-banner, .brochure-band, .newsletter-band, .countdown-band { flex-direction: column; align-items: flex-start; }
  .newsletter-form { grid-template-columns: 1fr; width: 100%; }
  .booking-steps { grid-template-columns: 1fr; }
  .mobile-nav { position: fixed; z-index: 40; left: 10px; right: 10px; bottom: 10px; display: grid; grid-template-columns: repeat(5, 1fr); background: var(--surface); border: 1px solid var(--line); border-radius: 8px; backdrop-filter: blur(18px); box-shadow: 0 12px 34px rgba(0,0,0,.16); }
  .mobile-nav a { min-height: 58px; display: grid; place-items: center; gap: 2px; font-size: .72rem; color: var(--muted); }
  .mobile-nav a.active, .mobile-primary { color: var(--deep-gold); font-weight: 800; }
  .site-footer { padding-bottom: 90px; }
}
@media print {
  .site-nav, .mobile-nav, .floating-actions, .site-footer, .coupon-banner { display: none !important; }
  body { background: white; }
}
`);

write('src/styles/admin.css', `.admin-shell { min-height: 100vh; display: grid; grid-template-columns: 270px 1fr; background: #F6F2EA; }
.admin-sidebar { background: #111; color: white; padding: 18px; }
.admin-brand { display: flex; align-items: center; gap: 10px; margin-bottom: 28px; }
.admin-sidebar nav { display: grid; gap: 6px; }
.admin-sidebar a { display: flex; align-items: center; gap: 10px; min-height: 42px; border-radius: 8px; padding: 0 12px; color: rgba(255,255,255,.72); }
.admin-sidebar a.active { background: rgba(212,175,55,.16); color: var(--gold); }
.admin-main { min-width: 0; }
.admin-topbar { height: 66px; display: flex; align-items: center; justify-content: space-between; gap: 14px; padding: 0 22px; background: white; border-bottom: 1px solid var(--line); }
.admin-topbar > div { display: flex; align-items: center; gap: 10px; }
.admin-screen { padding: 24px; display: grid; gap: 20px; }
.admin-heading { display: flex; justify-content: space-between; align-items: center; gap: 16px; }
.admin-form { display: grid; grid-template-columns: repeat(4, 1fr) auto; align-items: end; gap: 12px; background: white; border: 1px solid var(--line); border-radius: 8px; padding: 16px; }
.dashboard-cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
.dashboard-cards article { background: white; border: 1px solid var(--line); border-radius: 8px; padding: 18px; display: grid; gap: 8px; }
.dashboard-cards svg { color: var(--deep-gold); }
.dashboard-cards strong { font-size: 1.6rem; }
.chart-panel { background: white; padding: 18px; }
.admin-login { min-height: 100vh; display: grid; place-items: center; padding: 18px; background: linear-gradient(135deg, #111, #341E21, #111); }
.login-card { width: min(420px, 100%); padding: 28px; display: grid; gap: 16px; color: var(--ivory); background: rgba(255,255,255,.08); border-color: rgba(212,175,55,.25); }
.link-button { border: 0; color: var(--gold); background: transparent; }
@media (max-width: 980px) {
  .admin-shell { grid-template-columns: 1fr; }
  .admin-sidebar { position: static; }
  .admin-sidebar nav { grid-template-columns: repeat(2, 1fr); }
  .admin-form, .dashboard-cards { grid-template-columns: 1fr; }
  .admin-topbar { height: auto; padding: 12px; flex-direction: column; align-items: stretch; }
}
`);

write('src/styles/globals.css', `.check-list { display: grid; gap: 8px; padding-left: 18px; }
.check-list li::marker { color: var(--gold); }
.page-hero { padding-top: 110px; }
.article-page { text-align: left; }
.receipt-card { display: grid; gap: 10px; }
.gallery-page-grid { width: min(1160px, calc(100% - 32px)); margin: 0 auto 60px; }
.table-actions .btn { min-height: 34px; padding: 0 10px; }
`);

write('functions/package.json', `{
  "name": "adithya-event-functions",
  "version": "1.0.0",
  "private": true,
  "main": "index.js",
  "engines": { "node": "18" },
  "dependencies": {
    "axios": "^1.6.0",
    "crypto": "^1.0.1",
    "firebase-admin": "^12.0.0",
    "firebase-functions": "^4.7.0",
    "razorpay": "^2.9.2"
  }
}`);

write('functions/index.js', `const functions = require('firebase-functions');
const admin = require('firebase-admin');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const axios = require('axios');

admin.initializeApp();
const db = admin.firestore();

exports.generateBookingId = functions.region('asia-south1').firestore
  .document('bookings/{bookingId}')
  .onCreate(async (snap) => {
    const year = new Date().getFullYear();
    const counterRef = db.collection('counters').doc('bookings_' + year);
    const count = await db.runTransaction(async (transaction) => {
      const counter = await transaction.get(counterRef);
      const next = counter.exists ? counter.data().count + 1 : 1;
      transaction.set(counterRef, { count: next }, { merge: true });
      return next;
    });
    const bookingId = 'BK-' + year + '-' + String(count).padStart(4, '0');
    await snap.ref.update({ bookingId });
  });

exports.createRazorpayOrder = functions.region('asia-south1').https.onCall(async (data) => {
  const amount = Number(data.amount || 0);
  if (!amount || amount < 1) {
    throw new functions.https.HttpsError('invalid-argument', 'Invalid amount');
  }
  const razorpay = new Razorpay({
    key_id: functions.config().razorpay.key_id,
    key_secret: functions.config().razorpay.key_secret
  });
  const order = await razorpay.orders.create({
    amount: Math.round(amount * 100),
    currency: data.currency || 'INR',
    receipt: data.bookingId || 'temp_' + Date.now(),
    notes: { bookingId: data.bookingId || '' }
  });
  return { orderId: order.id, amount: order.amount, currency: order.currency, status: order.status };
});

exports.verifyRazorpayPayment = functions.region('asia-south1').https.onCall(async (data) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId, amountPaid } = data;
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !bookingId) {
    throw new functions.https.HttpsError('invalid-argument', 'Missing payment data');
  }
  const expected = crypto.createHmac('sha256', functions.config().razorpay.key_secret)
    .update(razorpay_order_id + '|' + razorpay_payment_id)
    .digest('hex');
  if (expected !== razorpay_signature) {
    throw new functions.https.HttpsError('unauthenticated', 'Payment signature verification failed');
  }
  const bookingRef = db.collection('bookings').doc(bookingId);
  const bookingDoc = await bookingRef.get();
  if (!bookingDoc.exists) throw new functions.https.HttpsError('not-found', 'Booking not found');
  const booking = bookingDoc.data();
  const paid = Number(amountPaid || 0);
  const newAdvancePaid = Number(booking.advancePaid || 0) + paid;
  const balanceDue = Math.max(0, Number(booking.totalAmount || 0) - newAdvancePaid);
  await bookingRef.update({
    bookingStatus: 'confirmed',
    paymentStatus: balanceDue <= 0 ? 'paid' : 'partial',
    advancePaid: newAdvancePaid,
    balanceDue,
    razorpayOrderId: razorpay_order_id,
    razorpayPaymentId: razorpay_payment_id,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    timeline: admin.firestore.FieldValue.arrayUnion({
      action: 'payment_confirmed',
      amount: paid,
      paymentId: razorpay_payment_id,
      timestamp: new Date().toISOString(),
      by: 'razorpay'
    })
  });
  await db.collection('payments').add({
    bookingId,
    customerId: booking.customerId || null,
    amount: paid,
    method: 'razorpay',
    razorpayOrderId: razorpay_order_id,
    razorpayPaymentId: razorpay_payment_id,
    status: 'success',
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  });
  await sendWhatsAppToCustomer(booking.customerPhone, 'Payment confirmed for booking ' + bookingId + '. Amount received: Rs. ' + paid + '. Balance: Rs. ' + balanceDue + '.');
  await sendWhatsAppToAdmin('Payment received. Booking: ' + bookingId + ', amount: Rs. ' + paid + '.');
  return { success: true, paymentStatus: balanceDue <= 0 ? 'paid' : 'partial', bookingStatus: 'confirmed' };
});

exports.onBookingCreated = functions.region('asia-south1').firestore
  .document('bookings/{bookingId}')
  .onCreate(async (snap, context) => {
    const booking = snap.data();
    const bookingId = context.params.bookingId;
    await db.collection('activityLogs').add({
      action: 'booking_created',
      targetId: bookingId,
      metadata: { customerName: booking.customerName, eventType: booking.eventType },
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    await sendWhatsAppToCustomer(booking.customerPhone, 'Booking received. Reference: ' + bookingId + '. We will confirm availability soon.');
    await sendWhatsAppToAdmin('New booking: ' + bookingId + ' from ' + booking.customerName + ' for ' + booking.eventType + '.');
  });

exports.sendEventReminders = functions.region('asia-south1').pubsub
  .schedule('0 9 * * *')
  .timeZone('Asia/Kolkata')
  .onRun(async () => {
    const now = new Date();
    for (const daysAhead of [7, 3, 1, 0]) {
      const target = new Date(now.getTime() + daysAhead * 86400000);
      const start = new Date(target); start.setHours(0, 0, 0, 0);
      const end = new Date(target); end.setHours(23, 59, 59, 999);
      const snapshot = await db.collection('bookings')
        .where('bookingStatus', '==', 'confirmed')
        .where('eventDate', '>=', admin.firestore.Timestamp.fromDate(start))
        .where('eventDate', '<=', admin.firestore.Timestamp.fromDate(end))
        .get();
      for (const doc of snapshot.docs) {
        const booking = doc.data();
        await sendWhatsAppToCustomer(booking.customerPhone, 'Event reminder for ' + booking.eventType + '. Days remaining: ' + daysAhead + '.');
      }
    }
  });

exports.weeklyBackup = functions.region('asia-south1').pubsub
  .schedule('0 2 * * 0')
  .timeZone('Asia/Kolkata')
  .onRun(async () => {
    const collections = ['bookings', 'customers', 'payments', 'expenses', 'staff', 'services', 'packages', 'gallery', 'testimonials', 'faqs', 'coupons', 'blogs'];
    const backup = {};
    for (const name of collections) {
      const snapshot = await db.collection(name).get();
      backup[name] = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    }
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const file = admin.storage().bucket().file('backups/backup_' + timestamp + '.json');
    await file.save(JSON.stringify(backup, null, 2), { contentType: 'application/json' });
  });

async function sendWhatsAppToCustomer(phone, message) {
  if (!phone) return null;
  const apiKey = functions.config().whatsapp && functions.config().whatsapp.api_key;
  if (!apiKey) {
    console.log('WhatsApp customer queue:', phone, message);
    return null;
  }
  return axios.post('https://example-whatsapp-provider.invalid/messages', { phone, message, apiKey }).catch((error) => {
    console.error('WhatsApp customer failed', error.message);
  });
}

async function sendWhatsAppToAdmin(message) {
  const adminPhone = (functions.config().company && functions.config().company.admin_phone) || '919393217676';
  return sendWhatsAppToCustomer(adminPhone, message);
}

module.exports.sendWhatsAppToCustomer = sendWhatsAppToCustomer;
module.exports.sendWhatsAppToAdmin = sendWhatsAppToAdmin;
`);

write('scripts/seedData.cjs', `const admin = require('firebase-admin');
const path = require('path');

admin.initializeApp({
  credential: admin.credential.applicationDefault()
});

const db = admin.firestore();

async function seedData() {
  const services = [
    ['wedding', 'Wedding Planning', 180000],
    ['catering', 'Premium Catering', 450],
    ['birthday', 'Birthday Events', 35000],
    ['corporate', 'Corporate Events', 75000]
  ];
  for (const [id, title, priceFrom] of services) {
    await db.collection('services').doc(id).set({ title, priceFrom, active: true, updatedAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
  }
  await db.collection('siteConfig').doc('brand').set({
    name: 'Adithya Event Management',
    phone: '+91 93932 17676',
    instagram: '@adithya_event_management',
    location: 'Vuyyuru, Andhra Pradesh, India',
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  }, { merge: true });
  console.log('Seed data complete. Add your Firebase admin UID to admins/{uid}.');
}

seedData().catch((error) => {
  console.error(error);
  process.exit(1);
});
`);

write('README.md', `# Adithya Event Management

Premium CRA/PWA implementation for Adithya Event Management, Vuyyuru.

## What is included

- Public website with SEO metadata, local business schema, packages, quote calculator, booking wizard, gallery, reviews, FAQ, chatbot and WhatsApp CTAs.
- Firebase client configuration, real Firestore CRUD hooks/services, Storage upload helper and Analytics event logging.
- Admin dashboard with reusable CRUD management screens for bookings, customers, payments, expenses, staff, gallery, services, packages, content, leads and settings.
- Razorpay order creation and payment verification via Firebase Cloud Functions.
- Firestore and Storage rules, Firebase Hosting config, PWA manifest, service worker registration and seed script.

## Run locally

\`\`\`bash
npm install --legacy-peer-deps
npm start
\`\`\`

## Build

\`\`\`bash
npm run build
\`\`\`

## Firebase deployment

\`\`\`bash
firebase functions:config:set razorpay.key_id="rzp_live_xxxxxxxxxx"
firebase functions:config:set razorpay.key_secret="your_secret"
firebase functions:config:set whatsapp.api_key="provider_key"
firebase functions:config:set company.admin_phone="919393217676"
firebase deploy
\`\`\`

Create an admin user in Firebase Auth, then add a matching document at \`admins/{uid}\` with \`active: true\` and \`role: "superadmin"\`.
`);

console.log('Adithya platform files generated.');
