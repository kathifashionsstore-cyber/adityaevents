// src/utils/pdfGenerator.js
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

// Helper to draw a vector QR code block synchronously
const drawQRVerificationBlock = (doc, x, y, size) => {
  // Outer frame
  doc.setDrawColor(45, 27, 78); // Amethyst
  doc.setLineWidth(0.8);
  doc.rect(x, y, size, size);

  // Position detection patterns (Top Left, Top Right, Bottom Left)
  const drawFinderPattern = (px, py) => {
    doc.setFillColor(45, 27, 78);
    doc.rect(px, py, 6, 6, 'F');
    doc.setFillColor(255, 255, 255);
    doc.rect(px + 1, py + 1, 4, 4, 'F');
    doc.setFillColor(45, 27, 78);
    doc.rect(px + 2, py + 2, 2, 2, 'F');
  };

  drawFinderPattern(x + 1.5, y + 1.5); // Top Left
  drawFinderPattern(x + size - 7.5, y + 1.5); // Top Right
  drawFinderPattern(x + 1.5, y + size - 7.5); // Bottom Left

  // Simulated QR data blocks
  doc.setFillColor(45, 27, 78);
  doc.rect(x + 9, y + 2, 2, 1, 'F');
  doc.rect(x + 12, y + 3, 2, 2, 'F');
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
  // Draw header block - Deep Amethyst background (#1C0A2E / rgb(28, 10, 46))
  doc.setFillColor(28, 10, 46);
  doc.rect(0, 0, 210, 42, 'F');

  // Company Header Text
  doc.setTextColor(212, 175, 55); // Royal Gold (#D4AF37)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('ADITHYA EVENT MANAGEMENT', 15, 18);

  doc.setTextColor(247, 231, 206); // Champagne (#F7E7CE)
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text('Premium Royal Events & Catering | Vijayawada, Andhra Pradesh', 15, 26);
  doc.text('Call: +91 93932 17676 | Email: info@adithyaevents.com', 15, 32);

  // Document Title Badge (e.g. CUSTOMER COPY / OFFICE COPY)
  doc.setFillColor(212, 175, 55);
  doc.rect(145, 12, 50, 8, 'F');
  doc.setTextColor(28, 10, 46);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text(titleText, 170, 17, { align: 'center' });

  // Separator line
  doc.setDrawColor(212, 175, 55); // Gold
  doc.setLineWidth(1);
  doc.line(0, 42, 210, 42);
};

export const generateBookingQuotationPDF = (bookingData) => {
  const doc = new jsPDF();
  
  // ================= PAGE 1: CUSTOMER COPY =================
  drawHeader(doc, 'CUSTOMER COPY');

  // Quote Metadata
  doc.setTextColor(28, 10, 46); // Deep Amethyst
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('OFFICIAL EVENT BOOKING SUMMARY', 15, 54);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Date Issued: ${new Date().toLocaleDateString('en-IN')}`, 145, 52);
  doc.text(`Booking ID: ${bookingData.id || 'N/A'}`, 145, 58);
  
  // Customer Details Box (Warm Cream Background)
  doc.setFillColor(253, 248, 240); // Warm Ivory (#FDF8F0)
  doc.setDrawColor(212, 175, 55, 0.4);
  doc.rect(15, 64, 180, 36, 'FD');
  
  doc.setTextColor(28, 10, 46);
  doc.setFont('helvetica', 'bold');
  doc.text('Client details:', 20, 71);
  doc.setFont('helvetica', 'normal');
  doc.text(`Name: ${bookingData.customerName}`, 20, 78);
  doc.text(`Phone: ${bookingData.customerPhone}`, 20, 84);
  doc.text(`Email: ${bookingData.customerEmail || 'N/A'}`, 20, 91);

  doc.text(`Event Category: ${String(bookingData.eventType || '').toUpperCase()}`, 105, 78);
  doc.text(`Event Date: ${bookingData.eventDate}`, 105, 84);
  doc.text(`Venue Name: ${bookingData.venueName || 'To Be Specified'}`, 105, 91);

  // Specifications Table Rows (No Prices!)
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
    headStyles: { fillColor: [45, 27, 78], textColor: [247, 231, 206], fontStyle: 'bold' },
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
  doc.setTextColor(28, 10, 46);
  doc.text('General Terms & Conditions:', 45, finalY + 2);
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(7.5);
  doc.text('1. Stage setup requires 12 hours onsite access prior to event start time.', 45, finalY + 8);
  doc.text('2. Menu customizers must be frozen at least 7 days before event date.', 45, finalY + 13);
  doc.text('3. Any additional lighting or sound extensions will link to WhatsApp additions.', 45, finalY + 18);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(212, 175, 55); // Gold
  doc.setFontSize(9);
  doc.text('Thank you for choosing Adithya Event Management!', 105, finalY + 38, { align: 'center' });

  // ================= PAGE 2: OFFICE COPY =================
  doc.addPage();
  drawHeader(doc, 'OFFICE COPY');

  doc.setTextColor(28, 10, 46);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('INTERNAL OFFICE RECORD & ACCOUNTING LEDGER', 15, 54);

  // Client Summary
  doc.setFillColor(253, 248, 240);
  doc.rect(15, 64, 180, 32, 'FD');
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.text('Event Summary:', 20, 71);
  doc.setFont('helvetica', 'normal');
  doc.text(`ID: ${bookingData.id || 'N/A'} | Client: ${bookingData.customerName} | Phone: ${bookingData.customerPhone}`, 20, 78);
  doc.text(`Date: ${bookingData.eventDate} | Venue: ${bookingData.venueName || 'N/A'} | City: ${bookingData.city || 'Vijayawada'}`, 20, 84);
  doc.text(`Category: ${String(bookingData.eventType || '').toUpperCase()} | Decor Tier: ${bookingData.packageName || 'Custom'}`, 20, 90);

  // Specifications
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
    headStyles: { fillColor: [45, 27, 78], textColor: [247, 231, 206], fontStyle: 'bold' },
    theme: 'grid',
    styles: { fontSize: 8.5, font: 'helvetica' },
  });

  finalY = doc.lastAutoTable.finalY + 12;

  // INTERNAL ACCOUNTING FIELDS (Admin budgeting placeholder blocks)
  doc.setFillColor(253, 248, 240);
  doc.setDrawColor(28, 10, 46, 0.25);
  doc.rect(15, finalY, 180, 52, 'FD');

  doc.setTextColor(28, 10, 46);
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

  // Signature Block
  doc.setFont('helvetica', 'bold');
  doc.text('Office approvals:', 125, finalY + 16);
  doc.setFont('helvetica', 'normal');
  doc.text('Lead Planner: __________________', 125, finalY + 28);
  doc.text('Director Sign: __________________', 125, finalY + 40);

  // Save the PDF
  doc.save(`Adithya_Events_Receipt_${bookingData.customerName.replace(/\s+/g, '_')}.pdf`);
};
