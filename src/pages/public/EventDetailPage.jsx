// src/pages/public/EventDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase/config';
import PageTransition from '../../components/common/PageTransition';
import SEOHead from '../../components/common/SEOHead';
import Spinner from '../../components/common/Spinner';
import { Phone, MessageSquare, ChevronLeft, ChevronRight, X, Eye, Calendar, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DEFAULT_EVENT_DETAILS = {
  wedding: {
    title: 'Royal Wedding Ceremonies',
    subtitle: 'A Match Made in Heaven',
    desc: 'From traditional Telugu mandapams to extravagant designer stages, we craft weddings that resonate with royalty. Our dedicated crew in Vijayawada manages structural design, fresh floral decor, warm pathway lighting, thematic entrances, and guest pathways. Let us make your special day a celestial memory.',
    inclusions: [
      'Thematic stage design (traditional or modern)',
      'Fresh flower selection & structural mandapams',
      'VIP entrance pathway with custom lighting',
      'Dedicated wedding coordinator & design consultation',
      'Bride & Groom seating thrones and setup accessories'
    ],
    slideshow: [
      'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200',
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1200',
      'https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?q=80&w=1200'
    ]
  },
  catering: {
    title: 'Premium Catering Services',
    subtitle: 'Feast of the Kings',
    desc: 'Indulge your guests in a gastronomic journey with our premium catering. Serving Vijayawada, Vijayawada, and surrounding regions, we provide both traditional Andhra vegetarian delicacies and exquisite royal non-vegetarian spreads. Our service team is fully uniformed, and our hygiene standards are impeccable.',
    inclusions: [
      'Customized multi-cuisine menu options',
      'Uniformed catering and serving staff',
      'High-quality buffet counter layouts and decoration',
      'Fresh ingredients and strictly supervised hygiene',
      'Paan stall, dessert counters, and mineral water systems'
    ],
    slideshow: [
      'https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=1200',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200',
      'https://images.unsplash.com/photo-1495521821757-a1efb6729352?q=80&w=1200'
    ]
  },
  birthday: {
    title: 'Themed Birthday Celebrations',
    subtitle: 'Unbounded Joy & Laughter',
    desc: 'Make your little one\'s birthday an adventure! We create customized theme decors including Jungle, Princess, Cocomelon, and Space. Our complete packages offer 3D backdrops, cartoon mascot entries, popcorn/cotton candy stalls, and professional magic show entertainment.',
    inclusions: [
      '3D theme backdrop & balloon arch setup',
      'Custom cake table & welcome board decor',
      'Fun activities: Magic show, puppet show, or game hosts',
      'Popcorn and cotton candy counters',
      'Cartoon character mascot for child greetings'
    ],
    slideshow: [
      'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=1200',
      'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=1200',
      'https://images.unsplash.com/photo-1464349110291-14558f486acd?q=80&w=1200'
    ]
  },
  engagement: {
    title: 'Engagement & Half-Saree Setups',
    subtitle: 'Beginning of Forever',
    desc: 'Capture the sacred elegance of your engagement, half-saree ceremony, or thread ceremony. We build beautiful, intimate, and modern floral stages and seating areas that reflect deep cultural traditions and look spectacular in photographs.',
    inclusions: [
      'Traditional or modern floral backdrop design',
      'Custom seating for the couple or family members',
      'Aarti and puja accessory arrangements',
      'Pathway lighting and floral accents',
      'Photography-ready lighting configuration'
    ],
    slideshow: [
      'https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?q=80&w=1200',
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1200',
      'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=1200'
    ]
  },
  receptions: {
    title: 'Grand Wedding Receptions',
    subtitle: 'A Night of Elegance',
    desc: 'Host a breathtaking reception with dazzling LED setups, custom dry-ice fog entries, and stunning stage layouts. We focus on creating a modern, high-fashion ambience that makes the couple feel like celebrities.',
    inclusions: [
      'Grand modern LED stage setups',
      'Special couple entry effects (cold pyro, fog)',
      'VIP guest seating lounges',
      'Red carpet pathway and photo booths',
      'Thematic light programming'
    ],
    slideshow: [
      'https://images.unsplash.com/photo-1478147427282-58a87a120781?q=80&w=1200',
      'https://images.unsplash.com/photo-1519225495810-7517c524913e?q=80&w=1200',
      'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?q=80&w=1200'
    ]
  },
  mehndi: {
    title: 'Mehndi & Sangeet Ceremonies',
    subtitle: 'Henna & Rhythms',
    desc: 'Bright, colorful, and packed with music! Our Mehndi and Sangeet setups feature vibrant drapes, marigold flower chains, low-seating diwan chairs, and premium sound systems to set the perfect festive mood for family dance-offs.',
    inclusions: [
      'Vibrant color draping and marigold installations',
      'Comfortable diwan seating with bolsters',
      'Selfie backdrops and swing (jhoola) options',
      'Pro-grade sound systems for music playback',
      'Bright lighting designed for evening dances'
    ],
    slideshow: [
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1200',
      'https://images.unsplash.com/photo-1605001011156-cbf0b0f67a51?q=80&w=1200',
      'https://images.unsplash.com/photo-1544078751-58fed2b84d58?q=80&w=1200'
    ]
  },
  'dj-events': {
    title: 'DJ Sound, Stage & Lighting',
    subtitle: 'Feel the Bass',
    desc: 'Turn any venue into a concert hall. We deploy line-array sound systems, moving-head intelligent lighting, LED walls, and custom truss setups for birthday bashes, sangeets, and public celebrations.',
    inclusions: [
      'High-power sound system and mixer setups',
      'Moving-head beam lights & ambient wash fixtures',
      'Elevated DJ console and stage truss systems',
      'Coordinated sound-to-light programming',
      'Optional smoke machines and laser systems'
    ],
    slideshow: [
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200',
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1200',
      'https://images.unsplash.com/photo-1482440308425-276ad0f28b19?q=80&w=1200'
    ]
  },
  photography: {
    title: 'Professional Candid Photography',
    subtitle: 'Capturing Timeless Stories',
    desc: 'Freeze your fleeting emotions in high-definition. Our partner teams provide candid photography, traditional video coverage, 4K aerial drone shots, and premium leather-bound photo albums.',
    inclusions: [
      'Candid & traditional portrait photographers',
      'HD and 4K video recording with editing',
      'Drone aerial venue coverage',
      'High-end designer photo albums',
      'All raw and edited digital files delivered'
    ],
    slideshow: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1200',
      'https://images.unsplash.com/photo-1452780212940-6f5c0d14d84a?q=80&w=1200',
      'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=1200'
    ]
  },
  'stage-decor': {
    title: 'Custom Theme Stage Decors',
    subtitle: 'Bespoke Artistic Backdrops',
    desc: 'Need a customized stage for a ceremony, political meet, or reception? We build bespoke metal and wooden frames, high-end artificial flower designs, name plates, and structured LED displays.',
    inclusions: [
      'Custom frame building and sizing',
      'High-density silk and fresh flower accents',
      'Intelligent LED spotlights & uplighting',
      '3D model pre-vis validation with admins',
      'Prompt assembly and post-event cleanup'
    ],
    slideshow: [
      'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200',
      'https://images.unsplash.com/photo-1478147427282-58a87a120781?q=80&w=1200',
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1200'
    ]
  },
  corporate: {
    title: 'Corporate Events & Meets',
    subtitle: 'Seamless Professional Execution',
    desc: 'Plan your product launches, awards nights, and annual general meetings with Adithya Events. We set up podiums, line-array audio systems, projector screens, registration booths, and executive guest catering.',
    inclusions: [
      'Registration desk and branding backdrops',
      'Podiums, cordless microphones, and PA systems',
      'Projector screens or high-resolution LED panels',
      'Executive high-tea and buffet catering',
      'Clean professional layouts'
    ],
    slideshow: [
      'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200',
      'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=1200',
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200'
    ]
  }
};

