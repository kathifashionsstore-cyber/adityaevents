// src/components/booking/QuoteReview.jsx
import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/formatters';
import Button from '../common/Button';
import Input from '../common/Input';
import toast from 'react-hot-toast';
import { generateBookingQuotationPDF } from '../../utils/pdfGenerator';
import { FileText, Tag, Trash } from 'lucide-react';
import { createBooking } from '../../services/bookingService';

const QuoteReview = ({ onNext, onPrev, onBookingCreated }) => {
  const { selectedPackage, cateringDetails, eventDetails, appliedCoupon, pricing, applyCouponCode, removeCoupon } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [validating, setValidating] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode) return;
    setValidating(true);
    const res = await applyCouponCode(couponCode);
    setValidating(false);
    
    if (res.success) {
      toast.success(res.message);
      setCouponCode('');
    } else {
      toast.error(res.message);
    }
  };

  const handleDownloadQuote = () => {
    const mockBookingData = {
      customerName: eventDetails.customerName,
      customerPhone: eventDetails.customerPhone,
      customerEmail: eventDetails.customerEmail,
      eventType: eventDetails.eventType,
      eventDate: eventDetails.eventDate,
      venueName: eventDetails.venueName,
      packageName: selectedPackage?.name || 'Custom Decor',
      stageDecoration: eventDetails.stageDecoration,
      vegGuests: cateringDetails.vegGuests,
      nonVegGuests: cateringDetails.nonVegGuests,
      couponCode: appliedCoupon?.code || ''
    };
    generateBookingQuotationPDF(mockBookingData, pricing);
  };

  const handleConfirmBooking = async () => {
    setSaving(true);
    try {
      const bookingInput = {
        customerName: eventDetails.customerName,
        customerPhone: eventDetails.customerPhone,
        customerEmail: eventDetails.customerEmail,
        eventType: eventDetails.eventType,
        eventDate: eventDetails.eventDate,
        eventTime: eventDetails.eventTime,
        venueName: eventDetails.venueName,
        venueAddress: eventDetails.venueAddress,
        city: eventDetails.city,
        packageName: selectedPackage?.name || 'Custom Decor',
        stageDecoration: eventDetails.stageDecoration,
        photography: eventDetails.photography,
        videography: eventDetails.videography,
        droneFootage: eventDetails.droneFootage,
        soundSystemDJ: eventDetails.soundSystemDJ,
        cateringEnabled: cateringDetails.enabled,
        vegGuests: cateringDetails.vegGuests,
        nonVegGuests: cateringDetails.nonVegGuests,
        couponCode: appliedCoupon?.code || '',
        notes: ''
      };

      const booking = await createBooking(bookingInput, pricing);
      toast.success('Booking reference generated successfully!');
      onBookingCreated(booking);
      onNext();
    } catch (e) {
      console.error("Booking save error:", e);
      toast.error('Failed to register booking in database.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto text-left">
      <div className="text-center">
        <h3 className="font-display text-xl font-bold text-gold">Step 4: Review Booking Details</h3>
        <p className="font-body text-xs text-champagne/60 mt-1">Review your event customization parameters before submitting the inquiry</p>
      </div>

      <div className="bg-white/5 border border-white/5 rounded-xl p-6 space-y-6">
        <h4 className="font-display text-gold text-sm font-semibold border-b border-white/5 pb-2">Event Parameters Summary</h4>
        
        {/* Param details list */}
        <div className="grid grid-cols-2 gap-y-4 gap-x-6 font-body text-xs text-champagne/80">
          <div>
            <span className="font-semibold text-champagne/50 block">Customer Name</span>
            <span className="text-sm font-bold text-champagne">{eventDetails.customerName}</span>
          </div>
          <div>
            <span className="font-semibold text-champagne/50 block">Contact Phone</span>
            <span className="text-sm font-bold text-champagne">{eventDetails.customerPhone}</span>
          </div>
          <div>
            <span className="font-semibold text-champagne/50 block">Event Type</span>
            <span className="text-sm font-bold text-champagne capitalize">{eventDetails.eventType}</span>
          </div>
          <div>
            <span className="font-semibold text-champagne/50 block">Event Date</span>
            <span className="text-sm font-bold text-champagne">{eventDetails.eventDate}</span>
          </div>
          <div>
            <span className="font-semibold text-champagne/50 block">Event Time</span>
            <span className="text-sm font-bold text-champagne">{eventDetails.eventTime || '18:00'}</span>
          </div>
          <div>
            <span className="font-semibold text-champagne/50 block">Venue Location</span>
            <span className="text-sm font-bold text-champagne">{eventDetails.venueName}</span>
          </div>
          <div>
            <span className="font-semibold text-champagne/50 block">Decor Stage Option</span>
            <span className="text-sm font-bold text-champagne capitalize">{eventDetails.stageDecoration} Decor</span>
          </div>
          <div>
            <span className="font-semibold text-champagne/50 block">Base Package</span>
            <span className="text-sm font-bold text-champagne">{selectedPackage?.name || 'Custom Decor'}</span>
          </div>
          {cateringDetails.enabled && (
            <div className="col-span-2">
              <span className="font-semibold text-champagne/50 block">Gourmet Catering Plates</span>
              <span className="text-sm font-bold text-champagne">
                {cateringDetails.vegGuests} Veg Plates • {cateringDetails.nonVegGuests} Non-Veg Plates
              </span>
            </div>
          )}
          <div className="col-span-2">
            <span className="font-semibold text-champagne/50 block">Add-ons Selected</span>
            <span className="text-sm font-bold text-champagne">
              {[
                eventDetails.photography && 'Photography',
                eventDetails.videography && 'Videography',
                eventDetails.droneFootage && 'Drone Footage',
                eventDetails.soundSystemDJ && 'Sound & DJ'
              ].filter(Boolean).join(' • ') || 'None'}
            </span>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-gold/25 bg-gold/5 p-4 font-body text-xs text-champagne/80">
        <p className="font-semibold text-gold">Pricing Notice</p>
        <p className="mt-1 leading-relaxed">
          Adithya Event Management designs customized, premium events. Pricing is calculated post-inquiry based on exact requirements, venue size, and floral specifications. A sales manager will WhatsApp/call you within 2 hours to share your custom quote.
        </p>
      </div>

      {/* Control Actions */}
      <div className="flex items-center justify-between gap-4 pt-4">
        <Button onClick={onPrev} variant="outline" className="px-6 py-2.5 text-xs uppercase tracking-wider font-semibold">
          Back
        </Button>
        
        <Button
          onClick={handleConfirmBooking}
          disabled={saving}
          className="px-8 py-3 text-xs uppercase tracking-widest font-bold"
        >
          {saving ? 'Submitting Inquiry...' : 'Submit Booking Request'}
        </Button>
      </div>
    </div>
  );
};

export default QuoteReview;
