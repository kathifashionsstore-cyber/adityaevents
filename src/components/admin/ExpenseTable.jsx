// src/components/admin/ExpenseTable.jsx
import React, { useState } from 'react';
import { formatCurrency } from '../../utils/formatters';
import { formatDateString } from '../../utils/dateHelpers';
import Table from '../common/Table';
import EmptyState from '../common/EmptyState';
import Input from '../common/Input';
import Button from '../common/Button';
import { doc, setDoc, collection } from 'firebase/firestore';
import { db } from '../../firebase/config';
import toast from 'react-hot-toast';
import { PlusCircle, FileText, Calendar } from 'lucide-react';

const ExpenseTable = ({ expenses = [], onRefresh }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    date: '',
    category: 'catering' // catering, decorators, staff, logistical, other
  });
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.amount || !formData.date) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    try {
      const id = 'EXP_' + Math.random().toString(36).substring(2, 9).toUpperCase();
      const expenseData = {
        id,
        title: formData.title,
        amount: parseFloat(formData.amount),
        date: formData.date,
        category: formData.category,
        createdAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'expenses', id), expenseData);
      toast.success('Expense item logged successfully!');
      
      // Reset form
      setFormData({
        title: '',
        amount: '',
        date: '',
        category: 'catering'
      });
      setShowAddForm(false);
      if (onRefresh) onRefresh();

    } catch (err) {
      console.error(err);
      toast.error('Failed to log expense.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex justify-between items-center">
        <h3 className="font-display text-champagne text-sm font-semibold tracking-wide">
          Business Expense Register
        </h3>
        <button
          onClick={() => setShowAddForm(prev => !prev)}
          className="flex items-center space-x-1 px-4 py-1.5 bg-white/5 border border-gold/20 rounded-lg text-xs font-semibold text-gold hover:bg-gold/15 transition-all cursor-pointer"
        >
          <PlusCircle className="w-4 h-4 mr-1" />
          <span>{showAddForm ? 'Close Form' : 'Log Expense'}</span>
        </button>
      </div>

      {/* Log Form */}
      {showAddForm && (
        <form onSubmit={handleAddExpense} className="bg-white/5 border border-white/5 p-6 rounded-xl space-y-4 animate-scaleIn">
          <h4 className="font-display text-gold text-xs font-bold uppercase tracking-wider">Log Payout Detail</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Input
              label="Expense Title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g. Caterer Ingredients"
              required
            />
            <Input
              label="Amount Paid (INR)"
              name="amount"
              type="number"
              value={formData.amount}
              onChange={handleInputChange}
              placeholder="e.g. 5000"
              required
            />
            <Input
              label="Date Logged"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleInputChange}
              required
            />
            <div className="flex flex-col space-y-1 w-full">
              <label className="font-body text-xs font-semibold text-champagne/80 tracking-wider">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="input-premium"
              >
                <option value="catering">Catering Feasts</option>
                <option value="decorators">Flower & Decors</option>
                <option value="staff">Staff Wages</option>
                <option value="logistical">Logistical Transit</option>
                <option value="other">Other Operations</option>
              </select>
            </div>
          </div>
          <Button type="submit" disabled={submitting} className="px-6 py-2.5 text-xs font-semibold">
            {submitting ? 'Logging...' : 'Save Expense Record'}
          </Button>
        </form>
      )}

      {/* List */}
      {expenses.length === 0 ? (
        <EmptyState message="No expenses logged yet." subtext="Use the button above to log staff wages or logistical costs." />
      ) : (
        <Table headers={['Expense ID', 'Description', 'Category', 'Date', 'Amount (INR)']}>
          {expenses.map((exp) => (
            <tr key={exp.id}>
              <td className="font-mono text-xs font-semibold text-gold">{exp.id}</td>
              <td className="text-sm font-semibold text-champagne">{exp.title}</td>
              <td>
                <span className="inline-flex px-2 py-0.5 rounded text-[10px] uppercase font-semibold tracking-wider bg-white/5 border border-white/10 text-champagne/70">
                  {exp.category}
                </span>
              </td>
              <td>
                <div className="flex items-center space-x-1 text-xs text-champagne/80">
                  <Calendar className="w-3.5 h-3.5 text-gold mr-1.5 shrink-0" />
                  <span>{formatDateString(exp.date)}</span>
                </div>
              </td>
              <td className="font-bold text-danger text-sm">{formatCurrency(exp.amount)}</td>
            </tr>
          ))}
        </Table>
      )}

    </div>
  );
};

export default ExpenseTable;
