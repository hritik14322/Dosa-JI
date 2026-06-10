import { Router } from "express";
import { createHmac } from "crypto";
import { requireAuth } from "../lib/auth";
import { CreatePaymentOrderBody } from "@workspace/api-zod";

const router = Router();

// Create Razorpay order (mock in dev when no key is set)
router.post("/payment/create-order", requireAuth, async (req, res): Promise<void> => {
  const parsed = CreatePaymentOrderBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { amount } = parsed.data;
  const keyId = process.env.RAZORPAY_KEY_ID ?? null;

  if (keyId && process.env.RAZORPAY_KEY_SECRET) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const RazorpayMod = await import("razorpay" as any);
      const Razorpay = RazorpayMod.default ?? RazorpayMod;
      const rzp = new Razorpay({ key_id: keyId, key_secret: process.env.RAZORPAY_KEY_SECRET });
      const order = await rzp.orders.create({
        amount: Math.round(amount * 100),
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
      });
      res.json({ id: order.id, amount: order.amount, currency: order.currency, keyId });
      return;
    } catch (err) {
      req.log.error({ err }, "Razorpay order creation failed, falling back to mock");
    }
  }

  // Mock order for development / when no keys configured
  res.json({
    id: `rzp_mock_${Date.now()}`,
    amount: Math.round(amount * 100),
    currency: "INR",
    keyId: null,
  });
});

// Verify Razorpay payment signature
router.post("/payment/verify", requireAuth, async (req, res): Promise<void> => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body ?? {};

  // Mock mode — no real keys, just return success
  if (!process.env.RAZORPAY_KEY_SECRET) {
    res.json({ success: true });
    return;
  }

  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    res.status(400).json({ error: "Missing payment verification fields" });
    return;
  }

  const expected = createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");

  if (expected !== razorpaySignature) {
    req.log.warn({ razorpayOrderId, razorpayPaymentId }, "Payment signature mismatch");
    res.status(400).json({ error: "Payment signature verification failed" });
    return;
  }

  res.json({ success: true });
});

export default router;
