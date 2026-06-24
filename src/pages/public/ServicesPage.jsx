// src/pages/public/ServicesPage.jsx
import React from 'react';
import PageTransition from '../../components/common/PageTransition';
import SEOHead from '../../components/common/SEOHead';
import UniversalPageHero from '../../components/common/UniversalPageHero';
import Card from '../../components/common/Card';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const SERVICES_LIST = [
  // 1. Stage Decor
  { category: 'Stage Decor', title: 'Traditional Mandapam Decor', emoji: '💍', desc: 'Exquisite jasmine and marigold configurations styled for authentic Telugu weddings.' },
  { category: 'Stage Decor', title: 'Modern LED Stage Layouts', emoji: '⚡', desc: 'Sleek custom structures integrated with dynamic colored backlights and spotlights.' },
  { category: 'Stage Decor', title: 'Silk Floral Wall Backdrops', emoji: '🌸', desc: 'High-density premium artificial silk flower walls for celebrity reception aesthetics.' },
  { category: 'Stage Decor', title: 'Theme Balloon Arches', emoji: '🎈', desc: 'Creative, colorful, and themed balloon designs for children’s birthday milestones.' },
  { category: 'Stage Decor', title: 'VIP Throne Seating', emoji: '👑', desc: 'Upholstered royal chairs and setup accessories to highlight the couple or guests.' },
  { category: 'Stage Decor', title: 'Entry Gate Arch Design', emoji: '🏛️', desc: 'Grand entryways with floral drops, lighting, and welcome signs to greet guests.' },

  // 2. Catering & Dining
  { category: 'Catering & Dining', title: 'Andhra Banana Leaf Meals', emoji: '🍃', desc: 'Traditional vegetarian feasts prepared under strict hygiene guidelines.' },
  { category: 'Catering & Dining', title: 'Multi-cuisine Buffet Layouts', emoji: '🍲', desc: 'Beautifully decorated buffet counters offering rich North and South Indian dishes.' },
  { category: 'Catering & Dining', title: 'Live Counter Sweets', emoji: '🥞', desc: 'Onsite live counters preparing hot jalebis, kulfi, and custom desserts for guests.' },
  { category: 'Catering & Dining', title: 'Premium Non-Veg Feasts', emoji: '🍗', desc: 'Rich Basmati chicken biryani and spicy Gongura mutton prepared by culinary masters.' },
  { category: 'Catering & Dining', title: 'Welcome Drinks Bar', emoji: '🍹', desc: 'Refreshing mocktails, local coconut coolers, and seasonal juices served upon entry.' },
  { category: 'Catering & Dining', title: 'Dessert Stations', emoji: '🍨', desc: 'Assorted ice creams, pastries, and traditional sweets displayed on glowing setups.' },

  // 3. Media & Coverage
  { category: 'Media & Coverage', title: 'Candid Wedding Photography', emoji: '📸', desc: 'Capturing natural emotional reactions, expressions, and highlights.' },
  { category: 'Media & Coverage', title: 'HD Traditional Videography', emoji: '🎥', desc: 'Complete event movie documentation editing, preserving the full ceremony ritual.' },
  { category: 'Media & Coverage', title: 'Cinematic Highlights & Reels', emoji: '🎞️', desc: 'Dazzling 3-minute cinematic trailers and reels optimized for social media sharing.' },
  { category: 'Media & Coverage', title: '4K Aerial Drone Coverage', emoji: '🛸', desc: 'Wide-angle venue aerial mappings capturing pathway lights and overall scale.' },
  { category: 'Media & Coverage', title: 'High-End Leather Photo Albums', emoji: '📖', desc: 'Premium custom layouts printed on imported non-tearable photographic sheets.' },
  { category: 'Media & Coverage', title: 'Pre-Wedding Location Shoots', emoji: '🌅', desc: 'Romantic outdoor photo sessions at scenic locales with customized styling.' },

  // 4. Sound & Lights
  { category: 'Sound & Lights', title: 'Dolby Sound Systems', emoji: '🔊', desc: 'Dolby line-array sound output for dance stages and public gatherings.' },
  { category: 'Sound & Lights', title: 'Intelligent Beam Lights', emoji: '💡', desc: 'Rotating moving heads, laser grids, and wash fixtures coordinated with audio beats.' },
  { category: 'Sound & Lights', title: 'Theme Wall Color Uplights', emoji: '🎨', desc: 'Strategically placed wall-wash LED fixtures to light up venue boundaries.' },
  { category: 'Sound & Lights', title: 'LED Projection Walls', emoji: '🖥️', desc: 'High-resolution modular LED screens displaying live couples feed and videos.' },
  { category: 'Sound & Lights', title: 'Special Entry Fog Effects', emoji: '💨', desc: 'Dry-ice heavy smoke generators creating a walking-on-clouds effect for entries.' },
  { category: 'Sound & Lights', title: 'Cold Pyro Sparklers', emoji: '✨', desc: 'Fire-free indoor sparkle fountains to celebrate grand highlights and entries safely.' },

  // 5. Logistics & Coordination
  { category: 'Logistics & Coordination', title: 'Venue Booking Assistance', emoji: '📅', desc: 'Consulting and booking top function halls in Vuyyuru and surrounding districts.' },
  { category: 'Logistics & Coordination', title: 'Guest Flower Showers', emoji: '🌼', desc: 'Coordinated traditional marigold and jasmine petal welcomes at entryways.' },
  { category: 'Logistics & Coordination', title: 'Thematic Selfie Booths', emoji: '🤳', desc: 'Custom backdrops decorated with floral quotes, frames, and props.' },
  { category: 'Logistics & Coordination', title: 'VIP Guest Seating Lounges', emoji: '🛋️', desc: 'Comfortable sofa setups and tables configured for VIP guests.' },
  { category: 'Logistics & Coordination', title: 'Car Decoration Services', emoji: '🚗', desc: 'Fresh floral designs custom-fitted on couple entry transport vehicles.' },
  { category: 'Logistics & Coordination', title: 'Onsite Coordination Crew', emoji: '🙋‍♂️', desc: 'Dedicated assistants overseeing food refills, schedule, and lighting setups.' },

  // 6. Event Specialties
  { category: 'Event Specialties', title: 'Mehndi Artists & Decor', emoji: '💅', desc: 'Talented henna designers paired with bright sangeet drapery backdrops.' },
  { category: 'Event Specialties', title: 'Mascots & Kids Attractions', emoji: '🤡', desc: 'Cartoon characters, popcorn stands, and magic shows for children’s events.' }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100, damping: 15 }
  }
};

