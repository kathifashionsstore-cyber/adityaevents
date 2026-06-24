// src/pages/admin/AdminPaymentsPage.jsx
import React, { useState, useEffect } from 'react';
import PageTransition from '../../components/common/PageTransition';
import Spinner from '../../components/common/Spinner';
import Table from '../../components/common/Table';
import EmptyState from '../../components/common/EmptyState';
import Badge from '../../components/common/Badge';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { formatCurrency } from '../../utils/formatters';
import { formatDateString } from '../../utils/dateHelpers';
import { Calendar } from 'lucide-react';

const AdminPaymentsPage = () => {
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      try {
        const snap = await getDocs(collection(db, 'payments'));
        const list = [];
        snap.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setPayments(list.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  return (
    <PageTransition>
      <div className="space-y-6 pb-12 text-left">
        <h3 className="font-display text-champagne text-sm font-semibold tracking-wide uppercase">
          Client Payment Transactions Log
        </h3>

        {loading ? (
          <div className="py-12 flex justify-center">
            <Spinner size="lg" />
          </div>
        ) : payments.length === 0 ? (
          <EmptyState message="No transactions recorded." subtext="Completed checkout transactions appear in this panel." />
        ) : (
          <Table headers={['Transaction ID', 'Booking Reference', 'Date', 'Method', 'Status', 'Amount (INR)']}>
            {payments.map((pay) => (
              <tr key={pay.transactionId}>
                <td className="font-mono text-xs font-bold text-gold">{pay.transactionId}</td>
                <td className="font-mono text-xs text-champagne/70">{pay.bookingId}</td>
                <td>
                  <div className="flex items-center text-xs text-champagne/80">
                    <Calendar className="w-3.5 h-3.5 text-gold mr-1.5 shrink-0" />
                    <span>{formatDateString(pay.timestamp)}</span>
                  </div>
                </td>
                <td className="text-xs uppercase text-champagne/80 font-mono">{pay.method}</td>
                <td>
                  <span className="inline-flex px-2 py-0.5 rounded text-[9px] uppercase font-bold bg-success/10 text-success border border-success/30">
                    {pay.status || 'SUCCESS'}
                  </span>
                </td>
                <td className="font-bold text-success text-sm">{formatCurrency(pay.amount)}</td>
              </tr>
            ))}
          </Table>
        )}

      </div>
    </PageTransition>
  );
};

export default AdminPaymentsPage;
