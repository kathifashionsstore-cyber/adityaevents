// src/pages/admin/AdminEventTypesPage.jsx
import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import PageTransition from '../../components/common/PageTransition';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import ImageUploadWithCompressor from '../../components/common/ImageUploadWithCompressor';
import { useStorage } from '../../hooks/useStorage';
import toast from 'react-hot-toast';
import { Sparkles, Save, UploadCloud } from 'lucide-react';

const EVENT_CATEGORIES = [
  { slug: 'wedding', label: 'Wedding' },
  { slug: 'catering', label: 'Premium Catering' },
  { slug: 'birthday', label: 'Birthdays' },
  { slug: 'engagement', label: 'Engagement' },
  { slug: 'receptions', label: 'Receptions' },
  { slug: 'mehndi', label: 'Mehndi Night' },
  { slug: 'dj-events', label: 'DJ Events' },
  { slug: 'photography', label: 'Photography' },
  { slug: 'stage-decor', label: 'Stage Decor' },
  { slug: 'corporate', label: 'Corporate' }
];

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

const AdminEventTypesPage = () => {
  const [selectedSlug, setSelectedSlug] = useState('wedding');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    desc: '',
    inclusionsText: '',
    slideshow: ['', '', '']
  });

  const { uploadFileWithProgress, progress, uploading } = useStorage();

  // Load event details
  const loadEventDetails = async (slug) => {
    setLoading(true);
    try {
      const docRef = doc(db, 'eventTypes', slug);
      const snap = await getDoc(docRef);
      const defaultInfo = DEFAULT_EVENT_DETAILS[slug] || DEFAULT_EVENT_DETAILS.wedding;
      
      if (snap.exists()) {
        const data = snap.data();
        setFormData({
          title: data.title || defaultInfo.title,
          subtitle: data.subtitle || defaultInfo.subtitle,
          desc: data.desc || defaultInfo.desc,
          inclusionsText: (data.inclusions || defaultInfo.inclusions).join('\n'),
          slideshow: data.slideshow || defaultInfo.slideshow
        });
      } else {
        // Fallback default
        setFormData({
          title: defaultInfo.title,
          subtitle: defaultInfo.subtitle,
          desc: defaultInfo.desc,
          inclusionsText: defaultInfo.inclusions.join('\n'),
          slideshow: [...defaultInfo.slideshow]
        });
      }
    } catch (e) {
      console.error(e);
      toast.error('Failed to load event type details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEventDetails(selectedSlug);
  }, [selectedSlug]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSlideshowChange = (index, value) => {
    setFormData((prev) => {
      const nextSlideshow = [...prev.slideshow];
      nextSlideshow[index] = value;
      return { ...prev, slideshow: nextSlideshow };
    });
  };

  // Image compress and upload slot
  const handleImageUpload = async (blob, slotIndex) => {
    try {
      const path = `eventTypes/${selectedSlug}/slideshow_${slotIndex}_${Date.now()}.jpg`;
      const downloadUrl = await uploadFileWithProgress(blob, path);
      
      handleSlideshowChange(slotIndex, downloadUrl);
      toast.success(`Slot ${slotIndex + 1} image uploaded and updated!`);
    } catch (err) {
      console.error(err);
      toast.error('Upload failed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const inclusions = formData.inclusionsText
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

      await setDoc(doc(db, 'eventTypes', selectedSlug), {
        title: formData.title,
        subtitle: formData.subtitle,
        desc: formData.desc,
        inclusions,
        slideshow: formData.slideshow,
        updatedAt: new Date().toISOString()
      });

      toast.success('Event type details saved to Firestore successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to save details.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageTransition>
      <div className="space-y-6 pb-12 text-left max-w-4xl mx-auto">
        <div className="flex justify-between items-center">
          <h3 className="font-display text-champagne text-sm font-semibold tracking-wide uppercase">
            Event Types Customizer
          </h3>
          <span className="font-body text-[10px] text-gold uppercase tracking-wider bg-gold/10 px-2 py-0.5 rounded border border-gold/15">
            Phase 6 Manager
          </span>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-white/5 pb-4">
          {EVENT_CATEGORIES.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setSelectedSlug(cat.slug)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                selectedSlug === cat.slug
                  ? 'bg-gold text-velvet shadow-md shadow-gold/25'
                  : 'bg-white/5 hover:bg-white/10 text-champagne/80 border border-white/15'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="py-20 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <Card className="p-6 space-y-4" hoverEffect={false}>
              <div className="flex items-center space-x-2 text-gold font-display font-bold text-sm uppercase tracking-wider border-b border-white/5 pb-2 mb-2">
                <Sparkles className="w-4 h-4" />
                <span>Text Details for {selectedSlug.toUpperCase()}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Dynamic Page Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Royal Wedding Ceremonies"
                  required
                />
                <Input
                  label="Accent Subtitle (Script Font)"
                  name="subtitle"
                  value={formData.subtitle}
                  onChange={handleChange}
                  placeholder="e.g. A Match Made in Heaven"
                  required
                />
              </div>

              <div className="flex flex-col space-y-1">
                <label className="font-body text-xs font-semibold text-champagne/80">
                  Event Category Description
                </label>
                <textarea
                  name="desc"
                  rows={4}
                  value={formData.desc}
                  onChange={handleChange}
                  placeholder="Detailed description of files and processes..."
                  className="w-full bg-white/5 border border-white/10 focus:border-gold/50 rounded-lg p-3 text-xs text-champagne font-body outline-none transition-colors"
                  required
                />
              </div>

              <div className="flex flex-col space-y-1">
                <label className="font-body text-xs font-semibold text-champagne/80">
                  Inclusions (One line per item)
                </label>
                <textarea
                  name="inclusionsText"
                  rows={5}
                  value={formData.inclusionsText}
                  onChange={handleChange}
                  placeholder="Item 1&#10;Item 2&#10;Item 3"
                  className="w-full bg-white/5 border border-white/10 focus:border-gold/50 rounded-lg p-3 text-xs text-champagne font-mono outline-none transition-colors"
                  required
                />
              </div>
            </Card>

            {/* Slideshow Slots */}
            <Card className="p-6 space-y-6" hoverEffect={false}>
              <div className="flex items-center space-x-2 text-gold font-display font-bold text-sm uppercase tracking-wider border-b border-white/5 pb-2 mb-2">
                <UploadCloud className="w-4 h-4" />
                <span>Hero Slideshow Images (Max 3, compressed &lt; 300KB)</span>
              </div>

              {uploading && (
                <div className="space-y-1 animate-pulse">
                  <div className="flex justify-between text-[10px] text-gold font-body">
                    <span>Compressing & Uploading image to storage...</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                    <div className="bg-gold h-full transition-all duration-300" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {formData.slideshow.map((url, index) => (
                  <div key={index} className="space-y-3 bg-white/5 p-4 rounded-xl border border-white/5">
                    <h5 className="font-display text-xs font-bold text-champagne">Hero Image Slot {index + 1}</h5>
                    
                    {url && (
                      <div className="relative aspect-[16/9] w-full rounded overflow-hidden border border-white/10 bg-black/20">
                        <img src={url} alt={`Slot ${index + 1}`} className="w-full h-full object-cover" />
                      </div>
                    )}

                    <Input
                      label="Image URL Link"
                      name={`slot-${index}`}
                      value={url}
                      onChange={(e) => handleSlideshowChange(index, e.target.value)}
                      placeholder="Paste online image link directly..."
                    />

                    <div className="flex flex-col space-y-1 pt-1">
                      <span className="font-body text-[10px] font-semibold text-champagne/60 mb-1">
                        OR Upload Custom Image:
                      </span>
                      <ImageUploadWithCompressor
                        onUploadReady={(blob) => handleImageUpload(blob, index)}
                        multiple={false}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                disabled={saving || uploading}
                className="px-8 py-3 text-xs uppercase font-bold tracking-widest flex items-center space-x-2"
              >
                <Save className="w-4 h-4 mr-2" />
                <span>{saving ? 'Saving details...' : 'Save Configuration'}</span>
              </Button>
            </div>
          </form>
        )}
      </div>
    </PageTransition>
  );
};

export default AdminEventTypesPage;
