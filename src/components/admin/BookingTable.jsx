import React from 'react';
import { formatDateString } from '../../utils/dateHelpers';
import Badge from '../common/Badge';
import Table from '../common/Table';
import EmptyState from '../common/EmptyState';
import { Check, X, Calendar } from 'lucide-react';
import { updateBookingStatus } from '../../services/bookingService';
import toast from 'react-hot-toast';

const BookingTable = ({ bookings = [], onRefresh }) => {

  const handleUpdateStatus = async (bookingId, status) => {
    try {
      await updateBookingStatus(bookingId, status, 'Manager');
      toast.success(`Booking status changed to ${status}`);
      if (onRefresh) onRefresh();
    } catch (e) {
      console.error(e);
      toast.error('Failed to change booking status.');
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'completed') return <Badge status="success">Completed</Badge>;
    if (status === 'confirmed') return <Badge status="info">Confirmed</Badge>;
    if (status === 'cancelled') return <Badge status="danger">Cancelled</Badge>;
    return <Badge status="warning">Pending</Badge>;
  };

  if (bookings.length === 0) {
    return <EmptyState message="No booking logs found." subtext="No customers have placed slot inquiries yet." />;
  }

  return (
    <Table headers={['Booking ID', 'Client Name', 'Event Date', 'Venue', 'Event Type', 'Status', 'Actions']}>
      {bookings.map((booking) => (
        <tr key={booking.id}>
          <td className="font-mono text-xs font-bold text-gold">{booking.id || 'N/A'}</td>
          <td>
            <div className="flex flex-col text-left">
              <span className="font-semibold text-champagne">{booking.customerName || booking.name || 'Unknown customer'}</span>
              <span className="text-[10px] text-champagne/50">{booking.customerPhone || booking.phone || 'No phone'}</span>
            </div>
          </td>
          <td>
            <div className="flex items-center space-x-1.5 text-xs text-champagne">
              <Calendar className="w-3.5 h-3.5 text-gold" />
              <span>{formatDateString(booking.eventDate)}</span>
            </div>
          </td>
          <td className="text-xs text-champagne/80 truncate max-w-40">{booking.venueName || booking.venue || 'Not specified'}</td>
          <td className="text-xs capitalize text-champagne/85">{booking.eventType || 'wedding'}</td>
          <td>{getStatusBadge(booking.status)}</td>
          <td>
            <div className="flex items-center space-x-2">
              {booking.status === 'pending' && (
                <>
                  <button
                    onClick={() => handleUpdateStatus(booking.id, 'confirmed')}
                    className="p-1.5 bg-success/15 border border-success/35 text-success rounded-lg hover:bg-success hover:text-velvet transition-all cursor-pointer"
                    title="Confirm Booking"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(booking.id, 'cancelled')}
                    className="p-1.5 bg-danger/15 border border-danger/35 text-danger rounded-lg hover:bg-danger hover:text-velvet transition-all cursor-pointer"
                    title="Cancel Booking"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </>
              )}
              {booking.status === 'confirmed' && (
                <button
                  onClick={() => handleUpdateStatus(booking.id, 'completed')}
                  className="p-1.5 bg-success/15 border border-success/35 text-success rounded-lg hover:bg-success hover:text-velvet transition-all cursor-pointer"
                  title="Mark Completed"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </td>
        </tr>
      ))}
    </Table>
  );
};

export default BookingTable;
