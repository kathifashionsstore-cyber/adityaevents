// src/components/booking/BookingSuccess.jsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { generateBookingQuotationPDF } from '../../utils/pdfGenerator';
import confetti from 'canvas-confetti';
import { CheckCircle, Download, ArrowRight, MessageSquare } from 'lucide-react';

const BookingSuccess = ({ booking }) => {
  useEffect(() => {
    // Fire confetti bursts
    const duration = 2 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#D4AF37', '#FFD700', '#F7E7CE']
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#D4AF37', '#FFD700', '#F7E7CE']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  }, []);

  const handleDownloadDetails = () => {
    if (!booking) return;
    generateBookingQuotationPDF(booking);
  };

  const handleWhatsAppChat = () => {
    if (!booking) return;
    const message = `Namaste, I just submitted a booking request for my *${booking.eventType}* on *${booking.eventDate}* at *${booking.venueName}*. Booking Ref: *${booking.id}*. Please share the custom quote.`;
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/919393217676?text=${encoded}`, '_blank');
  };

  if (!booking) {
    return (
      <div className="text-center py-10 font-body text-xs text-champagne/50">
        Booking request details unavailable.
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-xl mx-auto text-center">
      {/* Success Badge */}
      <div className="flex flex-col items-center">
        <CheckCircle className="w-16 h-16 text-success animate-scaleInBounce mb-4" />
        <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-ivory">
          Booking Slot Requested!
        </h3>
        <p className="font-body text-xs text-gold uppercase tracking-widest mt-1">
          Thank you for choosing Adithya Events
        </p>
      </div>

      {/* Confirmation details summary box */}
      <div className="bg-white/5 border border-gold/15 rounded-xl p-6 text-left space-y-4">
        <h4 className="font-display text-gold text-sm font-semibold border-b border-white/5 pb-2">
          Request parameters Summary
        </h4>
        <div className="grid grid-cols-2 gap-y-3 gap-x-4 font-body text-xs text-champagne/80">
          <div>
            <span className="font-semibold text-champagne/50 block">Booking Reference ID:</span>
            <span className="font-mono font-bold text-champagne">{booking.id}</span>
          </div>
          <div>
            <span className="font-semibold text-champagne/50 block">Customer Name:</span>
            <span className="font-bold text-champagne">{booking.customerName}</span>
          </div>
          <div>
            <span className="font-semibold text-champagne/50 block">Reserved Event Date:</span>
            <span className="font-bold text-champagne">{booking.eventDate}</span>
          </div>
          <div>
            <span className="font-semibold text-champagne/50 block">Venue Location:</span>
            <span className="font-bold text-champagne">{booking.venueName}</span>
          </div>
        </div>
      </div>

      {/* Control Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={handleWhatsAppChat}
          className="w-full sm:w-auto px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-body text-xs font-bold uppercase tracking-widest flex items-center justify-center transition-all cursor-pointer shadow-lg shadow-green-600/10"
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          <span>Confirm via WhatsApp</span>
        </button>

        <button
          onClick={handleDownloadDetails}
          className="w-full sm:w-auto px-6 py-3 border border-gold/25 text-gold hover:bg-gold hover:text-charcoal rounded-lg font-body text-xs font-bold uppercase tracking-widest flex items-center justify-center transition-all cursor-pointer"
        >
          <Download className="w-4 h-4 mr-2" />
          <span>Download Summary PDF</span>
        </button>

        <Link
          to="/track-booking"
          className="w-full sm:w-auto btn-premium btn-gold py-3 px-8 text-xs font-bold uppercase tracking-widest flex items-center justify-center"
        >
          <span>Track Status</span>
          <ArrowRight className="w-4 h-4 ml-2" />
        </Link>
      </div>

      <p className="font-body text-[10px] text-champagne/50 leading-relaxed">
        Your slot is temporarily held. Click "Confirm via WhatsApp" to share details with our team and finalize the custom design package.
      </p>
    </div>
  );
};

export default BookingSuccess;
