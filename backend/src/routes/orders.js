import { Router } from "express";
import { db } from "../db/db.js";

const router = Router();

const SHIPPING_FEE = 200; // flat PKR shipping fee, free above threshold
const FREE_SHIPPING_THRESHOLD = 5000;

function generateOrderNumber() {
  const date = new Date();
  const y = date.getFullYear().toString().slice(-2);
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `TRZ-${y}${(date.getMonth() + 1).toString().padStart(2, "0")}-${rand}`;
}

// POST /api/orders  -> creates an order from cart items
router.post("/", (req, res) => {
  const { customer, items, paymentMethod } = req.body;

  if (!customer || !items || !items.length) {
    return res.status(400).json({ error: "Missing customer info or cart items" });
  }
  if (!["cod", "card", "jazzcash", "easypaisa"].includes(paymentMethod)) {
    return res.status(400).json({ error: "Invalid payment method" });
  }
  const { name, phone, email, address, city } = customer;
  if (!name || !phone || !address || !city) {
    return res.status(400).json({ error: "Missing required customer fields" });
  }

  // Validate products & compute totals server-side (never trust client prices)
  const getProduct = db.prepare("SELECT * FROM products WHERE id = ?");
  let subtotal = 0;
  const resolvedItems = [];

  for (const item of items) {
    const product = getProduct.get(item.productId);
    if (!product) {
      return res.status(400).json({ error: `Product ${item.productId} not found` });
    }
    if (product.stock < item.quantity) {
      return res.status(400).json({ error: `${product.name} is out of stock` });
    }
    const lineTotal = product.price * item.quantity;
    subtotal += lineTotal;
    resolvedItems.push({
      product_id: product.id,
      product_name: product.name,
      unit_price: product.price,
      quantity: item.quantity,
      image: product.image,
    });
  }

  const shipping_fee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shipping_fee;
  const order_number = generateOrderNumber();

  const insertOrder = db.prepare(`
    INSERT INTO orders
      (order_number, customer_name, phone, email, address, city, payment_method, payment_status, subtotal, shipping_fee, total)
    VALUES (@order_number, @customer_name, @phone, @email, @address, @city, @payment_method, @payment_status, @subtotal, @shipping_fee, @total)
  `);

  const payment_status = paymentMethod === "cod" ? "pending" : "pending";

  const info = insertOrder.run({
    order_number,
    customer_name: name,
    phone,
    email: email || null,
    address,
    city,
    payment_method: paymentMethod,
    payment_status,
    subtotal,
    shipping_fee,
    total,
  });

  const orderId = info.lastInsertRowid;
  const insertItem = db.prepare(`
    INSERT INTO order_items (order_id, product_id, product_name, unit_price, quantity, image)
    VALUES (@order_id, @product_id, @product_name, @unit_price, @quantity, @image)
  `);
  const decrementStock = db.prepare("UPDATE products SET stock = stock - ? WHERE id = ?");

  resolvedItems.forEach((it) => {
    insertItem.run({ ...it, order_id: orderId });
    decrementStock.run(it.quantity, it.product_id);
  });

  res.status(201).json({
    orderId,
    orderNumber: order_number,
    subtotal,
    shippingFee: shipping_fee,
    total,
    paymentMethod,
    // For jazzcash/easypaisa/card we return instructions; frontend routes accordingly
    nextStep:
      paymentMethod === "cod"
        ? "confirmed"
        : paymentMethod === "card"
        ? "card_payment"
        : "wallet_payment",
  });
});

// GET /api/orders/:orderNumber  -> order confirmation lookup
router.get("/:orderNumber", (req, res) => {
  const order = db
    .prepare("SELECT * FROM orders WHERE order_number = ?")
    .get(req.params.orderNumber);
  if (!order) return res.status(404).json({ error: "Order not found" });
  const items = db
    .prepare("SELECT * FROM order_items WHERE order_id = ?")
    .all(order.id);
  res.json({ ...order, items });
});

// POST /api/orders/:orderNumber/confirm-wallet-payment
// Simulated JazzCash / Easypaisa confirmation: customer submits the mobile
// account number + transaction ID they used to pay; marked pending admin review.
router.post("/:orderNumber/confirm-wallet-payment", (req, res) => {
  const { accountNumber, transactionId } = req.body;
  const order = db
    .prepare("SELECT * FROM orders WHERE order_number = ?")
    .get(req.params.orderNumber);
  if (!order) return res.status(404).json({ error: "Order not found" });
  if (!accountNumber || !transactionId) {
    return res.status(400).json({ error: "Account number and transaction ID are required" });
  }
  db.prepare(
    "UPDATE orders SET transaction_ref = ?, payment_status = 'pending' WHERE id = ?"
  ).run(`${accountNumber} / ${transactionId}`, order.id);
  res.json({ ok: true, message: "Payment details received, awaiting confirmation." });
});

export default router;
