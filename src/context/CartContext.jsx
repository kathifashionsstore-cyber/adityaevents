// src/context/CartContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [cateringDetails, setCateringDetails] = useState({
    enabled: false,
    vegGuests: 0,
    nonVegGuests: 0,
    pricePerPlateVeg: 350,
    pricePerPlateNonVeg: 550,
    selectedMenu: []
  });
  const [eventDetails, setEventDetails] = useState({
    eventType: 'wedding', // wedding, catering, birthday, corporate, engagement
    eventDate: '',
    eventTime: '18:00',
    venueName: '',
    venueAddress: '',
    city: 'Vuyyuru',
    stageDecoration: 'standard', // standard, premium, royal
    photography: false,
    videography: false,
    droneFootage: false,
    soundSystemDJ: false,
  });
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [pricing, setPricing] = useState({
    basePrice: 0,
    cateringTotal: 0,
    stageAddon: 0,
    mediaAddon: 0,
    subtotal: 0,
    discount: 0,
    tax: 0,
    total: 0
  });

  const calculatePricing = useCallback(() => {
    let basePrice = selectedPackage ? parseFloat(selectedPackage.price) : 0;
    
    // Stage decoration addon
    let stageAddon = 0;
    if (eventDetails.stageDecoration === 'premium') stageAddon = 15000;
    if (eventDetails.stageDecoration === 'royal') stageAddon = 40000;

    // Catering total
    let cateringTotal = 0;
    if (cateringDetails.enabled) {
      cateringTotal = (cateringDetails.vegGuests * cateringDetails.pricePerPlateVeg) + 
                      (cateringDetails.nonVegGuests * cateringDetails.pricePerPlateNonVeg);
    }

    // Media and entertainment addons
    let mediaAddon = 0;
    if (eventDetails.photography) mediaAddon += 15000;
    if (eventDetails.videography) mediaAddon += 20000;
    if (eventDetails.droneFootage) mediaAddon += 10000;
    if (eventDetails.soundSystemDJ) mediaAddon += 12000;

    const subtotal = basePrice + stageAddon + cateringTotal + mediaAddon;

    // Discount
    let discount = 0;
    if (appliedCoupon) {
      if (appliedCoupon.type === 'percentage') {
        discount = (subtotal * appliedCoupon.value) / 100;
      } else if (appliedCoupon.type === 'fixed') {
        discount = appliedCoupon.value;
      }
      // Cap discount at subtotal
      if (discount > subtotal) discount = subtotal;
    }

    const discountedSubtotal = subtotal - discount;
    const tax = discountedSubtotal * 0.18; // 18% GST
    const total = discountedSubtotal + tax;

    setPricing({
      basePrice,
      cateringTotal,
      stageAddon,
      mediaAddon,
      subtotal,
      discount,
      tax,
      total
    });
  }, [selectedPackage, cateringDetails, eventDetails, appliedCoupon]);

  // Recalculate whenever inputs change
  useEffect(() => {
    calculatePricing();
  }, [calculatePricing]);

  const clearCart = () => {
    setSelectedPackage(null);
    setAppliedCoupon(null);
    setCateringDetails({
      enabled: false,
      vegGuests: 0,
      nonVegGuests: 0,
      pricePerPlateVeg: 350,
      pricePerPlateNonVeg: 550,
      selectedMenu: []
    });
    setEventDetails({
      eventType: 'wedding',
      eventDate: '',
      eventTime: '18:00',
      venueName: '',
      venueAddress: '',
      city: 'Vuyyuru',
      stageDecoration: 'standard',
      photography: false,
      videography: false,
      droneFootage: false,
      soundSystemDJ: false,
    });
  };

  const applyCouponCode = async (code) => {
    if (!code) return { success: false, message: 'Please enter a coupon code' };
    
    try {
      const couponRef = doc(db, 'coupons', code.toUpperCase());
      const couponSnap = await getDoc(couponRef);
      
      if (!couponSnap.exists()) {
        return { success: false, message: 'Invalid coupon code' };
      }
      
      const couponData = couponSnap.data();
      const now = new Date();
      const expiryDate = new Date(couponData.expiryDate);
      
      if (now > expiryDate) {
        return { success: false, message: 'This coupon has expired' };
      }
      
      if (!couponData.active) {
        return { success: false, message: 'This coupon is inactive' };
      }

      setAppliedCoupon({
        code: code.toUpperCase(),
        type: couponData.type, // 'percentage' | 'fixed'
        value: couponData.value
      });

      return { success: true, message: `Coupon applied: Saved ₹${couponData.type === 'percentage' ? couponData.value + '%' : couponData.value}` };
    } catch (error) {
      console.error("Error validation coupon:", error);
      return { success: false, message: 'Error validating coupon code' };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  return (
    <CartContext.Provider value={{
      selectedPackage,
      setSelectedPackage,
      cateringDetails,
      setCateringDetails,
      eventDetails,
      setEventDetails,
      appliedCoupon,
      pricing,
      applyCouponCode,
      removeCoupon,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
