// src/components/booking/PaymentStep.jsx
import React, { useState } from 'react';
import { formatCurrency } from '../../utils/formatters';
import Button from '../common/Button';
import usePayments from '../../hooks/usePayments';
import { ShieldCheck, Calendar, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';

const PaymentStep = ({ booking, onNext }) => {
  const { processPayment, processing } = usePayments();
  const [paymentOption, setPaymentOption] = useState('deposit'); // 'deposit' | 'full'

  const getPaymentAmount = () => {
    if (!booking) return 0;
    const total = parseFloat(booking.totalAmount);
    return paymentOption === 'deposit' ? total * 0.5 : total;
  };

  const handleCheckout = () => {
    const payAmount = getPaymentAmount();
    if (payAmount <= 0) return;

    processPayment(booking, payAmount, (paymentRecord) => {
      // Success Callback
      toast.success(`Success! Payment of ${formatCurrency(payAmount)} received.`);
      onNext(paymentRecord);
    });
  };

  if (!booking) {
    return (
      <div className="text-center py-10 font-body text-xs text-champagne/50">
        No confirmed booking references available.
      </div>
    );
  }

  const total = parseFloat(booking.totalAmount);

  return (
    <div className="space-y-8 max-w-xl mx-auto text-left">
      <div className="text-center">
        <h3 className="font-display text-xl font-bold text-gold">Step 5: Process Deposit Payment</h3>
        <p className="font-body text-xs text-champagne/60 mt-1">Make payment to secure and confirm your event date slot</p>
      </div>

      {/* Booking ref details */}
      <div className="bg-white/5 border border-gold/15 rounded-xl p-6 space-y-4">
        <div className="flex items-center space-x-3 text-gold">
          <Calendar className="w-5 h-5" />
          <h4 className="font-display text-sm font-semibold uppercase tracking-wide">Reserved Slot Info</h4>
        </div>
        <div className="grid grid-cols-2 gap-4 font-body text-xs text-champagne/80">
          <div>
            <span className="font-semibold text-champagne/50 block">Booking Reference ID:</span>
            <span className="font-mono font-bold text-champagne">{booking.id}</span>
          </div>
          <div>
            <span className="font-semibold text-champagne/50 block">Target Event Date:</span>
            <span className="font-bold text-champagne">{booking.eventDate}</span>
          </div>
          <div className="col-span-2">
            <span className="font-semibold text-champagne/50 block">Event Location:</span>
            <span className="font-bold text-champagne">{booking.venueName}</span>
          </div>
        </div>
      </div>

      {/* Choose payment amount */}
      <div className="bg-white/5 border border-white/5 rounded-xl p-6 space-y-4">
        <h4 className="font-display text-gold text-sm font-semibold border-b border-white/5 pb-2">Select Payment Amount</h4>
        
        <div className="space-y-3">
          <label className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${
            paymentOption === 'deposit' ? 'border-gold bg-gold/5' : 'border-white/5 bg-white/5'
          }`}>
            <div className="flex items-center">
              <input
                type="radio"
                name="paymentOption"
                checked={paymentOption === 'deposit'}
                onChange={() => setPaymentOption('deposit')}
                className="mr-3 border-white/10 text-gold bg-charcoal focus:ring-0 focus:ring-offset-0 cursor-pointer"
              />
              <div className="flex flex-col">
                <span className="font-body text-xs font-semibold text-champagne">50% Booking Deposit</span>
                <span className="font-body text-[10px] text-champagne/50 mt-0.5">Required advance to confirm reservation slot</span>
              </div>
            </div>
            <span className="font-display text-sm font-bold text-gold">{formatCurrency(total * 0.5)}</span>
          </label>

          <label className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${
            paymentOption === 'full' ? 'border-gold bg-gold/5' : 'border-white/5 bg-white/5'
          }`}>
            <div className="flex items-center">
              <input
                type="radio"
                name="paymentOption"
                checked={paymentOption === 'full'}
                onChange={() => setPaymentOption('full')}
                className="mr-3 border-white/10 text-gold bg-charcoal focus:ring-0 focus:ring-offset-0 cursor-pointer"
              />
              <div className="flex flex-col">
                <span className="font-body text-xs font-semibold text-champagne">Full Payment Invoice</span>
                <span className="font-body text-[10px] text-champagne/50 mt-0.5">Settle entire cost estimate upfront</span>
              </div>
            </div>
            <span className="font-display text-sm font-bold text-gold">{formatCurrency(total)}</span>
          </label>
        </div>
      </div>

      {/* Gateway triggers */}
      <div className="bg-white/5 border border-white/5 rounded-xl p-6 flex flex-col items-center text-center space-y-4">
        <div className="flex items-center space-x-2 text-success font-body text-xs font-semibold">
          <ShieldCheck className="w-5 h-5" />
          <span>Secure Payments Powered by Razorpay Gateway</span>
        </div>
        <p className="font-body text-[10px] text-champagne/55 leading-relaxed max-w-md">
          Payments are secured via standard protocols. You can verify transaction confirmations inside the tracking panels.
        </p>
        
        <Button
          onClick={handleCheckout}
          disabled={processing}
          className="w-full py-3.5 text-xs font-bold uppercase tracking-widest flex items-center justify-center space-x-2 mt-2"
        >
          <CreditCard className="w-4 h-4 mr-2" />
          <span>{processing ? 'Processing Checkout SDK...' : `Pay ${formatCurrency(getPaymentAmount())}`}</span>
        </Button>
      </div>

    </div>
  );
};

export default PaymentStep;
