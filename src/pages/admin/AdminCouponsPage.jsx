// src/pages/admin/AdminCouponsPage.jsx
import React, { useState, useEffect } from 'react';
import PageTransition from '../../components/common/PageTransition';
import Spinner from '../../components/common/Spinner';
import CouponManager from '../../components/admin/CouponManager';
import { getCoupons } from '../../services/couponService';

const AdminCouponsPage = () => {
  const [loading, setLoading] = useState(true);
  const [coupons, setCoupons] = useState([]);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const list = await getCoupons();
      setCoupons(list);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  return (
    <PageTransition>
      <div className="pb-12">
        {loading ? (
          <div className="py-12 flex justify-center">
            <Spinner size="lg" />
          </div>
        ) : (
          <CouponManager coupons={coupons} onRefresh={fetchCoupons} />
        )}
      </div>
    </PageTransition>
  );
};

export default AdminCouponsPage;
