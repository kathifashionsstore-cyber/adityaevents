// src/components/booking/BookingTracker.jsx
import React, { useState } from 'react';
import { getBooking } from '../../services/bookingService';
import { formatCurrency } from '../../utils/formatters';
import { formatDateString } from '../../utils/dateHelpers';
import Input from '../common/Input';
import Button from '../common/Button';
import Badge from '../common/Badge';
import Card from '../common/Card';
import toast from 'react-hot-toast';
import { Search, MapPin, Calendar, Clock, CreditCard, ClipboardCheck } from 'lucide-react';

const BookingTracker = () => {
  const [bookingId, setBookingId] = useState('');
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!bookingId.trim()) return;

    setLoading(true);
    setBooking(null);
    try {
      const data = await getBooking(bookingId.trim().toUpperCase());
      setBooking(data);
      toast.success('Booking status loaded!');
    } catch (err) {
      console.error(err);
      toast.error('Booking ID not found. Verify the reference key format.');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { title: 'Inquiry Submitted', statusKey: 'pending', desc: 'Booking request registered in database' },
    { title: 'Advance Paid', statusKey: 'confirmed', desc: 'Advance deposit cleared and slot reserved' },
    { title: 'Decor Finalization', statusKey: 'decor_setup', desc: 'Decorators and stage parameters locked' },
    { title: 'Event Celebration', statusKey: 'completed', desc: 'Catering and decorators successfully completed' }
  ];

  const getStepStatus = (stepIdx, currentStatus) => {
    const statusOrder = ['pending', 'confirmed', 'completed'];
    const currentIdx = statusOrder.indexOf(currentStatus);
    
    // Custom check: if confirmed, we can say stage is confirmed too
    if (currentStatus === 'confirmed' && stepIdx <= 1) return 'completed';
    if (currentStatus === 'completed' && stepIdx <= 3) return 'completed';
    if (currentStatus === 'cancelled') return 'cancelled';
    
    return stepIdx <= currentIdx ? 'completed' : 'pending';
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto text-left">
      {/* Search form */}
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-end space-y-3 sm:space-y-0 sm:space-x-4 w-full bg-white/5 p-6 rounded-xl border border-white/5">
        <Input
          label="Booking Reference ID"
          name="bookingId"
          value={bookingId}
          onChange={(e) => setBookingId(e.target.value)}
          placeholder="e.g. AE-20260604-1234"
          required
          className="text-left"
        />
        <Button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto h-[48px] px-8 text-xs uppercase font-bold tracking-widest flex items-center justify-center shrink-0"
        >
          <Search className="w-4 h-4 mr-2" />
          <span>{loading ? 'Searching...' : 'Track Slot'}</span>
        </Button>
      </form>

      {booking && (
        <div className="space-y-8 animate-fadeIn">
          {/* Booking Overview Card */}
          <Card className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 relative" hoverEffect={false}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-gold text-sm">{booking.id}</span>
                <Badge status={booking.status === 'completed' ? 'success' : booking.status === 'cancelled' ? 'danger' : 'info'}>
                  {booking.status.toUpperCase()}
                </Badge>
              </div>

              <div className="space-y-2.5 font-body text-xs text-champagne/80">
                <p className="text-base font-bold text-champagne">{booking.customerName}</p>
                <p className="flex items-center"><Calendar className="w-4 h-4 text-gold mr-2 shrink-0" /> {formatDateString(booking.eventDate)}</p>
                <p className="flex items-center"><Clock className="w-4 h-4 text-gold mr-2 shrink-0" /> {booking.eventTime} IST</p>
                <p className="flex items-center"><MapPin className="w-4 h-4 text-gold mr-2 shrink-0" /> {booking.venueName}, {booking.city}</p>
              </div>
            </div>

            <div className="border-t md:border-t-0 md:border-l border-white/5 pt-4 md:pt-0 md:pl-6 space-y-3 text-right flex flex-col justify-between items-end">
              <div>
                <span className="font-body text-[10px] text-champagne/50 block">Payment Balance Status:</span>
                <Badge status={booking.paymentStatus === 'fully_paid' ? 'success' : 'warning'}>
                  {booking.paymentStatus.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>

              <div className="space-y-1">
                <p className="font-body text-[10px] text-champagne/60">Total Amount: <span className="font-bold text-champagne">{formatCurrency(booking.totalAmount)}</span></p>
                <p className="font-body text-[10px] text-champagne/60">Paid So Far: <span className="font-bold text-success">{formatCurrency(booking.paidAmount || 0)}</span></p>
                <p className="font-body text-[10px] text-champagne/60">Remaining Due: <span className="font-bold text-gold">{formatCurrency(booking.totalAmount - (booking.paidAmount || 0))}</span></p>
              </div>
            </div>
          </Card>

          {/* Timeline tracking roadmap */}
          <Card className="p-8" hoverEffect={false}>
            <h4 className="font-display text-gold text-sm font-semibold border-b border-white/5 pb-2 mb-8">
              Event Tracking Timeline
            </h4>
            
            <div className="relative border-l border-white/10 pl-6 ml-2 space-y-8 font-body text-xs">
              {steps.map((step, idx) => {
                const status = getStepStatus(idx, booking.status);
                const isDone = status === 'completed';
                const isCancelled = status === 'cancelled';
                return (
                  <div key={idx} className="relative">
                    {/* Circle Node */}
                    <div className={`absolute -left-[31px] top-0 w-4 h-4 rounded-full border-2 transition-colors ${
                      isCancelled ? 'bg-danger border-danger' : isDone ? 'bg-gold border-gold' : 'bg-charcoal border-white/20'
                    }`} />
                    
                    <div className="flex flex-col">
                      <span className={`font-semibold text-sm ${isCancelled ? 'text-danger' : isDone ? 'text-gold' : 'text-champagne/50'}`}>
                        {step.title}
                      </span>
                      <span className="text-[10px] text-champagne/60 mt-0.5">{step.desc}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Booking Logs */}
          <Card className="p-6" hoverEffect={false}>
            <h4 className="font-display text-gold text-sm font-semibold border-b border-white/5 pb-2 mb-4">
              Operation Logs & History
            </h4>
            <div className="space-y-3 font-body text-[11px] text-champagne/70 max-h-48 overflow-y-auto pr-2">
              {booking.logs?.map((log, i) => (
                <div key={i} className="flex justify-between items-start border-b border-white/5 pb-2">
                  <div className="space-y-0.5">
                    <p className="font-semibold text-champagne">{log.message}</p>
                    <p className="text-[9px] text-champagne/45">By {log.user}</p>
                  </div>
                  <span className="text-[9px] text-champagne/40 shrink-0 ml-4">
                    {new Date(log.timestamp).toLocaleDateString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default BookingTracker;