const ServicesPage = () => {
  const serviceImages = [
    'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800',
    'https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=800',
    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800'
  ];

  // Group services by category
  const categories = [...new Set(SERVICES_LIST.map(s => s.category))];

  return (
    <PageTransition>
      <SEOHead 
        title="Our Services | Adithya Event Management" 
        description="Comprehensive list of 32 signature event management, stage decor, and catering services."
      />
      
      {/* Universal Page Hero */}
      <UniversalPageHero
        title="Our Services"
        subtitle="Signature Celebrations"
        description="Discover our catalog of 32 premium event coordination, structural stage backdrops, catering dining, and media services designed to give your celebrations a touch of royalty."
        images={serviceImages}
        breadcrumbs={[{ label: 'Services', path: '/services' }]}
      />

      <div className="bg-velvet text-champagne pb-24">
        <div className="max-w-6xl mx-auto px-6 py-16">
          
          {categories.map((category, catIdx) => {
            const filteredServices = SERVICES_LIST.filter(s => s.category === category);
            
            return (
              <div key={category} className={`mb-16 ${catIdx > 0 ? 'pt-12 border-t border-white/5' : ''}`}>
                <div className="text-left mb-8">
                  <h3 className="font-display text-2xl font-bold text-gold flex items-center">
                    <span className="text-gold mr-2.5">✦</span>
                    {category}
                  </h3>
                  <div className="w-12 h-[1.5px] bg-gold/40 mt-1" />
                </div>

                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left"
                >
                  {filteredServices.map((service, idx) => (
                    <motion.div key={idx} variants={itemVariants}>
                      <Card 
                        className="p-6 bg-amethyst/20 border-gold/10 hover:border-gold/30 h-full flex flex-col items-start space-y-3" 
                        hoverEffect={true}
                      >
                        {/* Emoji Ring */}
                        <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-xl shrink-0 select-none">
                          {service.emoji}
                        </div>
                        
                        {/* Content */}
                        <div className="space-y-1">
                          <h4 className="font-display text-sm font-bold text-cream">
                            {service.title}
                          </h4>
                          <p className="font-body text-[11px] text-champagne/60 leading-relaxed">
                            {service.desc}
                          </p>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            );
          })}

          {/* CTA Box */}
          <div className="bg-amethyst/30 border border-gold/20 p-8 rounded-2xl flex flex-col sm:flex-row items-center justify-between text-left gap-6 mt-16 backdrop-blur-sm">
            <div className="space-y-1">
              <h4 className="font-display text-lg font-bold text-gold flex items-center">
                <Sparkles className="w-4 h-4 mr-2" />
                Ready to Plan Your Event?
              </h4>
              <p className="font-body text-xs text-champagne/70 max-w-xl">
                Submit an inquiry via our consultation form to coordinate decoration themes, food tastings, and availability for your date.
              </p>
            </div>
            <Link 
              to="/booking" 
              className="px-6 py-3.5 bg-gradient-to-r from-gold-deep via-gold to-gold-rich text-velvet font-body font-bold text-xs uppercase tracking-widest flex items-center justify-center shrink-0 w-full sm:w-auto rounded-xl hover:opacity-90 transition-all shadow-lg shadow-gold/25"
            >
              <span>Consult with Planners</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>

        </div>
      </div>
    </PageTransition>
  );
};

export default ServicesPage;
