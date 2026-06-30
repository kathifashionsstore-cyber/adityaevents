// src/pages/public/AboutPage.jsx
import React from 'react';
import PageTransition from '../../components/common/PageTransition';
import SEOHead from '../../components/common/SEOHead';
import UniversalPageHero from '../../components/common/UniversalPageHero';
import Card from '../../components/common/Card';
import { ShieldCheck, Award, Heart, Milestone, Users, Sparkles } from 'lucide-react';

const AboutPage = () => {
  const milestones = [
    { year: '2015', title: 'Founding Year', desc: 'Started with basic stage decorations and tent services in Vijayawada, Andhra Pradesh.' },
    { year: '2018', title: '100+ Weddings Milestone', desc: 'Expanded into premium floral mandapams and custom pathway lighting setups.' },
    { year: '2021', title: 'Gourmet Catering Launch', desc: 'Introduced traditional Andhra veg/non-veg catering services with Master Chef supervision.' },
    { year: '2024', title: 'Pro DJ & Sound Truss', desc: 'Acquired state-of-the-art Dolby audio line-arrays and high-intensity intelligent lights.' },
    { year: '2026', title: 'Adithya Premium v2.0', desc: 'Transitioned into a fully digitized, client-centric premium events coordination engine.' }
  ];



  const aboutImages = [
    'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800',
    'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=800',
    'https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=800'
  ];

  return (
    <PageTransition>
      <SEOHead 
        title="Our Story | Adithya Event Management" 
        description="The journey of Vijayawada's premier wedding planner, catering supplier, and custom stage decorator."
      />
      
      {/* Universal Page Hero */}
      <UniversalPageHero
        title="Our Journey"
        subtitle="Adithya Event Management"
        description="Since 2015, we have been crafting royal Telugu weddings, premium multi-cuisine catering, and professional event experiences in Vijayawada and adjacent Krishna district sub-regions."
        images={aboutImages}
        breadcrumbs={[{ label: 'About', path: '/about' }]}
      />

      <div className="bg-velvet text-champagne pb-24">
        
        {/* Founder Narrative Segment */}
        <section className="py-20 px-6 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
            
            <div className="md:col-span-7 space-y-6 text-left">
              <div className="flex items-center space-x-2 text-gold">
                <Sparkles className="w-4 h-4" />
                <span className="font-body text-xs font-bold uppercase tracking-wider">Founder's Message</span>
              </div>
              <h2 className="font-display text-3xl font-bold text-cream">
                "Every celebration is a sacred gateway where families welcome forever memories."
              </h2>
              <blockquote className="font-body text-sm text-champagne/80 italic leading-relaxed border-l-2 border-gold pl-4 py-1">
                "We founded Adithya Event Management in Vijayawada with a single vision: to eliminate the logistical stress of families during marriages, enabling them to host their guests with pure joy. Over 10 years, our team has built trust by ensuring transparent rates, fresh floral decors, and authentic master chef culinary feasts."
              </blockquote>
              <p className="font-display text-sm font-bold text-gold">
                — Chennuru Lokesh, Founder & Chief Decorator
              </p>
            </div>

            <div className="md:col-span-5 rounded-2xl overflow-hidden border border-gold/15 aspect-square shadow-2xl relative">
              <img
                src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=600"
                alt="Adithya Wedding Reception"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-velvet/40 to-transparent" />
            </div>

          </div>
        </section>

        {/* Milestones Timeline */}
        <section className="py-16 bg-amethyst/10 border-y border-white/5 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <div className="flex justify-center text-gold mb-2">
                <Milestone className="w-5 h-5" />
              </div>
              <h3 className="font-display text-2xl md:text-3xl font-bold text-cream">Historical Milestones</h3>
              <p className="font-body text-xs text-gold/80 tracking-widest uppercase mt-1">Our path of professional growth</p>
            </div>

            <div className="relative border-l border-gold/20 ml-4 md:ml-0 md:grid md:grid-cols-5 md:border-l-0 md:border-t md:pt-8 md:gap-6 space-y-8 md:space-y-0 text-left">
              {milestones.map((stone, idx) => (
                <div key={idx} className="relative pl-6 md:pl-0 md:pt-4">
                  {/* Point circle */}
                  <div className="absolute -left-1.5 top-1.5 md:-top-[38px] md:left-0 w-3.5 h-3.5 bg-gold border-2 border-velvet rounded-full shadow-lg" />
                  
                  <span className="font-mono text-base font-bold text-gold bg-gold/5 px-2 py-0.5 rounded border border-gold/15 inline-block mb-2">
                    {stone.year}
                  </span>
                  <h4 className="font-display text-sm font-bold text-cream mb-1">{stone.title}</h4>
                  <p className="font-body text-[11px] text-champagne/60 leading-relaxed">{stone.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="py-20 px-6 max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="font-display text-2xl md:text-3xl font-bold text-cream">Our Pillars of Success</h3>
            <p className="font-body text-xs text-gold/80 tracking-widest uppercase mt-1">Ethical standards we stand by</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="flex flex-col items-center text-center p-8 bg-amethyst/20 border-gold/15" hoverEffect={true}>
              <ShieldCheck className="w-10 h-10 text-gold mb-4" />
              <h4 className="font-display text-base font-bold text-champagne mb-2">Absolute Quote Integrity</h4>
              <p className="font-body text-xs text-champagne/70 leading-relaxed">
                We believe in complete trust. Every package is transparently discussed and quoted without hidden transport, labor, or emergency surcharge surprises.
              </p>
            </Card>

            <Card className="flex flex-col items-center text-center p-8 bg-amethyst/20 border-gold/15" hoverEffect={true}>
              <Award className="w-10 h-10 text-gold mb-4" />
              <h4 className="font-display text-base font-bold text-champagne mb-2">Premium Production Quality</h4>
              <p className="font-body text-xs text-champagne/70 leading-relaxed">
                From high-density silk flower backdrops and imported pathway carpets to Dolby sound systems and dry-ice couple entry smoke.
              </p>
            </Card>

            <Card className="flex flex-col items-center text-center p-8 bg-amethyst/20 border-gold/15" hoverEffect={true}>
              <Heart className="w-10 h-10 text-gold mb-4" />
              <h4 className="font-display text-base font-bold text-champagne mb-2">Family-First Hospitality</h4>
              <p className="font-body text-xs text-champagne/70 leading-relaxed">
                We manage the chaotic back-end logistics of setups, chef coordination, and cleanups so that you can simply be a warm host.
              </p>
            </Card>
          </div>
        </section>
        {/* Unified Team Block */}
        <section className="py-20 bg-amethyst/10 border-t border-white/5 px-6">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="flex justify-center text-gold">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="font-display text-2xl md:text-3xl font-extrabold text-cream">
              Backed by a Team of 30+ Dedicated Professionals
            </h3>
            <p className="font-body text-xs text-gold/80 tracking-widest uppercase font-semibold animate-pulse">
              Behind Every Seamless Celebration
            </p>
            <p className="font-body text-sm text-champagne/80 leading-relaxed max-w-2xl mx-auto">
              Our workforce consists of experienced structural decorators, master culinary chefs, creative lighting technicians, and onsite event coordinators. Under Chennuru Lokesh's design supervision, we handle everything from site inspection and floral rigging to buffet service management, ensuring your events are executed with extreme dedication and premium royalty.
            </p>
          </div>
        </section>

      </div>
    </PageTransition>
  );
};

export default AboutPage;
