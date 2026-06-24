// src/components/admin/CouponManager.jsx
import React, { useState } from 'react';
import { createCoupon, deleteCoupon } from '../../services/couponService';
import { formatCurrency } from '../../utils/formatters';
import { formatDateString } from '../../utils/dateHelpers';
import Table from '../common/Table';
import EmptyState from '../common/EmptyState';
import Input from '../common/Input';
import Button from '../common/Button';
import toast from 'react-hot-toast';
import { PlusCircle, Trash, Tag, Calendar } from 'lucide-react';

const CouponManager = ({ coupons = [], onRefresh }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    type: 'percentage', // percentage, fixed
    value: '',
    expiryDate: '',
    active: true
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.code || !formData.value || !formData.expiryDate) {
      toast.error('Required fields are missing.');
      return;
    }

    setLoading(true);
    try {
      await createCoupon(formData);
      toast.success(`Coupon ${formData.code.toUpperCase()} created successfully!`);
      setFormData({
        code: '',
        type: 'percentage',
        value: '',
        expiryDate: '',
        active: true
      });
      setShowAddForm(false);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error(err);
      toast.error('Failed to create coupon.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (code) => {
    if (!window.confirm(`Are you sure you want to delete promo coupon ${code}?`)) return;
    try {
      await deleteCoupon(code);
      toast.success('Coupon deleted.');
      if (onRefresh) onRefresh();
    } catch (e) {
      console.error(e);
      toast.error('Failed to delete coupon.');
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex justify-between items-center">
        <h3 className="font-display text-champagne text-sm font-semibold tracking-wide">
          Manage Promotion Coupons
        </h3>
        <button
          onClick={() => setShowAddForm(prev => !prev)}
          className="flex items-center space-x-1 px-4 py-1.5 bg-white/5 border border-gold/20 rounded-lg text-xs font-semibold text-gold hover:bg-gold/15 transition-all cursor-pointer"
        >
          <PlusCircle className="w-4 h-4 mr-1" />
          <span>{showAddForm ? 'Close Form' : 'Create Coupon'}</span>
        </button>
      </div>

      {/* Creation form panel */}
      {showAddForm && (
        <form onSubmit={handleCreate} className="bg-white/5 border border-white/5 p-6 rounded-xl space-y-4 animate-scaleIn">
          <h4 className="font-display text-gold text-xs font-bold uppercase tracking-wider">New Coupon Setup</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Input
              label="Promo Code"
              name="code"
              value={formData.code}
              onChange={handleInputChange}
              placeholder="e.g. DIWALI20"
              required
            />
            <div className="flex flex-col space-y-1 w-full">
              <label className="font-body text-xs font-semibold text-champagne/80 tracking-wider">
                Discount Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="input-premium"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Cash Amount (₹)</option>
              </select>
            </div>
            <Input
              label="Discount Value"
              name="value"
              type="number"
              value={formData.value}
              onChange={handleInputChange}
              placeholder="e.g. 10 or 2500"
              required
            />
            <Input
              label="Expiry Date"
              name="expiryDate"
              type="date"
              value={formData.expiryDate}
              onChange={handleInputChange}
              required
            />
          </div>
          <Button type="submit" disabled={loading} className="px-6 py-2.5 text-xs font-semibold">
            {loading ? 'Creating...' : 'Create Promo Code'}
          </Button>
        </form>
      )}

      {/* List */}
      {coupons.length === 0 ? (
        <EmptyState message="No promo codes available." subtext="Create coupons to share discounts with your customers." />
      ) : (
        <Table headers={['Coupon Code', 'Discount Type', 'Value', 'Expiry', 'Status', 'Actions']}>
          {coupons.map((c) => (
            <tr key={c.code}>
              <td className="font-mono text-xs font-bold text-gold flex items-center">
                <Tag className="w-4 h-4 mr-2" />
                <span>{c.code}</span>
              </td>
              <td className="text-xs capitalize text-champagne/80">{c.type}</td>
              <td className="font-semibold text-champagne text-xs">
                {c.type === 'percentage' ? `${c.value}%` : formatCurrency(c.value)}
              </td>
              <td>
                <div className="flex items-center space-x-1.5 text-xs text-champagne/80">
                  <Calendar className="w-3.5 h-3.5 text-gold mr-1.5" />
                  <span>{formatDateString(c.expiryDate)}</span>
                </div>
              </td>
              <td>
                <span className={`inline-flex px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wide ${
                  c.active ? 'bg-success/10 text-success border border-success/30' : 'bg-danger/10 text-danger border border-danger/30'
                }`}>
                  {c.active ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td>
                <button
                  onClick={() => handleDelete(c.code)}
                  className="p-1.5 bg-danger/15 border border-danger/35 text-danger rounded-lg hover:bg-danger hover:text-charcoal transition-all cursor-pointer"
                  title="Delete Coupon"
                >
                  <Trash className="w-3.5 h-3.5" />
                </button>
              </td>
            </tr>
          ))}
        </Table>
      )}

    </div>
  );
};

export default CouponManager;
