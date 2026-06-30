// src/components/admin/DashboardCards.jsx
import React from 'react';
import { Calendar, Users, ClipboardCheck, Clock } from 'lucide-react';

const DashboardCards = ({ stats }) => {
  const cards = [
    {
      title: 'Total Bookings',
      value: stats?.totalBookings || 0,
      icon: <Calendar className="w-5 h-5 text-primaryRose" />,
      desc: 'All registered inquiries'
    },
    {
      title: 'Active Bookings',
      value: stats?.activeBookings || 0,
      icon: <ClipboardCheck className="w-5 h-5 text-primaryRose" />,
      desc: 'Confirmed slot listings'
    },
    {
      title: 'Pending Requests',
      value: stats?.pendingBookings || 0,
      icon: <Clock className="w-5 h-5 text-primaryRose" />,
      desc: 'Slots awaiting review'
    },
    {
      title: 'CRM Lead Enquiries',
      value: stats?.totalLeads || 0,
      icon: <Users className="w-5 h-5 text-primaryRose" />,
      desc: 'Contacts requests archived'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((c, i) => (
        <div key={i} className="admin-card-stat p-6 flex items-center justify-between">
          <div className="space-y-1 text-left">
            <span className="font-body text-[10px] text-textSecondary uppercase tracking-widest block font-bold">{c.title}</span>
            <span className="font-display text-2xl font-extrabold text-textPrimary block">{c.value}</span>
            <span className="font-body text-[10px] text-textSecondary/80 block">{c.desc}</span>
          </div>
          <div className="p-3 bg-primaryRose/5 border border-primaryRose/20 rounded-lg shrink-0 ml-4">
            {c.icon}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardCards;
