// src/components/booking/BookingSuccess.jsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../../utils/formatters';
import { generateReceiptPDF } from '../../utils/receiptGenerator';
import Button from '../common/Button';
import confetti from 'canvas-confetti';
import { CheckCircle, Download, FileText, ArrowRight } from 'lucide-react';

const BookingSuccess = ({ booking, payment }) => {
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

  const handleDownloadReceipt = () => {
    if (!booking || !payment) return;
    generateReceiptPDF(payment, booking);
  };

  if (!booking) {
    return (
      <div className="text-center py-10 font-body text-xs text-champagne/50">
        Booking records unavailable.
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-xl mx-auto text-center">
      {/* Success Badge */}
      <div className="flex flex-col items-center">
        <CheckCircle className="w-16 h-16 text-success animate-scaleInBounce mb-4" />
        <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-ivory">
          Event Slot Confirmed!
        </h3>
        <p className="font-body text-xs text-gold uppercase tracking-widest mt-1">
          Thank you for choosing Adithya Events
        </p>
      </div>

      {/* Confirmation details summary box */}
      <div className="bg-white/5 border border-gold/15 rounded-xl p-6 text-left space-y-4">
        <h4 className="font-display text-gold text-sm font-semibold border-b border-white/5 pb-2">
          Receipt Invoice Summary
        </h4>
        <div className="grid grid-cols-2 gap-y-3 gap-x-4 font-body text-xs text-champagne/80">
          <div>
            <span className="font-semibold text-champagne/50 block">Booking Reference ID:</span>
            <span className="font-mono font-bold text-champagne">{booking.id}</span>
          </div>
          <div>
            <span className="font-semibold text-champagne/50 block">Transaction Reference ID:</span>
            <span className="font-mono font-bold text-champagne">{payment?.transactionId || 'SANDBOX_TXN'}</span>
          </div>
          <div>
            <span className="font-semibold text-champagne/50 block">Reserved Event Date:</span>
            <span className="font-bold text-champagne">{booking.eventDate}</span>
          </div>
          <div>
            <span className="font-semibold text-champagne/50 block">Payment Amount Paid:</span>
            <span className="font-bold text-success font-display text-sm">{formatCurrency(payment?.amount || 0)}</span>
          </div>
        </div>
      </div>

      {/* Control Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        {payment && (
          <button
            onClick={handleDownloadReceipt}
            className="w-full sm:w-auto px-6 py-3 border border-gold/25 text-gold hover:bg-gold hover:text-charcoal rounded-lg font-body text-xs font-bold uppercase tracking-widest flex items-center justify-center transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 mr-2" />
            <span>Download Invoice PDF</span>
          </button>
        )}

        <Link
          to="/track-booking"
          className="w-full sm:w-auto btn-premium btn-gold py-3 px-8 text-xs font-bold uppercase tracking-widest flex items-center justify-center"
        >
          <span>Track Booking Status</span>
          <ArrowRight className="w-4 h-4 ml-2" />
        </Link>
      </div>

      <p className="font-body text-[10px] text-champagne/50 leading-relaxed">
        A confirmation receipt copy was saved to your transaction profile. We will contact you at {booking.customerPhone} soon.
      </p>

    </div>
  );
};

export default BookingSuccess;
