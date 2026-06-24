// src/utils/quoteCalculator.js

/**
 * Perform price calculations based on selected packages, plates, upgrades, and discounts.
 * @param {Object} selectedPackage - selected base package
 * @param {Object} cateringDetails - veg/nonveg plate selections and guest count
 * @param {Object} eventDetails - decorators and addons
 * @param {Object} coupon - discount coupons details
 * @returns {Object} - computed pricing breakdown
 */
export const calculateQuote = (selectedPackage, cateringDetails, eventDetails, coupon) => {
  let basePrice = selectedPackage ? parseFloat(selectedPackage.price) : 0;
  
  // Stage decoration addon
  let stageAddon = 0;
  if (eventDetails?.stageDecoration === 'premium') stageAddon = 15000;
  if (eventDetails?.stageDecoration === 'royal') stageAddon = 40000;

  // Catering total
  let cateringTotal = 0;
  if (cateringDetails?.enabled) {
    const vegCount = parseInt(cateringDetails.vegGuests) || 0;
    const nonVegCount = parseInt(cateringDetails.nonVegGuests) || 0;
    const vegPrice = parseFloat(cateringDetails.pricePerPlateVeg) || 350;
    const nonVegPrice = parseFloat(cateringDetails.pricePerPlateNonVeg) || 550;
    cateringTotal = (vegCount * vegPrice) + (nonVegCount * nonVegPrice);
  }

  // Media and entertainment addons
  let mediaAddon = 0;
  if (eventDetails?.photography) mediaAddon += 15000;
  if (eventDetails?.videography) mediaAddon += 20000;
  if (eventDetails?.droneFootage) mediaAddon += 10000;
  if (eventDetails?.soundSystemDJ) mediaAddon += 12000;

  const subtotal = basePrice + stageAddon + cateringTotal + mediaAddon;

  // Discount
  let discount = 0;
  if (coupon) {
    if (coupon.type === 'percentage') {
      discount = (subtotal * coupon.value) / 100;
    } else if (coupon.type === 'fixed') {
      discount = coupon.value;
    }
    // Cap discount at subtotal
    if (discount > subtotal) discount = subtotal;
  }

  const discountedSubtotal = subtotal - discount;
  const tax = discountedSubtotal * 0.18; // 18% GST
  const total = discountedSubtotal + tax;

  return {
    basePrice,
    cateringTotal,
    stageAddon,
    mediaAddon,
    subtotal,
    discount,
    tax,
    total
  };
};
