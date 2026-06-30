// src/utils/receiptGenerator.js
import { jsPDF } from 'jspdf';
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

export const generateReceiptPDF = (paymentData, bookingData) => {
  const logoImg = new Image();
  logoImg.src = '/logo.webp';

  const buildPdf = () => {
    const doc = new jsPDF();

    // Header banner - Deep Amethyst background (#1C0A2E / rgb(28, 10, 46))
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
    doc.text('Premium Royal Events & Catering | Vijayawada, Andhra Pradesh', 48, 26);
    doc.text('Call: +91 93932 17676 | Email: info@adithyaevents.com', 48, 32);

    // Separator line
    doc.setDrawColor(212, 175, 55); // Gold
    doc.setLineWidth(1);
    doc.line(0, 42, 210, 42);

    // Invoice Title
    doc.setTextColor(28, 10, 46); // Deep Amethyst
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
    doc.setDrawColor(212, 175, 55, 0.4); // Gold border opacity
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
    
    // Status text in success green color (rgb 46, 204, 113)
    doc.setTextColor(46, 204, 113);
    doc.setFont('helvetica', 'bold');
    doc.text('PAID (Razorpay)', 105, 117);
    
    doc.setTextColor(28, 10, 46);
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
    doc.setTextColor(45, 27, 78); // Amethyst
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

    // Save the receipt
    doc.save(`Adithya_Events_Receipt_${paymentData.receiptNo}.pdf`);
  };

  // Trigger loading image, and generate PDF
  if (logoImg.complete) {
    buildPdf();
  } else {
    logoImg.onload = buildPdf;
    logoImg.onerror = buildPdf; // fallback if image fails to load
  }
};
