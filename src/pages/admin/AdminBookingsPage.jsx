// src/pages/admin/AdminBookingsPage.jsx
import React, { useState, useEffect } from 'react';
import PageTransition from '../../components/common/PageTransition';
import BookingTable from '../../components/admin/BookingTable';
import Spinner from '../../components/common/Spinner';
import Card from '../../components/common/Card';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';

const AdminBookingsPage = () => {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('all'); // all, pending, confirmed, completed, cancelled
  const [search, setSearch] = useState('');

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'bookings'));
      const list = [];
      snap.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      // Sort desc by date
      setBookings(list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const filteredBookings = bookings.filter((b) => {
    const customerName = b.customerName || b.name || '';
    const bookingId = b.id || '';
    const matchesFilter = filter === 'all' || b.status === filter;
    const matchesSearch = customerName.toLowerCase().includes(search.toLowerCase()) ||
                          bookingId.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <PageTransition>
      <div className="space-y-6 pb-12 text-left">
        
        {/* Filter segment */}
        <Card className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4" hoverEffect={false}>
          <div className="flex space-x-2 overflow-x-auto pb-1 md:pb-0">
            {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  filter === f
                    ? 'bg-gold text-charcoal'
                    : 'bg-white/5 hover:bg-white/10 text-champagne border border-white/10'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name or ID..."
            className="input-premium py-1.5 px-3 max-w-xs text-xs"
          />
        </Card>

        {loading ? (
          <div className="py-12 flex justify-center">
            <Spinner size="lg" />
          </div>
        ) : (
          <BookingTable bookings={filteredBookings} onRefresh={fetchBookings} />
        )}

      </div>
    </PageTransition>
  );
};

export default AdminBookingsPage;
