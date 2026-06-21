import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";

const router = express.Router();
export const createEnrollment = async (req, res) => {
const razorPay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

router.post("/create-order", async (req, res) => {
  try {
    const amount = 499 * 100; // Razorpay amount in paise

    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    res.json({
      success: true,
      key: process.env.RAZORPAY_KEY_ID,
      order,
      enrollmentId: Date.now(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.post("/verify-payment", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    if (expectedSign === razorpay_signature) {
      res.json({
        success: true,
        message: "Payment verified",
        couponCode: "COURSE499",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
}
export default router;

