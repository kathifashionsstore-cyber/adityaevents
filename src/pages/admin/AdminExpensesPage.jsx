// src/pages/admin/AdminExpensesPage.jsx
import React, { useState, useEffect } from 'react';
import PageTransition from '../../components/common/PageTransition';
import Spinner from '../../components/common/Spinner';
import ExpenseTable from '../../components/admin/ExpenseTable';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';

const AdminExpensesPage = () => {
  const [loading, setLoading] = useState(true);
  const [expenses, setExpenses] = useState([]);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'expenses'));
      const list = [];
      snap.forEach((doc) => {
        list.push(doc.data());
      });
      // Sort desc by date
      setExpenses(list.sort((a, b) => new Date(b.date) - new Date(a.date)));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return (
    <PageTransition>
      <div className="pb-12">
        {loading ? (
          <div className="py-12 flex justify-center">
            <Spinner size="lg" />
          </div>
        ) : (
          <ExpenseTable expenses={expenses} onRefresh={fetchExpenses} />
        )}
      </div>
    </PageTransition>
  );
};

export default AdminExpensesPage;
