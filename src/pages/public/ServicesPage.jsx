// src/pages/public/ServicesPage.jsx
import React, { useState, useEffect } from 'react';
import PageTransition from '../../components/common/PageTransition';
import SEOHead from '../../components/common/SEOHead';
import UniversalPageHero from '../../components/common/UniversalPageHero';
import { db } from '../../firebase/config';
import { collection, onSnapshot } from 'firebase/firestore';
import { MessageSquare, Check, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const FALLBACK_SERVICES = [
  // 1. Stage Decor
  { id: 'fb-srv-1', category: 'Stage Decor', name: 'Traditional Mandapam Decor', description: 'Exquisite jasmine, marigold, and fresh rose configurations styled for authentic traditional Telugu weddings.', inclusions: ['Custom mandapam frame setup', 'Fresh traditional flowers', 'Pathway hanging drops & floor kolams'], imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800' },
  { id: 'fb-srv-2', category: 'Stage Decor', name: 'Modern LED Stage Layouts', description: 'Sleek custom geometric structures integrated with dynamic colored backlights, moving beams, and programmable spotlights.', inclusions: ['LED backdrop structure', 'Coordinated spotlight system', 'Tech operator on-site'], imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800' },
  { id: 'fb-srv-3', category: 'Stage Decor', name: 'Silk Floral Wall Backdrops', description: 'High-density premium artificial silk flower walls for celebrity reception aesthetics, guest selfie photo zones, and stage highlights.', inclusions: ['20ft x 10ft high-density flower wall', 'Spot lighting setups', 'Selfie props kit'], imageUrl: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=800' },

  // 2. Catering & Dining
  { id: 'fb-srv-4', category: 'Catering & Dining', name: 'Andhra Banana Leaf Meals', description: 'Traditional vegetarian feasts prepared under strict hygiene guidelines, featuring curries, pappu, Vijayawada special sambar, and hot sweets.', inclusions: ['Pure vegetarian master chefs', 'Organic banana leaves & setup', 'Uniformed serving hosts'], imageUrl: 'https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=800' },
  { id: 'fb-srv-5', category: 'Catering & Dining', name: 'Royal Non-Veg Feasts', description: 'Rich premium Basmati chicken biryani, Gongura mutton, and Nellore fish pulusu prepared by master chefs using authentic spices.', inclusions: ['Uniformed buffet service', 'Live hot jalebi counter', 'Eco-friendly table settings'], imageUrl: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?q=80&w=800' },

  // 3. Media & Coverage
  { id: 'fb-srv-6', category: 'Media & Coverage', name: 'Candid Wedding Photography', description: 'Capturing natural emotional reactions, smiles, and micro-moments. Delivered in premium high-end leather albums and soft copies.', inclusions: ['2 Senior Candid Photographers', 'High-res soft copy delivery', 'Premium layout print album'], imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800' },
  { id: 'fb-srv-7', category: 'Media & Coverage', name: '4K Aerial Drone Coverage', description: 'Wide-angle cinematic venue aerial mappings capturing pathway lights, grand entries, and the scale of celebration.', inclusions: ['4K Cinematic Drone & Pilot', 'Licensed outdoor operations', 'RAW video edits included'], imageUrl: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=800' },

  // 4. Logistics & Coordination
  { id: 'fb-srv-8', category: 'Logistics & Coordination', name: 'Car Decoration Services', description: 'Fresh floral designs and ribbons custom-fitted on the couple entry transport vehicle to match the wedding theme.', inclusions: ['Fresh roses and jasmines setup', 'On-venue quick fitment', 'Ribbons & secondary details'], imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800' }
];

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'servicesCatalog'),
      (snapshot) => {
        if (!snapshot.empty) {
          const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          // Filter active services
          const activeList = list.filter(s => s.isActive !== false);
          setServices(activeList);
        } else {
          setServices(FALLBACK_SERVICES);
        }
        setLoading(false);
      },
      (error) => {
        console.error(error);
        setServices(FALLBACK_SERVICES);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleWhatsAppEnquiry = (srvName) => {
    const message = `Namaste! I would like to enquire about the *${srvName}* service for my upcoming event. Please share details.`;
    window.open(`https://wa.me/919393217676?text=${encodeURIComponent(message)}`, '_blank');
  };

  const heroImages = [
    'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800',
    'https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=800',
    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800'
  ];

  return (
    <PageTransition>
      <SEOHead 
        title="Our Event Services | Adithya Event Management" 
        description="Explore our premium wedding decorations, gourmet catering, professional photography, and sound setup services."
      />
      
      <UniversalPageHero
        title="Our Services"
        subtitle="Royal Celebrations Tiers"
        description="Discover our catalog of premium event customizers, structural stage backdrops, catering dining feasts, and media services. Every celebration is hand-crafted with pure dedication."
        images={heroImages}
        breadcrumbs={[{ label: 'Services', path: '/services' }]}
      />

      <div className="bg-velvet text-champagne pb-24 text-left">
        <div className="max-w-6xl mx-auto px-6 py-16">
          
          {loading ? (
            <div className="h-[40vh] flex items-center justify-center">
              <div className="w-8 h-8 rounded-full border-2 border-t-gold animate-spin" />
            </div>
          ) : (
            <div className="space-y-24">
              {services.map((service, idx) => {
                const isEven = idx % 2 === 0;
                return (
                  <motion.div
                    key={service.id || idx}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.65, ease: 'easeOut' }}
                    className={`flex flex-col md:flex-row ${
                      isEven ? '' : 'md:flex-row-reverse'
                    } items-center gap-10 md:gap-16 border-b border-white/5 pb-16 last:border-0`}
                  >
                    {/* Cover Graphic Image */}
                    <div className="w-full md:w-1/2 relative overflow-hidden rounded-2xl border border-white/10 group shadow-2xl">
                      <img
                        src={service.imageUrl}
                        alt={service.name}
                        className="w-full aspect-[4/3] object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-velvet/40 to-transparent pointer-events-none" />
                    </div>

                    {/* Text Details */}
                    <div className="w-full md:w-1/2 space-y-6">
                      <div className="space-y-2">
                        <span className="font-body text-[10px] text-gold tracking-widest uppercase font-semibold block">
                          ✦ {service.category}
                        </span>
                        <h2 className="font-display text-2xl sm:text-3xl font-bold text-cream">
                          {service.name}
                        </h2>
                        <div className="w-12 h-[1.5px] bg-gold/40 mt-1" />
                      </div>

                      <p className="font-body text-xs sm:text-sm text-champagne/80 leading-relaxed">
                        {service.description}
                      </p>

                      {/* Bullet Inclusions list */}
                      {Array.isArray(service.inclusions) && service.inclusions.length > 0 && (
                        <div className="space-y-2.5">
                          <h4 className="font-display font-semibold text-gold text-xs uppercase tracking-wider">
                            Inclusions & Specifications
                          </h4>
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {service.inclusions.map((inc, i) => (
                              <li key={i} className="font-body text-xs text-champagne/70 flex items-start">
                                <Check className="w-4 h-4 text-gold mr-2 shrink-0 mt-0.5" />
                                <span>{inc}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* CTA WhatsApp Action */}
                      <button
                        onClick={() => handleWhatsAppEnquiry(service.name)}
                        className="btn-premium btn-gold py-3 px-6 text-xs uppercase font-bold tracking-wider flex items-center justify-center space-x-2 shrink-0 cursor-pointer shadow-lg shadow-gold/5"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>Enquire on WhatsApp</span>
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Bottom generic CTA block */}
          <div className="bg-white/5 border border-gold/20 p-8 rounded-2xl flex flex-col sm:flex-row items-center justify-between text-left gap-6 mt-24 backdrop-blur-md">
            <div className="space-y-1">
              <h4 className="font-display text-lg font-bold text-gold flex items-center">
                <Sparkles className="w-4 h-4 mr-2" />
                Plan a Custom Event Theme?
              </h4>
              <p className="font-body text-xs text-champagne/70 max-w-xl">
                Connect with our planning team directly. We will schedule a physical design consultation at our Vijayawada office.
              </p>
            </div>
            <a
              href="https://wa.me/919393217676"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 bg-gradient-to-r from-gold-deep via-gold to-gold-rich text-velvet font-body font-bold text-xs uppercase tracking-widest flex items-center justify-center shrink-0 w-full sm:w-auto rounded-xl hover:opacity-90 transition-all shadow-lg shadow-gold/25 cursor-pointer"
            >
              <span>Chat with Planners</span>
            </a>
          </div>

        </div>
      </div>
    </PageTransition>
  );
};

export default ServicesPage;
