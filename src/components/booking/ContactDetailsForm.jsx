// src/components/booking/ContactDetailsForm.jsx
import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import Input from '../common/Input';
import Button from '../common/Button';
import toast from 'react-hot-toast';
import { Camera, Music, Video, Wind } from 'lucide-react';

const ContactDetailsForm = ({ onNext, onPrev }) => {
  const { eventDetails, setEventDetails } = useCart();
  const [localDetails, setLocalDetails] = useState({ ...eventDetails });
  
  const [customerName, setCustomerName] = useState(eventDetails.customerName || '');
  const [customerPhone, setCustomerPhone] = useState(eventDetails.customerPhone || '');
  const [customerEmail, setCustomerEmail] = useState(eventDetails.customerEmail || '');

  const handleDetailsChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLocalDetails((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!customerName || !customerPhone) {
      toast.error('Client name and phone number are required.');
      return;
    }
    setEventDetails({
      ...localDetails,
      customerName,
      customerPhone,
      customerEmail
    });
    onNext();
  };

  const addonsList = [
    { id: 'photography', label: 'Candid Photography', icon: <Camera className="w-5 h-5" />, desc: 'Traditional & Candid photos (+₹15,000)' },
    { id: 'videography', label: 'Cinematic Videography', icon: <Video className="w-5 h-5" />, desc: 'Teasers & Wedding films (+₹20,000)' },
    { id: 'droneFootage', label: 'Aerial Drone 4K', icon: <Wind className="w-5 h-5" />, desc: '4K drone coverage (+₹10,000)' },
    { id: 'soundSystemDJ', label: 'DJ System & Dancefloor', icon: <Music className="w-5 h-5" />, desc: 'Premium audio & LED dance floor (+₹12,000)' }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl mx-auto text-left">
      <div className="text-center">
        <h3 className="font-display text-xl font-bold text-gold">Step 3: Client Contact & Media Addons</h3>
        <p className="font-body text-xs text-champagne/60 mt-1">Provide your details and select media coverage preferences</p>
      </div>

      {/* Client Profile */}
      <div className="bg-white/5 border border-white/5 rounded-xl p-6 space-y-4">
        <h4 className="font-display text-gold text-sm font-semibold border-b border-white/5 pb-2">Client Details</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            name="customerName"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="e.g. Adithya Events"
            required
          />
          <Input
            label="Phone Number"
            name="customerPhone"
            type="tel"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            placeholder="e.g. 9393217676"
            required
          />
        </div>
        <Input
          label="Email Address"
          name="customerEmail"
          type="email"
          value={customerEmail}
          onChange={(e) => setCustomerEmail(e.target.value)}
          placeholder="e.g. billing@adithyaevents.com"
        />
      </div>

      {/* Media Addons */}
      <div className="bg-white/5 border border-white/5 rounded-xl p-6 space-y-4">
        <h4 className="font-display text-gold text-sm font-semibold border-b border-white/5 pb-2">Addon Enhancements</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {addonsList.map((addon) => {
            const checked = !!localDetails[addon.id];
            return (
              <label
                key={addon.id}
                className={`flex items-start p-4 border rounded-lg cursor-pointer transition-all duration-300 ${
                  checked ? 'border-gold bg-gold/5' : 'border-white/5 bg-white/5 hover:border-white/20'
                }`}
              >
                <input
                  type="checkbox"
                  name={addon.id}
                  checked={checked}
                  onChange={handleDetailsChange}
                  className="mt-1 mr-3 rounded border-white/10 text-gold bg-charcoal focus:ring-0 focus:ring-offset-0 cursor-pointer animate-scaleIn"
                />
                <div className="flex flex-col">
                  <span className="font-body text-xs font-semibold text-champagne flex items-center space-x-1.5">
                    {addon.icon}
                    <span>{addon.label}</span>
                  </span>
                  <span className="font-body text-[10px] text-champagne/60 mt-1">{addon.desc}</span>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between pt-4">
        <Button onClick={onPrev} variant="outline" className="px-6 py-2.5 text-xs uppercase tracking-wider font-semibold">
          Back
        </Button>
        <Button type="submit" className="px-8 py-2.5 text-xs uppercase tracking-wider font-semibold">
          Next Step
        </Button>
      </div>
    </form>
  );
};

export default ContactDetailsForm;
