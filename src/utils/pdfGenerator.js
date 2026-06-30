// src/utils/pdfGenerator.js
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

// Helper to safely extract live CSS variables from DOM
const getCSSVarColor = (varName, defaultVal) => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return defaultVal;
  const value = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  return value || defaultVal;
};

// Helper to convert hex colors to RGB format arrays
const hexToRgb = (hex, defaultRgb) => {
  if (!hex) return defaultRgb;
  const cleanHex = hex.replace('#', '');
  if (cleanHex.length === 3) {
    const r = parseInt(cleanHex[0] + cleanHex[0], 16);
    const g = parseInt(cleanHex[1] + cleanHex[1], 16);
    const b = parseInt(cleanHex[2] + cleanHex[2], 16);
    return [r, g, b];
  }
  if (cleanHex.length === 6) {
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    return [r, g, b];
  }
  return defaultRgb;
};

// Mock QR Draw function
const drawQRVerificationBlock = (doc, x, y, size) => {
  doc.setFillColor(40, 40, 40);
  doc.rect(x, y, size, size, 'F');
  doc.setFillColor(255, 255, 255);
  doc.rect(x + 2, y + 2, size - 4, size - 4, 'F');
  
  doc.setFillColor(40, 40, 40);
  doc.rect(x + 3, y + 3, 5, 5, 'F');
  doc.rect(x + size - 8, y + 3, 5, 5, 'F');
  doc.rect(x + 3, y + size - 8, 5, 5, 'F');
  
  doc.setFillColor(255, 255, 255);
  doc.rect(x + 4, y + 4, 3, 3, 'F');
  doc.rect(x + size - 7, y + 4, 3, 3, 'F');
  doc.rect(x + 4, y + size - 7, 3, 3, 'F');
  
  doc.setFillColor(40, 40, 40);
  doc.rect(x + 5, y + 5, 1, 1, 'F');
  doc.rect(x + size - 6, y + 5, 1, 1, 'F');
  doc.rect(x + 5, y + size - 6, 1, 1, 'F');
  
  doc.rect(x + 9, y + 6, 4, 1.5, 'F');
  doc.rect(x + 2, y + 9, 3, 2, 'F');
  doc.rect(x + 7, y + 9, 2, 4, 'F');
  doc.rect(x + 10, y + 12, 3, 2, 'F');
  doc.rect(x + 14, y + 9, 2, 5, 'F');
  doc.rect(x + 2, y + 15, 2, 2, 'F');
  doc.rect(x + 11, y + 15, 4, 1.5, 'F');
  doc.rect(x + 6, y + 15, 3, 1, 'F');
};

