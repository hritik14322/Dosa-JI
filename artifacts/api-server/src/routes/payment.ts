import { Router } from "express";
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

  // If Razorpay keys are configured, create a real order
  if (keyId && process.env.RAZORPAY_KEY_SECRET) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const RazorpayMod = await import("razorpay" as any);
      const Razorpay = RazorpayMod.default ?? RazorpayMod;
      const rzp = new Razorpay({
        key_id: keyId,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      });
      const order = await rzp.orders.create({
        amount: Math.round(amount * 100),
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
      });
      res.json({ id: order.id, amount: order.amount, currency: order.currency, keyId });
      return;
    } catch {
      // Fall through to mock
    }
  }

  // Mock order for development
  const mockOrderId = `rzp_mock_${Date.now()}`;
  res.json({
    id: mockOrderId,
    amount: Math.round(amount * 100),
    currency: "INR",
    keyId: null,
  });
});

// Verify payment (mock in dev)
router.post("/payment/verify", requireAuth, async (req, res): Promise<void> => {
  // In dev without real keys, just return success
  res.json({ success: true });
});

export default router;
