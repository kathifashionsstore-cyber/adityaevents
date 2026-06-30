// src/context/CartContext.jsx
import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [cateringDetails, setCateringDetails] = useState({
    enabled: false,
    vegGuests: 0,
    nonVegGuests: 0,
    selectedMenu: []
  });
  const [eventDetails, setEventDetails] = useState({
    eventType: 'wedding', // wedding, catering, birthday, corporate, engagement
    eventDate: '',
    eventTime: '18:00',
    venueName: '',
    venueAddress: '',
    city: 'Vijayawada',
    stageDecoration: 'standard', // standard, premium, royal
    photography: false,
    videography: false,
    droneFootage: false,
    soundSystemDJ: false,
  });

  const clearCart = () => {
    setSelectedPackage(null);
    setCateringDetails({
      enabled: false,
      vegGuests: 0,
      nonVegGuests: 0,
      selectedMenu: []
    });
    setEventDetails({
      eventType: 'wedding',
      eventDate: '',
      eventTime: '18:00',
      venueName: '',
      venueAddress: '',
      city: 'Vijayawada',
      stageDecoration: 'standard',
      photography: false,
      videography: false,
      droneFootage: false,
      soundSystemDJ: false,
    });
  };

  return (
    <CartContext.Provider value={{
      selectedPackage,
      setSelectedPackage,
      cateringDetails,
      setCateringDetails,
      eventDetails,
      setEventDetails,
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
