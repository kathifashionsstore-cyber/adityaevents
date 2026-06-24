// src/utils/pdfGenerator.js
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { formatCurrency } from './formatters';

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

export const generateBookingQuotationPDF = (bookingData, pricing) => {
  const logoImg = new Image();
  logoImg.src = '/logo.webp';
  
  const buildPdf = () => {
    const doc = new jsPDF();
    
    // Draw header block - Deep Amethyst background (#1C0A2E / rgb(28, 10, 46))
    doc.setFillColor(28, 10, 46);
    doc.rect(0, 0, 210, 42, 'F');

    // Inject Logo (WebP or PNG image format fallback)
    try {
      doc.addImage(logoImg, 'WEBP', 15, 6, 28, 28);
    } catch (e) {
      console.warn('Failed to embed webp logo in PDF, drawing text fallback:', e);
    }

    // Company Header Text
    doc.setTextColor(212, 175, 55); // Royal Gold (#D4AF37)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text('ADITHYA EVENT MANAGEMENT', 48, 18);

    doc.setTextColor(247, 231, 206); // Champagne (#F7E7CE)
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text('Premium Royal Events & Catering | Vuyyuru, Andhra Pradesh', 48, 26);
    doc.text('Call: +91 93932 17676 | Email: info@adithyaevents.com', 48, 32);

    // Separator line
    doc.setDrawColor(212, 175, 55); // Gold
    doc.setLineWidth(1);
    doc.line(0, 42, 210, 42);

    // Quote Metadata
    doc.setTextColor(28, 10, 46); // Deep Amethyst
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text('ESTIMATE QUOTATION', 15, 54);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(`Date Issued: ${new Date().toLocaleDateString('en-IN')}`, 145, 52);
    doc.text(`Reference ID: ${bookingData.id || 'TEMP-QUOTE'}`, 145, 58);
    
    // Customer Details Box (Warm Cream Background)
    doc.setFillColor(253, 248, 240); // Warm Ivory (#FDF8F0)
    doc.setDrawColor(212, 175, 55, 0.4);
    doc.rect(15, 64, 180, 34, 'FD');
    
    doc.setTextColor(28, 10, 46);
    doc.setFont('helvetica', 'bold');
    doc.text('Client details:', 20, 71);
    doc.setFont('helvetica', 'normal');
    doc.text(`Name: ${bookingData.customerName}`, 20, 78);
    doc.text(`Phone: ${bookingData.customerPhone}`, 20, 84);
    doc.text(`Email: ${bookingData.customerEmail || 'N/A'}`, 20, 91);

    doc.text(`Event Category: ${bookingData.eventType.toUpperCase()}`, 105, 78);
    doc.text(`Event Date: ${bookingData.eventDate}`, 105, 84);
    doc.text(`Venue Name: ${bookingData.venueName || 'To Be Specified'}`, 105, 91);

    // Pricing Table Rows
    const tableRows = [
      ['Base Package / Decoration', bookingData.packageName || 'Custom Stage Decor', formatCurrency(pricing.basePrice)],
      ['Stage Addon (' + (bookingData.stageDecoration || 'standard') + ')', 'Decoration Upgrade', formatCurrency(pricing.stageAddon)],
      ['Premium Catering', `${bookingData.vegGuests || 0} Veg / ${bookingData.nonVegGuests || 0} Non-Veg plates`, formatCurrency(pricing.cateringTotal)],
      ['Media & DJ Addons', 'Photography, DJ, Drone', formatCurrency(pricing.mediaAddon)],
      ['Coupon Discount', bookingData.couponCode || 'None', `-${formatCurrency(pricing.discount)}`],
    ];

    doc.autoTable({
      startY: 106,
      head: [['Item Description', 'Details', 'Subtotal (INR)']],
      body: tableRows,
      headStyles: { fillColor: [45, 27, 78], textColor: [247, 231, 206], fontStyle: 'bold' }, // Amethyst & Champagne
      theme: 'striped',
      styles: { fontSize: 8.5, font: 'helvetica' },
      columnStyles: { 2: { halign: 'right' } }
    });

    const finalY = doc.lastAutoTable.finalY + 12;

    // QR Verification & Final totals layout
    drawQRVerificationBlock(doc, 15, finalY, 20);
    doc.setFontSize(7.5);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'italic');
    doc.text('Scan to verify', 15, finalY + 23);
    doc.text('official quotation', 15, finalY + 26);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(28, 10, 46);
    doc.text('Subtotal:', 125, finalY);
    doc.text(formatCurrency(pricing.subtotal - pricing.discount), 180, finalY, { align: 'right' });

    doc.text('GST (18%):', 125, finalY + 6);
    doc.text(formatCurrency(pricing.tax), 180, finalY + 6, { align: 'right' });

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(45, 27, 78); // Amethyst
    doc.text('GRAND TOTAL ESTIMATE:', 105, finalY + 14);
    doc.text(formatCurrency(pricing.total), 180, finalY + 14, { align: 'right' });

    // Separator before notes
    doc.setDrawColor(230, 230, 230);
    doc.line(15, finalY + 24, 195, finalY + 24);

    // Footer notes
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.text('* This is an estimated price quotation based on choices requested. Final prices may vary.', 15, finalY + 34);
    doc.text('* 50% advance payment required to block the date. Balance due on event start date.', 15, finalY + 39);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(212, 175, 55); // Gold
    doc.text('Thank you for choosing Adithya Event Management!', 105, finalY + 49, { align: 'center' });

    // Save the PDF
    doc.save(`Adithya_Events_Quotation_${bookingData.customerName.replace(/\s+/g, '_')}.pdf`);
  };

  // Trigger loading image, and generate PDF
  if (logoImg.complete) {
    buildPdf();
  } else {
    logoImg.onload = buildPdf;
    logoImg.onerror = buildPdf; // fallback if image fails to load
  }
};
