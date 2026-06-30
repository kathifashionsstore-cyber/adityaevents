// src/pages/admin/AdminLeadsPage.jsx
import React, { useState, useEffect } from 'react';
import PageTransition from '../../components/common/PageTransition';
import Spinner from '../../components/common/Spinner';
import Table from '../../components/common/Table';
import EmptyState from '../../components/common/EmptyState';
import Badge from '../../components/common/Badge';
import { getLeads, updateLeadStatus } from '../../services/leadService';
import { formatDateString } from '../../utils/dateHelpers';
import toast from 'react-hot-toast';
import { Check, PhoneCall, Trash2, CalendarCheck } from 'lucide-react';
import { doc, deleteDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';

const AdminLeadsPage = () => {
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState([]);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const list = await getLeads();
      setLeads(list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleUpdateStatus = async (leadId, status) => {
    try {
      await updateLeadStatus(leadId, status);
      toast.success(`Lead status updated to ${status}`);
      fetchLeads();
    } catch (err) {
      console.error(err);
      toast.error('Failed to change lead status.');
    }
  };

  const handleConvertToBooking = async (lead) => {
    try {
      const bookingId = 'BK_' + Math.random().toString(36).substring(2, 9).toUpperCase();
      
      // Save official booking to /bookings
      await setDoc(doc(db, 'bookings', bookingId), {
        id: bookingId,
        customerName: lead.name,
        customerPhone: lead.phone,
        customerEmail: lead.email || '',
        eventDate: lead.eventDate || new Date().toISOString().split('T')[0],
        venueName: 'Consultation Scheduled',
        status: 'confirmed',
        createdAt: new Date().toISOString()
      });

      // Update lead status to qualified
      await updateLeadStatus(lead.id, 'qualified');
      
      toast.success('Converted to Confirmed Booking!');
      fetchLeads();
    } catch (err) {
      console.error(err);
      toast.error('Failed to convert to booking.');
    }
  };

  const handleDeleteLead = async (leadId) => {
    if (!window.confirm("Are you sure you want to delete this lead inquiry?")) return;
    try {
      await deleteDoc(doc(db, 'leads', leadId));
      toast.success("Lead inquiry deleted.");
      fetchLeads();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete lead.");
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'qualified') return <Badge status="success">Qualified / Booked</Badge>;
    if (status === 'contacting') return <Badge status="warning">Contacting</Badge>;
    if (status === 'lost') return <Badge status="danger">Lost</Badge>;
    return <Badge status="info">New Inquiry</Badge>;
  };

  return (
    <PageTransition>
      <div className="space-y-6 pb-12 text-left">
        <h3 className="font-display text-champagne text-sm font-semibold tracking-wide uppercase">
          CRM Client Leads Inquiries
        </h3>

        {loading ? (
          <div className="py-12 flex justify-center">
            <Spinner size="lg" />
          </div>
        ) : leads.length === 0 ? (
          <EmptyState message="No lead inquiries archived." subtext="Inquiries from the website Contact page appear here." />
        ) : (
          <Table headers={['Date', 'Customer Info', 'Event Date', 'Message Details', 'Status', 'Actions']}>
            {leads.map((lead) => (
              <tr key={lead.id}>
                <td className="text-xs text-champagne/60">{formatDateString(lead.createdAt)}</td>
                <td>
                  <div className="flex flex-col text-left">
                    <span className="font-semibold text-champagne">{lead.name}</span>
                    <span className="text-[10px] text-champagne/50">{lead.phone}</span>
                    {lead.email && <span className="text-[9px] text-gold/80">{lead.email}</span>}
                  </div>
                </td>
                <td className="text-xs text-champagne/80">{lead.eventDate ? formatDateString(lead.eventDate) : 'Not specified'}</td>
                <td className="text-xs text-champagne/70 max-w-xs truncate" title={lead.message}>
                  {lead.message || 'Pricing download request'}
                </td>
                <td>{getStatusBadge(lead.status)}</td>
                <td>
                  <div className="flex items-center space-x-2">
                    {lead.status === 'new' && (
                      <button
                        onClick={() => handleUpdateStatus(lead.id, 'contacting')}
                        className="p-1.5 bg-warning/15 border border-warning/35 text-warning rounded-lg hover:bg-warning hover:text-velvet transition-all cursor-pointer"
                        title="Mark Contacting"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {['new', 'contacting'].includes(lead.status) && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(lead.id, 'qualified')}
                          className="p-1.5 bg-success/15 border border-success/35 text-success rounded-lg hover:bg-success hover:text-velvet transition-all cursor-pointer"
                          title="Mark Qualified"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleConvertToBooking(lead)}
                          className="p-1.5 bg-gold/15 border border-gold/35 text-gold rounded-lg hover:bg-gold hover:text-velvet transition-all cursor-pointer"
                          title="Convert to Booking"
                        >
                          <CalendarCheck className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleDeleteLead(lead.id)}
                      className="p-1.5 bg-danger/15 border border-danger/35 text-danger rounded-lg hover:bg-danger hover:text-velvet transition-all cursor-pointer"
                      title="Delete inquiry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </Table>
        )}

      </div>
    </PageTransition>
  );
};

export default AdminLeadsPage;
