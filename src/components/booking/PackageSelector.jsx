import React from 'react';
import { PACKAGES } from '../../utils/constants';
import { useCart } from '../../context/CartContext';

const PackageSelector = ({ onNext }) => {
  const { selectedPackage, setSelectedPackage } = useCart();

  const handleSelect = (pkg) => {
    setSelectedPackage(pkg);
    onNext();
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="font-display text-xl font-bold text-gold">Step 1: Choose Event Package</h3>
        <p className="font-body text-xs text-champagne/60 mt-1">Select a starting theme package for your celebration</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PACKAGES.map((pkg) => {
          const isSelected = selectedPackage?.id === pkg.id;
          return (
            <div
              key={pkg.id}
              onClick={() => handleSelect(pkg)}
              className={`p-6 bg-white/5 border rounded-xl cursor-pointer hover:border-gold transition-all duration-300 ${
                isSelected ? 'border-gold bg-gold/5 shadow-gold-sm' : 'border-white/5'
              }`}
            >
              <h4 className="font-display text-lg font-bold text-champagne">{pkg.name}</h4>
              
              <ul className="mt-6 space-y-2.5 text-left">
                {pkg.features.map((feat, idx) => (
                  <li key={idx} className="font-body text-xs text-champagne/70 flex items-start">
                    <span className="text-gold mr-2 mt-0.5">•</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PackageSelector;
