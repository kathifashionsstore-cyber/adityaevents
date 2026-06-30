// src/utils/receiptGenerator.js
import { jsPDF } from 'jspdf';
import { formatCurrency } from './currencyFormatter';

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
};

export const generateReceiptPDF = (paymentData, bookingData) => {
  const logoImg = new Image();
  logoImg.src = '/logo.webp';

  const buildPdf = () => {
    const doc = new jsPDF();

    const primaryColorHex = getCSSVarColor('--primary-rose', '#C76D7A');
    const secondaryColorHex = getCSSVarColor('--secondary-rose-gold', '#EBB4A0');
    const darkSectionHex = getCSSVarColor('--dark-section', '#3B2F2F');
    const accentGoldHex = getCSSVarColor('--accent-gold', '#D4AF37');

    const primaryRgb = hexToRgb(primaryColorHex, [199, 109, 122]);
    const secondaryRgb = hexToRgb(secondaryColorHex, [235, 180, 160]);
    const darkRgb = hexToRgb(darkSectionHex, [59, 47, 47]);
    const accentRgb = hexToRgb(accentGoldHex, [212, 175, 55]);

    // Header banner - Deep Amethyst background
    doc.setFillColor(darkRgb[0], darkRgb[1], darkRgb[2]);
    doc.rect(0, 0, 210, 42, 'F');

    // Inject Logo
    try {
      doc.addImage(logoImg, 'WEBP', 15, 6, 28, 28);
    } catch (e) {
      console.warn('Failed to embed webp logo in PDF, drawing text fallback:', e);
    }

    // Company Header Text
    doc.setTextColor(accentRgb[0], accentRgb[1], accentRgb[2]);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text('ADITHYA EVENT MANAGEMENT', 48, 18);

    doc.setTextColor(secondaryRgb[0], secondaryRgb[1], secondaryRgb[2]);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text('Premium Royal Events & Catering | Vijayawada, Andhra Pradesh', 48, 26);
    doc.text('Call: +91 93932 17676 | Email: info@adithyaevents.com', 48, 32);

    // Separator line
    doc.setDrawColor(accentRgb[0], accentRgb[1], accentRgb[2]);
    doc.setLineWidth(1);
    doc.line(0, 42, 210, 42);

    // Invoice Title
    doc.setTextColor(darkRgb[0], darkRgb[1], darkRgb[2]);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('OFFICIAL PAYMENT RECEIPT', 15, 54);

    // Metadata
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Receipt No: ${paymentData.receiptNo || 'AE-REC-xxxx'}`, 140, 52);
    doc.text(`Date: ${new Date(paymentData.timestamp).toLocaleDateString('en-IN')}`, 140, 58);
    doc.text(`Payment Ref ID: ${paymentData.transactionId || 'N/A'}`, 140, 64);

    // Border separator
    doc.setDrawColor(primaryRgb[0], primaryRgb[1], primaryRgb[2]);
    doc.line(15, 70, 195, 70);

    // Split view Customer / Event info
    doc.setFont('helvetica', 'bold');
    doc.text('Client Name:', 15, 79);
    doc.setFont('helvetica', 'normal');
    doc.text(bookingData.customerName, 45, 79);

    doc.setFont('helvetica', 'bold');
    doc.text('Phone Number:', 15, 85);
    doc.setFont('helvetica', 'normal');
    doc.text(bookingData.customerPhone, 45, 85);

    doc.setFont('helvetica', 'bold');
    doc.text('Event Type:', 105, 79);
    doc.setFont('helvetica', 'normal');
    doc.text(bookingData.eventType.toUpperCase(), 135, 79);

    doc.setFont('helvetica', 'bold');
    doc.text('Event Date:', 105, 85);
    doc.setFont('helvetica', 'normal');
    doc.text(bookingData.eventDate, 135, 85);

    doc.setFont('helvetica', 'bold');
    doc.text('Event Venue:', 105, 91);
    doc.setFont('helvetica', 'normal');
    doc.text(bookingData.venueName || 'To Be Specified', 135, 91);

    doc.line(15, 98, 195, 98);

    // Transaction details table simulation
    doc.setFont('helvetica', 'bold');
    doc.text('Description', 15, 107);
    doc.text('Status', 105, 107);
    doc.text('Amount Paid', 180, 107, { align: 'right' });

    doc.setFont('helvetica', 'normal');
    doc.text(`Advance / Installment payment for Booking ID: ${bookingData.id}`, 15, 117);
    
    // Status text in success green
    doc.setTextColor(46, 204, 113);
    doc.setFont('helvetica', 'bold');
    doc.text('PAID (Razorpay)', 105, 117);
    
    doc.setTextColor(darkRgb[0], darkRgb[1], darkRgb[2]);
    doc.setFont('helvetica', 'normal');
    doc.text(formatCurrency(paymentData.amount), 180, 117, { align: 'right' });

    doc.line(15, 125, 195, 125);

    // Bottom summaries
    doc.setFont('helvetica', 'bold');
    doc.text('Total Event Cost:', 110, 135);
    doc.setFont('helvetica', 'normal');
    doc.text(formatCurrency(bookingData.totalAmount), 180, 135, { align: 'right' });

    doc.setFont('helvetica', 'bold');
    doc.text('This Payment:', 110, 141);
    doc.setFont('helvetica', 'normal');
    doc.text(formatCurrency(paymentData.amount), 180, 141, { align: 'right' });

    // Compute balance
    const paidSoFar = (bookingData.paidAmount || 0) + paymentData.amount;
    const balance = bookingData.totalAmount - paidSoFar;

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(primaryRgb[0], primaryRgb[1], primaryRgb[2]);
    doc.text('REMAINING BALANCE DUE:', 110, 149);
    doc.text(formatCurrency(balance > 0 ? balance : 0), 180, 149, { align: 'right' });

    // QR Verification Block
    drawQRVerificationBlock(doc, 15, 135, 18);
    doc.setFontSize(7.5);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'italic');
    doc.text('Scan to verify payment', 15, 158);

    // Signature lines
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'normal');
    doc.text('Authorized Representative', 145, 181);
    doc.line(135, 176, 190, 176);

    doc.setFontSize(8);
    doc.text('This is a computer-generated tax invoice and receipt. No physical signature is required.', 105, 196, { align: 'center' });
    doc.text('Contact +91 93932 17676 for billing inquiries.', 105, 201, { align: 'center' });

    // Save PDF
    doc.save(`Adithya_Events_Receipt_${paymentData.receiptNo}.pdf`);
  };

  // Trigger loading image, and generate PDF
  if (logoImg.complete) {
    buildPdf();
  } else {
    logoImg.onload = buildPdf;
    logoImg.onerror = buildPdf;
  }
};
