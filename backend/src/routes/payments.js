import { Router } from "express";
import { db } from "../db/db.js";

const router = Router();

let stripe = null;
if (process.env.STRIPE_SECRET_KEY) {
  const Stripe = (await import("stripe")).default;
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
}

// POST /api/payments/card-intent  { orderNumber }
// Creates a Stripe PaymentIntent for the order total. If Stripe isn't
// configured (no STRIPE_SECRET_KEY in .env), returns a simulated intent so
// the storefront flow can still be demoed end-to-end.
router.post("/card-intent", async (req, res) => {
  const { orderNumber } = req.body;
  const order = db.prepare("SELECT * FROM orders WHERE order_number = ?").get(orderNumber);
  if (!order) return res.status(404).json({ error: "Order not found" });

  if (!stripe) {
    return res.json({
      simulated: true,
      clientSecret: "simulated_secret_no_stripe_key_configured",
      amount: order.total,
      currency: "pkr",
    });
  }

  try {
    const intent = await stripe.paymentIntents.create({
      amount: order.total * 1, // PKR is a zero-decimal-ish currency for demo; adjust per Stripe currency rules in production
      currency: "pkr",
      metadata: { orderNumber: order.order_number },
    });
    res.json({ simulated: false, clientSecret: intent.client_secret, amount: order.total, currency: "pkr" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/payments/confirm-card  { orderNumber }
// Called by frontend after Stripe confirms (or immediately, in simulated mode).
router.post("/confirm-card", (req, res) => {
  const { orderNumber } = req.body;
  const order = db.prepare("SELECT * FROM orders WHERE order_number = ?").get(orderNumber);
  if (!order) return res.status(404).json({ error: "Order not found" });
  db.prepare("UPDATE orders SET payment_status = 'paid' WHERE id = ?").run(order.id);
  res.json({ ok: true });
});

export default router;
