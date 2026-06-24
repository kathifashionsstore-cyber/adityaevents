// src/components/home/BrochureDownload.jsx
import React, { useState } from 'react';
import { Download, FileText } from 'lucide-react';
import Input from '../common/Input';
import Button from '../common/Button';
import toast from 'react-hot-toast';
import { createLead } from '../../services/leadService';

const BrochureDownload = () => {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDownload = async (e) => {
    e.preventDefault();
    if (!name || !phone) {
      toast.error('Please enter your Name and Phone to download the brochure.');
      return;
    }

    setLoading(true);
    try {
      // 1. Log lead to database
      await createLead({
        name,
        phone,
        message: 'Downloaded pricing brochure PDF.'
      });

      // 2. Trigger brochure download
      const link = document.createElement('a');
      link.href = 'https://firebasestorage.googleapis.com/v0/b/adithyaevents-a6140.firebasestorage.app/o/brochures%2FAdithya_Events_Brochure.pdf?alt=media';
      link.download = 'Adithya_Events_Brochure.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('Brochure download started!');
      setName('');
      setPhone('');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to trigger download. Please contact support.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 bg-charcoal text-champagne relative overflow-hidden border-t border-b border-gold/15">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.08)_0%,transparent_70%)] pointer-events-none" />
      <div className="max-w-4xl mx-auto px-6 text-center relative z-10 flex flex-col items-center">
        
        <div className="p-4 bg-white/5 border border-gold/25 rounded-full mb-6 text-gold animate-float">
          <FileText className="w-8 h-8" />
        </div>
        
        <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-ivory mb-3">
          Download Pricing & Menu Brochure
        </h2>
        <p className="font-body text-xs sm:text-sm text-champagne/70 max-w-xl leading-relaxed mb-8">
          Get complete details about our royal decorations stages, catering menu platters, pricing sheets, and event guidelines in a downloadable PDF.
        </p>

        {/* Input parameters */}
        <form onSubmit={handleDownload} className="flex flex-col sm:flex-row items-end space-y-4 sm:space-y-0 sm:space-x-4 w-full max-w-2xl bg-white/5 p-6 rounded-xl border border-white/5">
          <Input
            label="Your Name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Adithya"
            required
            className="text-left"
          />
          <Input
            label="Phone Number"
            name="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="e.g. 9393217676"
            required
            className="text-left"
          />
          <Button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto h-[48px] px-8 text-xs uppercase font-bold tracking-widest flex items-center justify-center shrink-0"
          >
            <Download className="w-4 h-4 mr-2" />
            <span>{loading ? 'Processing...' : 'Download PDF'}</span>
          </Button>
        </form>

      </div>
    </section>
  );
};

export default BrochureDownload;