const drawHeader = (doc, titleText) => {
  const primaryColorHex = getCSSVarColor('--primary-rose', '#C76D7A');
  const secondaryColorHex = getCSSVarColor('--secondary-rose-gold', '#EBB4A0');
  const darkSectionHex = getCSSVarColor('--dark-section', '#3B2F2F');
  const accentGoldHex = getCSSVarColor('--accent-gold', '#D4AF37');

  const primaryRgb = hexToRgb(primaryColorHex, [199, 109, 122]);
  const secondaryRgb = hexToRgb(secondaryColorHex, [235, 180, 160]);
  const darkRgb = hexToRgb(darkSectionHex, [59, 47, 47]);
  const accentRgb = hexToRgb(accentGoldHex, [212, 175, 55]);

  // Draw header block
  doc.setFillColor(darkRgb[0], darkRgb[1], darkRgb[2]);
  doc.rect(0, 0, 210, 42, 'F');

  // Company Header Text
  doc.setTextColor(accentRgb[0], accentRgb[1], accentRgb[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('ADITHYA EVENT MANAGEMENT', 15, 18);

  doc.setTextColor(secondaryRgb[0], secondaryRgb[1], secondaryRgb[2]);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text('Premium Royal Events & Catering | Vijayawada, Andhra Pradesh', 15, 26);
  doc.text('Call: +91 93932 17676 | Email: info@adithyaevents.com', 15, 32);

  // Document Title Badge
  doc.setFillColor(primaryRgb[0], primaryRgb[1], primaryRgb[2]);
  doc.rect(145, 12, 50, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text(titleText, 170, 17, { align: 'center' });

  // Separator line
  doc.setDrawColor(accentRgb[0], accentRgb[1], accentRgb[2]);
  doc.setLineWidth(1);
  doc.line(0, 42, 210, 42);
};

export const generateBookingQuotationPDF = (bookingData) => {
  const doc = new jsPDF();

  const primaryColorHex = getCSSVarColor('--primary-rose', '#C76D7A');
  const backgroundHex = getCSSVarColor('--background', '#FFFBF7');
  const darkSectionHex = getCSSVarColor('--dark-section', '#3B2F2F');
  const textPrimaryHex = getCSSVarColor('--text-primary', '#2D2D2D');

  const primaryRgb = hexToRgb(primaryColorHex, [199, 109, 122]);
  const backgroundRgb = hexToRgb(backgroundHex, [255, 251, 247]);
  const darkRgb = hexToRgb(darkSectionHex, [59, 47, 47]);
  const textPrimaryRgb = hexToRgb(textPrimaryHex, [45, 45, 45]);
  
  // ================= PAGE 1: CUSTOMER COPY =================
  drawHeader(doc, 'CUSTOMER COPY');

  // Quote Title
  doc.setTextColor(darkRgb[0], darkRgb[1], darkRgb[2]);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('OFFICIAL EVENT BOOKING SUMMARY', 15, 54);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Date Issued: ${new Date().toLocaleDateString('en-IN')}`, 145, 52);
  doc.text(`Booking ID: ${bookingData.id || 'N/A'}`, 145, 58);
  
  // Customer Details Box (Cream background)
  doc.setFillColor(backgroundRgb[0], backgroundRgb[1], backgroundRgb[2]);
  doc.setDrawColor(primaryRgb[0], primaryRgb[1], primaryRgb[2]);
  doc.rect(15, 64, 180, 36, 'FD');
  
  doc.setTextColor(textPrimaryRgb[0], textPrimaryRgb[1], textPrimaryRgb[2]);
  doc.setFont('helvetica', 'bold');
  doc.text('Client details:', 20, 71);
  doc.setFont('helvetica', 'normal');
  doc.text(`Name: ${bookingData.customerName}`, 20, 78);
  doc.text(`Phone: ${bookingData.customerPhone}`, 20, 84);
  doc.text(`Email: ${bookingData.customerEmail || 'N/A'}`, 20, 91);

  doc.text(`Event Category: ${String(bookingData.eventType || '').toUpperCase()}`, 105, 78);
  doc.text(`Event Date: ${bookingData.eventDate}`, 105, 84);
  doc.text(`Venue Name: ${bookingData.venueName || 'To Be Specified'}`, 105, 91);

  // Specifications Table Rows
  const tableRows = [
    ['Base Event Package', bookingData.packageName || 'Custom Decoration Package', 'Included in booking'],
    ['Theme Stage Decoration', bookingData.stageDecoration || 'Standard Backdrop theme', 'Included in booking'],
    ['Catering & dining plates', `${bookingData.vegGuests || 0} Vegetarian / ${bookingData.nonVegGuests || 0} Non-Vegetarian plates`, 'Included in booking'],
    ['Media & Event Coverage', bookingData.addons?.join(', ') || 'Photography / Videography', 'Included in booking'],
    ['Catering Menu Choice', bookingData.catering || 'Standard Buffet selection', 'Included in booking']
  ];

  doc.autoTable({
    startY: 108,
    head: [['Item Description', 'Selected Specifications', 'Commercial Status']],
    body: tableRows,
    headStyles: { fillColor: primaryRgb, textColor: [255, 255, 255], fontStyle: 'bold' },
    theme: 'striped',
    styles: { fontSize: 8.5, font: 'helvetica' },
  });

  let finalY = doc.lastAutoTable.finalY + 12;

  // QR Verification Block
  drawQRVerificationBlock(doc, 15, finalY, 20);
  doc.setFontSize(7.5);
  doc.setTextColor(100, 100, 100);
  doc.setFont('helvetica', 'italic');
  doc.text('Scan to verify', 15, finalY + 23);
  doc.text('booking details', 15, finalY + 26);

  // Terms and Notes
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(darkRgb[0], darkRgb[1], darkRgb[2]);
  doc.text('General Terms & Conditions:', 45, finalY + 2);
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(7.5);
  doc.text('1. Stage setup requires 12 hours onsite access prior to event start time.', 45, finalY + 8);
  doc.text('2. Menu customizers must be frozen at least 7 days before event date.', 45, finalY + 13);
  doc.text('3. Any additional lighting or sound extensions will link to WhatsApp additions.', 45, finalY + 18);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(primaryRgb[0], primaryRgb[1], primaryRgb[2]);
  doc.setFontSize(9);
  doc.text('Thank you for choosing Adithya Event Management!', 105, finalY + 38, { align: 'center' });

  // ================= PAGE 2: OFFICE COPY =================
  doc.addPage();
  drawHeader(doc, 'OFFICE COPY');

  doc.setTextColor(darkRgb[0], darkRgb[1], darkRgb[2]);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('INTERNAL OFFICE RECORD & ACCOUNTING LEDGER', 15, 54);

  // Client Summary
  doc.setFillColor(backgroundRgb[0], backgroundRgb[1], backgroundRgb[2]);
  doc.rect(15, 64, 180, 32, 'FD');
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.text('Event Summary:', 20, 71);
  doc.setFont('helvetica', 'normal');
  doc.text(`ID: ${bookingData.id || 'N/A'} | Client: ${bookingData.customerName} | Phone: ${bookingData.customerPhone}`, 20, 78);
  doc.text(`Date: ${bookingData.eventDate} | Venue: ${bookingData.venueName || 'N/A'} | City: ${bookingData.city || 'Vijayawada'}`, 20, 84);
  doc.text(`Category: ${String(bookingData.eventType || '').toUpperCase()} | Decor Tier: ${bookingData.packageName || 'Custom'}`, 20, 90);

  // Specifications Checklist
  const officeTableRows = [
    ['Catering Plates', `Veg: ${bookingData.vegGuests || 0} / Non-Veg: ${bookingData.nonVegGuests || 0}`, 'Staff Assignment: ____________'],
    ['Backdrop Decor', bookingData.stageDecoration || 'Standard theme', 'Vendor Blocked: ____________'],
    ['DJ / Sound Setup', bookingData.addons?.includes('sound') ? 'Yes' : 'No', 'Equipment Issued: ____________'],
    ['Photography Crew', bookingData.addons?.includes('photography') ? 'Yes' : 'No', 'Lenses Blocked: ____________'],
  ];

  doc.autoTable({
    startY: 104,
    head: [['Office Checkpoints', 'Specifications Details', 'Status Log Notes']],
    body: officeTableRows,
    headStyles: { fillColor: primaryRgb, textColor: [255, 255, 255], fontStyle: 'bold' },
    theme: 'grid',
    styles: { fontSize: 8.5, font: 'helvetica' },
  });

  finalY = doc.lastAutoTable.finalY + 12;

  // INTERNAL BUDGETING BLOCKS
  doc.setFillColor(backgroundRgb[0], backgroundRgb[1], backgroundRgb[2]);
  doc.setDrawColor(primaryRgb[0], primaryRgb[1], primaryRgb[2]);
  doc.rect(15, finalY, 180, 52, 'FD');

  doc.setTextColor(darkRgb[0], darkRgb[1], darkRgb[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('Internal Accounting Log (INR):', 22, finalY + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text('1. Total Quote Estimate (Agreed): __________________', 22, finalY + 16);
  doc.text('2. Advance Received:            __________________', 22, finalY + 22);
  doc.text('3. Decor Vendor Cost:           __________________', 22, finalY + 28);
  doc.text('4. Catering Ingredients Cost:    __________________', 22, finalY + 34);
  doc.text('5. Labor & Logistics Expense:    __________________', 22, finalY + 40);
  doc.text('6. Net Profit Margin:           __________________', 22, finalY + 46);

  // Approval lines
  doc.setFont('helvetica', 'bold');
  doc.text('Office approvals:', 125, finalY + 16);
  doc.setFont('helvetica', 'normal');
  doc.text('Lead Planner: __________________', 125, finalY + 28);
  doc.text('Director Sign: __________________', 125, finalY + 40);

  // Save Proposal
  doc.save(`Adithya_Events_Receipt_${bookingData.customerName.replace(/\s+/g, '_')}.pdf`);
};