const EventDetailPage = () => {
  const { slug } = useParams();
  const [loading, setLoading] = useState(true);
  const [eventData, setEventData] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const normalizedSlug = slug ? slug.toLowerCase() : 'wedding';
  const defaultInfo = DEFAULT_EVENT_DETAILS[normalizedSlug] || DEFAULT_EVENT_DETAILS.wedding;

  // 1. Fetch Event Info from Firestore (or fallback to defaults)
  useEffect(() => {
    const fetchEventInfo = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, 'eventTypes', normalizedSlug);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setEventData({ ...defaultInfo, ...docSnap.data() });
        } else {
          setEventData(defaultInfo);
        }
      } catch (err) {
        console.error('Error fetching event details:', err);
        setEventData(defaultInfo);
      } finally {
        setLoading(false);
      }
    };
    fetchEventInfo();
  }, [normalizedSlug, defaultInfo]);

  // 2. Fetch Category Photos from Gallery
  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const q = query(collection(db, 'gallery'), where('category', '==', normalizedSlug));
        const snap = await getDocs(q);
        const list = [];
        snap.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        if (list.length > 0) {
          setPhotos(list);
        } else {
          // Fallback to slideshow photos for gallery
          setPhotos(defaultInfo.slideshow.map((url, index) => ({
            id: `fallback-${index}`,
            src: url,
            caption: `${defaultInfo.title} Decor View ${index + 1}`,
            category: normalizedSlug
          })));
        }
      } catch (e) {
        console.error('Error fetching gallery photos:', e);
        setPhotos(defaultInfo.slideshow.map((url, index) => ({
          id: `fallback-${index}`,
          src: url,
          caption: `${defaultInfo.title} Decor View ${index + 1}`,
          category: normalizedSlug
        })));
      }
    };
    fetchPhotos();
  }, [normalizedSlug, defaultInfo]);

  // 3. Slideshow timer
  useEffect(() => {
    if (!eventData || !eventData.slideshow || eventData.slideshow.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % eventData.slideshow.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [eventData]);

  if (loading || !eventData) {
    return (
      <div className="min-h-screen bg-velvet flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const openLightbox = (index) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const prevPhoto = (e) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const nextPhoto = (e) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  const whatsappMessage = `Hi Adithya Events, I want to inquire about the "${eventData.title}" event services. Please share details.`;
  const whatsappUrl = `https://wa.me/919393217676?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <PageTransition>
      <SEOHead 
        title={`${eventData.title} | Adithya Event Management`}
        description={eventData.desc.substring(0, 150)}
      />

      <div className="bg-velvet min-h-screen text-champagne pb-20">
        
        {/* Full-Bleed Auto-Slide Hero */}
        <div className="relative h-[60vh] md:h-[75vh] w-full overflow-hidden border-b border-gold/15">
          {eventData.slideshow.map((slideUrl, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                idx === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={slideUrl}
                alt={`${eventData.title} Slideshow ${idx + 1}`}
                className="w-full h-full object-cover scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-velvet via-velvet/40 to-transparent" />
            </div>
          ))}

          {/* Centered Heading */}
          <div className="absolute inset-0 flex flex-col justify-end items-center text-center p-6 pb-12 z-10">
            <span className="font-accent text-3xl md:text-5xl text-gold mb-2 drop-shadow-md">
              {eventData.subtitle}
            </span>
            <h1 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold text-cream tracking-wide drop-shadow-lg uppercase">
              {eventData.title}
            </h1>
            <div className="w-20 h-[3px] bg-gradient-to-r from-transparent via-gold to-transparent mt-4 rounded-full" />
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-5xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
          
          {/* Main Description */}
          <div className="md:col-span-2 space-y-6">
            <h2 className="font-display text-2xl font-bold text-gold flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-gold" />
              Event Description
            </h2>
            <p className="font-body text-sm md:text-base leading-relaxed text-champagne/80">
              {eventData.desc}
            </p>

            {/* Inclusions */}
            <div className="pt-6">
              <h3 className="font-display text-xl font-semibold text-gold mb-4">
                What We Provide
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-body text-xs md:text-sm text-champagne/70">
                {eventData.inclusions.map((inc, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-gold mr-2.5 mt-0.5 select-none">✦</span>
                    <span>{inc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar Actions */}
          <div className="bg-amethyst/30 border border-gold/15 p-6 rounded-xl space-y-6 h-fit backdrop-blur-sm">
            <h3 className="font-display text-lg font-bold text-gold text-center tracking-wide uppercase border-b border-gold/10 pb-3">
              Book this Event
            </h3>
            
            <p className="font-body text-xs text-champagne/60 text-center leading-relaxed">
              Ready to celebrate? Contact our representative or click below to lock in dates and coordinate designs.
            </p>

            <div className="space-y-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-2 w-full py-3 bg-[#25D366] hover:bg-[#20ba5a] text-white font-body font-semibold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer shadow-lg shadow-black/10"
              >
                <MessageSquare className="w-4 h-4 fill-white" />
                <span>Enquire on WhatsApp</span>
              </a>

              <a
                href="tel:+919393217676"
                className="flex items-center justify-center space-x-2 w-full py-3 bg-white/5 hover:bg-gold/15 text-gold border border-gold/30 hover:border-gold/50 font-body font-semibold text-xs uppercase tracking-wider rounded-lg transition-all cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                <span>Call Us Now</span>
              </a>

              <Link
                to="/booking"
                className="flex items-center justify-center space-x-2 w-full py-3 bg-gradient-to-r from-gold-deep via-gold to-gold-rich text-velvet font-body font-bold text-xs uppercase tracking-widest rounded-lg transition-all hover:opacity-90 cursor-pointer shadow-md shadow-gold/15"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Event Dates</span>
              </Link>
            </div>
          </div>

        </div>

        {/* Gallery Section */}
        <div className="max-w-5xl mx-auto px-6 py-8 border-t border-white/5">
          <div className="text-center mb-12">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-cream">
              Recent {eventData.title} Backdrops
            </h2>
            <p className="font-body text-xs text-champagne/50 mt-2">
              Photos of actual stages and decor setups designed in Vijayawada and surrounding regions.
            </p>
          </div>

          {/* Masonry / Grid */}
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {photos.map((p, idx) => (
              <div
                key={p.id || idx}
                onClick={() => openLightbox(idx)}
                className="break-inside-avoid relative rounded-xl overflow-hidden group border border-white/5 hover:border-gold/30 transition-all duration-300 cursor-pointer shadow-lg bg-amethyst/10"
              >
                <img
                  src={p.src}
                  alt={p.caption || `${eventData.title} Decor`}
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-left">
                  <span className="font-body text-[10px] text-gold uppercase tracking-wider">
                    {p.category}
                  </span>
                  <h4 className="font-display text-sm font-semibold text-ivory mt-1">
                    {p.caption || 'Decor Setup'}
                  </h4>
                  <div className="absolute top-4 right-4 p-2 bg-velvet/80 rounded-full border border-white/10 text-gold scale-75 group-hover:scale-100 transition-transform">
                    <Eye className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Custom Lightbox Modal */}
        <AnimatePresence>
          {lightboxIndex !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeLightbox}
              className="fixed inset-0 bg-black/95 z-[999] flex items-center justify-center p-4 backdrop-blur-sm"
            >
              <button
                type="button"
                onClick={closeLightbox}
                className="absolute top-6 right-6 text-champagne hover:text-gold p-1 cursor-pointer transition-colors"
                aria-label="Close Lightbox"
              >
                <X className="w-8 h-8" />
              </button>

              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); prevPhoto(e); }}
                className="absolute left-4 p-3 rounded-full bg-white/5 border border-white/10 text-gold hover:bg-white/10 cursor-pointer transition-colors"
                aria-label="Previous Photo"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <div className="max-w-4xl max-h-[85vh] flex flex-col items-center select-none" onClick={(e) => e.stopPropagation()}>
                <img
                  src={photos[lightboxIndex].src}
                  alt={photos[lightboxIndex].caption}
                  className="max-w-full max-h-[72vh] object-contain rounded border border-gold/15"
                />
                <p className="font-display text-base md:text-lg font-semibold text-gold mt-4 text-center">
                  {photos[lightboxIndex].caption || 'Adithya Event Decor'}
                </p>
                <span className="font-body text-[10px] text-champagne/50 uppercase tracking-widest mt-1">
                  {photos[lightboxIndex].category}
                </span>
              </div>

              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); nextPhoto(e); }}
                className="absolute right-4 p-3 rounded-full bg-white/5 border border-white/10 text-gold hover:bg-white/10 cursor-pointer transition-colors"
                aria-label="Next Photo"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </PageTransition>
  );
};

export default EventDetailPage;
