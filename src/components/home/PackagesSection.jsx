// src/components/home/PackagesSection.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { Check } from 'lucide-react';

const PackagesSection = () => {
  const scrollRef = useScrollAnimation();

  const packages = [
    {
      name: 'Silver Celebration',
      icon: '🥂',
      themeClass: 'silver-tier',
      borderStyle: 'linear-gradient(135deg, #C0C0C0 0%, #E8E8E8 50%, #C0C0C0 100%)',
      shadowColor: 'rgba(192, 192, 192, 0.25)',
      inclusions: [
        'Basic Stage Decoration',
        'Catering (up to 100 Guests)',
        'Photography (4 Hours)',
        'Sound System Setup',
        'Welcome Banner & Lighting',
        'Dedicated Event Coordinator',
        'Serving Staff'
      ],
      whatsappMsg: 'Hello! I am interested in the Silver Celebration package. Please share details.'
    },
    {
      name: 'Golden Moments',
      icon: '👑',
      themeClass: 'gold-tier',
      borderStyle: 'linear-gradient(135deg, #D4AF37 0%, #FFD700 50%, #B8860B 100%)',
      shadowColor: 'rgba(212, 175, 55, 0.45)',
      isPopular: true,
      inclusions: [
        'Premium Stage & Mandap Decoration',
        'Catering (up to 300 Guests)',
        'Photography + Videography (Full Day)',
        'Professional DJ with Sound System',
        'Premium Floral Decoration',
        'LED Lighting Setup',
        'Reception Decoration',
        '2 Live Food Counters',
        'Dedicated Event Manager',
        'Full Serving Staff Team',
        'Welcome Arch',
        'Table Centerpieces'
      ],
      whatsappMsg: 'Hello! I am interested in the Golden Moments package. Please share details.'
    },
    {
      name: 'Royal Diamond',
      icon: '💎',
      themeClass: 'diamond-tier',
      borderStyle: 'linear-gradient(135deg, #B9F2FF 0%, #89CFF0 50%, #4FC3F7 100%)',
      shadowColor: 'rgba(137, 207, 240, 0.35)',
      isLuxury: true,
      inclusions: [
        'Royal Mandap & Stage (Full Custom Design)',
        'Unlimited Catering (All-Inclusive)',
        'Photography + Cinematography + Drone Aerial',
        'Professional DJ + Live Band Option',
        'Luxury Floral & Theme Decoration',
        'Premium LED + Laser Lighting',
        'Mehandi Ceremony Setup',
        'Sangeet Night Arrangement',
        '5+ Live Food Counters',
        'Custom Guest Welcome Gifts',
        'Professional MC / Anchor',
        'Video Mapping & Projection Shows',
        'Horse / Vintage Car Bridal Entry',
        'Guest Accommodation Coordination',
        'Post-Event Cleanup Included',
        'Personalized Event Manager (Full Time)'
      ],
      whatsappMsg: 'Hello! I am interested in the Royal Diamond package. Please share details.'
    }
  ];

  const handleEnquire = (msg) => {
    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/919393217676?text=${encoded}`, '_blank');
  };

  return (
    <section ref={scrollRef} className="py-24 bg-amethyst relative overflow-hidden reveal-on-scroll">
      {/* Decorative ambient background spots */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 rounded-full bg-royal/10 filter blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/10 w-96 h-96 rounded-full bg-gold/5 filter blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <h2 className="font-display text-4xl sm:text-5xl font-extrabold text-ivory mb-2">
            Curated Signature Tiers
          </h2>
          <span className="font-accent text-gold text-3xl sm:text-4xl tracking-wider block mt-1">
            Every Celebration, Perfectly Planned
          </span>
          <p className="font-body text-xs sm:text-sm text-champagne/70 max-w-xl mx-auto mt-4 leading-relaxed">
            Select a tailored framework for your milestone celebration. Speak with our design directors to customize any inclusion.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {packages.map((pkg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.15, duration: 0.6 }}
              whileHover={{ y: -12, scale: 1.04 }}
              style={{
                background: 'var(--bg-card-dark)',
                border: '2px solid transparent',
                borderImage: `${pkg.borderStyle} 1`,
                boxShadow: `0 12px 30px -10px ${pkg.shadowColor}`
              }}
              className={`rounded-xl p-8 flex flex-col justify-between relative overflow-hidden transition-all duration-300 ${
                pkg.isPopular ? 'lg:-translate-y-4 border-2' : ''
              }`}
            >
              {/* Highlight ribbon badges */}
              {pkg.isPopular && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-gold to-deep-gold text-velvet font-body font-bold text-[9px] uppercase tracking-widest px-4 py-1.5 shadow-lg shadow-gold/25 rounded-bl-lg">
                  ⭐ MOST POPULAR
                </div>
              )}
              {pkg.isLuxury && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-300 to-sky-500 text-velvet font-body font-bold text-[9px] uppercase tracking-widest px-4 py-1.5 shadow-lg rounded-bl-lg">
                  💎 LUXURY TIER
                </div>
              )}

              <div>
                <div className="flex items-center space-x-3 mb-6">
                  <span className="text-3xl" role="img" aria-label="Tier Icon">{pkg.icon}</span>
                  <h3 className="font-display text-xl font-bold text-champagne">{pkg.name}</h3>
                </div>

                <div className="h-[1px] bg-white/10 w-full mb-6" />

                <ul className="space-y-3.5 mb-8 text-left">
                  {pkg.inclusions.map((inc, i) => (
                    <li key={i} className="flex items-start text-champagne/85 font-body text-xs leading-tight">
                      <Check className="w-4 h-4 text-gold mr-3 shrink-0 mt-0.5" />
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => handleEnquire(pkg.whatsappMsg)}
                className={`w-full py-3 text-xs uppercase font-bold tracking-widest mt-auto rounded-lg transition-all duration-300 border flex items-center justify-center cursor-pointer ${
                  pkg.isPopular 
                    ? 'btn-premium btn-gold text-velvet hover:shadow-gold-lg' 
                    : 'btn-premium btn-outline-gold text-gold hover:bg-gold hover:text-velvet'
                }`}
              >
                Enquire About {pkg.name.split(' ')[0]}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PackagesSection;
