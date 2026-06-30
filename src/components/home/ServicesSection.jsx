// src/components/home/ServicesSection.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { Camera, Utensils, Sparkles, Music, ArrowRight } from 'lucide-react';

const ServicesSection = () => {
  const scrollRef = useScrollAnimation();

  const services = [
    {
      icon: <Sparkles className="w-4 h-4" />,
      title: 'Royal Stage Decorations',
      desc: 'Bespoke cinematic backdrops, fresh flower arches, and royal mandapam setups tailored to capture wedding themes.',
      imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600',
      link: '/services/wedding'
    },
    {
      icon: <Utensils className="w-4 h-4" />,
      title: 'Premium Local Catering',
      desc: 'Traditional Andhra style vegetarian meals and grand multi-cuisine non-vegetarian buffets prepared by expert chefs.',
      imageUrl: 'https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=600',
      link: '/services/catering'
    },
    {
      icon: <Camera className="w-4 h-4" />,
      title: 'Candid Media Coverage',
      desc: 'Professional candid photographers, high-definition videography, and 4K aerial drone shoots to preserve every event detail.',
      imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=600',
      link: '/services/media'
    },
    {
      icon: <Music className="w-4 h-4" />,
      title: 'High-End Audio & DJ',
      desc: 'Premium sound systems, club lights, and professional DJs to host wedding receptions, engagements, and birthday parties.',
      imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=600',
      link: '/services/sound'
    }
  ];

  return (
    <section ref={scrollRef} className="py-24 bg-background px-6 reveal-on-scroll relative z-10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 flex flex-col items-center">
          <span className="font-body text-[10px] font-bold text-primaryRose tracking-[0.25em] uppercase mb-2">
            DESIGNED FOR UNFORGETTABLE EXPERIENCES
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-textPrimary leading-tight">
            Signature Services
          </h2>
          <div className="divider-gold" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="flex flex-col bg-surface border border-border-soft rounded-2xl overflow-hidden shadow-sm hover:-translate-y-2 hover:shadow-md transition-all duration-300 text-left"
            >
              {/* Full-bleed top image */}
              <div className="relative w-full aspect-[4/3] overflow-hidden bg-darkSection">
                <img 
                  src={service.imageUrl} 
                  alt={service.title} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" 
                />
                {/* Overlay overlapping badge */}
                <div className="absolute -bottom-5 left-6 p-2.5 bg-white/95 border border-primaryRose/35 rounded-full text-primaryRose shadow-md z-10">
                  {service.icon}
                </div>
              </div>

              {/* Content area */}
              <div className="p-6 pt-8 flex flex-col flex-1 items-start justify-between">
                <div>
                  <h3 className="font-display text-base font-bold text-textPrimary mb-2 leading-snug">
                    {service.title}
                  </h3>
                  <p className="font-body text-xs text-textSecondary leading-relaxed line-clamp-2 mb-4">
                    {service.desc}
                  </p>
                </div>

                <Link 
                  to={service.link}
                  className="btn-ghost-rose text-[10px] font-bold tracking-widest uppercase flex items-center group/btn mt-auto"
                >
                  <span>Explore</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover/btn:translate-x-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
