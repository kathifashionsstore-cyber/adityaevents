// src/components/home/DualContactCard.jsx
import React, { useState } from 'react';
import { createLead } from '../../services/leadService';
import Input from '../common/Input';
import Button from '../common/Button';
import toast from 'react-hot-toast';
import { Phone, MessageSquare, Mail, MapPin, Send, HelpCircle } from 'lucide-react';
import { BUSINESS_DETAILS } from '../../utils/constants';
import { motion } from 'framer-motion';

const DualContactCard = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    eventDate: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      toast.error('Name and Phone number are required.');
      return;
    }

    setLoading(true);
    try {
      // 1. Save lead to Firestore /leads collection
      await createLead(formData);

      toast.success('Inquiry saved successfully! Opening WhatsApp to notify admin...');

      // 2. Build the WhatsApp redirect message for admin / client notification
      const dateStr = formData.eventDate ? `for date ${formData.eventDate}` : '';
      const text = `Hi Adithya Events, I just submitted an inquiry on your website!
      
Name: ${formData.name}
Phone: ${formData.phone}
Event: ${dateStr}
Inquiry Details: ${formData.message || 'Interested in event packages'}

Please review my request. Thank you!`;

      // 3. Trigger WhatsApp redirect
      const whatsappUrl = `https://wa.me/919393217676?text=${encodeURIComponent(text)}`;
      
      // Delay slightly so the success toast is readable
      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
      }, 1500);

      // Reset form
      setFormData({
        name: '',
        phone: '',
        email: '',
        eventDate: '',
        message: ''
      });
    } catch (err) {
      console.error('Lead submission error:', err);
      toast.error('Failed to submit inquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-6xl mx-auto">
      
      {/* LEFT: Quick Contact Actions Card (5 cols) */}
      <motion.div 
        initial={{ x: -30, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="lg:col-span-5 bg-amethyst/30 border border-gold/15 p-8 rounded-2xl flex flex-col justify-between shadow-xl backdrop-blur-sm text-left"
      >
        <div className="space-y-6">
          <div>
            <span className="font-accent text-2xl text-gold block mb-1">Get in Touch</span>
            <h3 className="font-display text-2xl md:text-3xl font-bold text-cream">
              Connect With Us
            </h3>
            <p className="font-body text-xs text-champagne/60 mt-2 leading-relaxed">
              We manage premium wedding decoration, multi-cuisine catering, stage decors, sound systems, and more. Choose how you want to reach out.
            </p>
          </div>

          {/* Contact Details List */}
          <div className="space-y-5 font-body text-xs text-champagne/80">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-champagne/45 font-semibold uppercase tracking-wider">Direct Call</p>
                <a href={`tel:${BUSINESS_DETAILS.phone}`} className="text-sm font-bold text-cream hover:text-gold transition-colors">
                  {BUSINESS_DETAILS.phone}
                </a>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full bg-[#25D366]/10 border border-[#25D366]/20 flex items-center justify-center text-[#25D366] shrink-0">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-champagne/45 font-semibold uppercase tracking-wider">WhatsApp chat</p>
                <a 
                  href={`https://wa.me/919393217676?text=Hi%20Adithya%20Events,%20I'd%20like%20to%20inquire%20about%20event%20planning.`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-sm font-bold text-cream hover:text-gold transition-colors"
                >
                  +91 93932 17676
                </a>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-champagne/45 font-semibold uppercase tracking-wider">Email Address</p>
                <a href={`mailto:${BUSINESS_DETAILS.email}`} className="text-sm font-bold text-cream hover:text-gold transition-colors">
                  {BUSINESS_DETAILS.email}
                </a>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold shrink-0 mt-0.5">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-champagne/45 font-semibold uppercase tracking-wider">Vijayawada Head Office</p>
                <p className="text-[11px] font-bold text-cream leading-relaxed mt-0.5">
                  {BUSINESS_DETAILS.address}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Help Note */}
        <div className="mt-8 border-t border-white/5 pt-4 flex items-center space-x-2 text-[10px] text-champagne/50">
          <HelpCircle className="w-3.5 h-3.5 text-gold/60 shrink-0" />
          <span>Average consultation duration: 15 minutes.</span>
        </div>
      </motion.div>

      {/* RIGHT: Inquiry captured form (7 cols) */}
      <motion.div 
        initial={{ x: 30, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="lg:col-span-7 bg-amethyst/20 border border-gold/10 p-8 rounded-2xl shadow-xl backdrop-blur-sm text-left"
      >
        <h4 className="font-display text-gold text-lg font-bold uppercase tracking-wider mb-2">
          Consultation Inquiry Form
        </h4>
        <p className="font-body text-xs text-champagne/60 mb-6">
          Submit details below and we will check availability, prepare decor templates, and verify quote options.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 font-body text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Your Full Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g. Lokesh Chennuru"
              required
            />
            <Input
              label="Contact Phone Number"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="e.g. 9393217676"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Email Address (Optional)"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="e.g. lokesh@mail.com"
            />
            <Input
              label="Preferred Event Date"
              name="eventDate"
              type="date"
              value={formData.eventDate}
              onChange={handleInputChange}
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label className="font-body text-xs font-semibold text-champagne/80">
              Event Details & Requirements
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              rows={4}
              placeholder="Specify requirements: e.g. Wedding mandapam, multi-cuisine catering for 500 guests, LED wall stage set, etc."
              className="w-full bg-white/5 border border-white/10 focus:border-gold/50 rounded-lg p-3 text-xs text-champagne font-body outline-none transition-colors resize-none"
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 text-xs font-bold uppercase tracking-widest flex items-center justify-center space-x-2"
            >
              <Send className="w-3.5 h-3.5 mr-2" />
              <span>{loading ? 'Submitting request...' : 'Submit Inquiry & Chat'}</span>
            </Button>
          </div>
        </form>
      </motion.div>

    </div>
  );
};

export default DualContactCard;
