// src/pages/admin/AdminDashboardPage.jsx
import React, { useState, useEffect } from 'react';
import PageTransition from '../../components/common/PageTransition';
import DashboardCards from '../../components/admin/DashboardCards';
import BookingTable from '../../components/admin/BookingTable';
import ActivityLog from '../../components/admin/ActivityLog';
import { collection, getDocs, limit, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase/config';
import Spinner from '../../components/common/Spinner';

const AdminDashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBookings: 0,
    activeBookings: 0,
    pendingBookings: 0,
    totalLeads: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [recentLogs, setRecentLogs] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Bookings
      const bookingsSnap = await getDocs(collection(db, 'bookings'));
      let totalBookings = bookingsSnap.size;
      let active = 0;
      let pending = 0;
      const bookingsList = [];
      
      bookingsSnap.forEach((doc) => {
        const data = doc.data();
        bookingsList.push({ id: doc.id, ...data });
        if (data.status === 'confirmed') active++;
        if (data.status === 'pending') pending++;
      });
      
      // Sort and slice recent
      const sortedBookings = bookingsList
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
      setRecentBookings(sortedBookings);

      // 2. Fetch Leads count
      const leadsSnap = await getDocs(collection(db, 'leads'));
      const totalLeads = leadsSnap.size;

      setStats({
        totalBookings,
        activeBookings: active,
        pendingBookings: pending,
        totalLeads
      });

      // 3. Fetch logs
      const logsQuery = query(collection(db, 'activityLogs'), orderBy('timestamp', 'desc'), limit(5));
      const logsSnap = await getDocs(logsQuery);
      const logsList = [];
      logsSnap.forEach((doc) => {
        logsList.push({ id: doc.id, ...doc.data() });
      });
      setRecentLogs(logsList);

    } catch (error) {
      console.error("Dashboard database fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="space-y-8 pb-12">
        {/* Top Cards grid */}
        <DashboardCards stats={stats} />

        {/* Tables & Logs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-display text-primaryRose text-sm font-semibold tracking-wide uppercase">
                Recent Inquiries
              </h3>
            </div>
            <BookingTable bookings={recentBookings} onRefresh={fetchData} />
          </div>

          <div>
            <ActivityLog logs={recentLogs} />
          </div>
        </div>

      </div>
    </PageTransition>
  );
};

export default AdminDashboardPage;
