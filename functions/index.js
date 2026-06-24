// functions/index.js
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const Razorpay = require("razorpay");
const crypto = require("crypto");

admin.initializeApp();

// Initialize Razorpay SDK using firebase environment parameters
const razorpayKeyId = functions.config().razorpay?.key_id || "rzp_test_adithya17676";
const razorpayKeySecret = functions.config().razorpay?.key_secret || "rzp_test_secret_key";

const rzpInstance = new Razorpay({
  key_id: razorpayKeyId,
  key_secret: razorpayKeySecret
});

/**
 * Cloud Function to create Razorpay Order
 * Trigger: HTTPS Callable
 */
exports.createRazorpayOrder = functions.region("asia-south1").https.onCall(async (data, context) => {
  const { amount, bookingId } = data;
  if (!amount || !bookingId) {
    throw new functions.https.HttpsError("invalid-argument", "Amount and Booking reference are required.");
  }

  const options = {
    amount: Math.round(amount * 100), // convert to paise
    currency: "INR",
    receipt: `rcpt_${bookingId.substring(0, 10)}`,
    notes: {
      bookingId
    }
  };

  try {
    const order = await rzpInstance.orders.create(options);
    return {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency
    };
  } catch (error) {
    console.error("Razorpay order creation failed:", error);
    throw new functions.https.HttpsError("internal", error.message || "Failed to create order.");
  }
});

/**
 * Cloud Function to verify Razorpay Cryptographic Signature
 * Trigger: HTTPS Callable
 */
exports.verifyRazorpayPayment = functions.region("asia-south1").https.onCall(async (data, context) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = data;
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    throw new functions.https.HttpsError("invalid-argument", "Missing required transaction parameter keys.");
  }

  const generatedSignature = crypto
    .createHmac("sha256", razorpayKeySecret)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");

  if (generatedSignature === razorpay_signature) {
    return { status: "success", verified: true };
  } else {
    throw new functions.https.HttpsError("permission-denied", "Cryptographic signature validation failed.");
  }
});
