import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { api, formatPKR } from "../lib/api";

const PAYMENT_METHODS = [
  { id: "cod", label: "Cash on Delivery", desc: "Pay in cash when your order arrives." },
  { id: "jazzcash", label: "JazzCash", desc: "Pay instantly from your JazzCash wallet." },
  { id: "easypaisa", label: "Easypaisa", desc: "Pay instantly from your Easypaisa wallet." },
  { id: "card", label: "Debit / Credit Card", desc: "Visa, Mastercard supported." },
];

const SHIPPING_FEE = 200;
const FREE_SHIPPING_THRESHOLD = 5000;

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "", city: "" });
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-5 py-24 text-center">
        <h1 className="font-display text-3xl">Nothing to check out</h1>
        <Link to="/shop" className="text-rosegold-deep underline mt-4 inline-block">Browse the collection</Link>
      </div>
    );
  }

  function updateField(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handlePlaceOrder(e) {
    e.preventDefault();
    setError("");

    if (!form.name || !form.phone || !form.address || !form.city) {
      setError("Please fill in your name, phone, address and city.");
      return;
    }
    if (!/^0?3\d{9}$/.test(form.phone.replace(/[\s-]/g, ""))) {
      setError("Please enter a valid Pakistani mobile number (e.g. 03XXXXXXXXX).");
      return;
    }

    setSubmitting(true);
    try {
      const order = await api.createOrder({
        customer: form,
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        paymentMethod,
      });
      clearCart();
      if (order.nextStep === "confirmed") {
        navigate(`/order-success/${order.orderNumber}`);
      } else if (order.nextStep === "card_payment") {
        navigate(`/pay/card/${order.orderNumber}`);
      } else {
        navigate(`/pay/wallet/${order.orderNumber}?method=${paymentMethod}`);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-5 md:px-8 py-12">
      <h1 className="font-display text-3xl mb-8">Checkout</h1>

      <form onSubmit={handlePlaceOrder} className="grid md:grid-cols-3 gap-10">
        <div className="md:col-span-2 space-y-8">
          <section>
            <h2 className="font-display text-xl mb-4">Delivery Details</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Full Name" required>
                <input className="input" value={form.name} onChange={(e) => updateField("name", e.target.value)} />
              </Field>
              <Field label="Phone Number" required hint="e.g. 03XXXXXXXXX">
                <input className="input" value={form.phone} onChange={(e) => updateField("phone", e.target.value)} />
              </Field>
              <Field label="Email (optional)">
                <input type="email" className="input" value={form.email} onChange={(e) => updateField("email", e.target.value)} />
              </Field>
              <Field label="City" required>
                <input className="input" value={form.city} onChange={(e) => updateField("city", e.target.value)} />
              </Field>
              <Field label="Full Address" required className="sm:col-span-2">
                <textarea rows={3} className="input" value={form.address} onChange={(e) => updateField("address", e.target.value)} />
              </Field>
            </div>
          </section>

          <section>
            <h2 className="font-display text-xl mb-4">Payment Method</h2>
            <div className="space-y-3">
              {PAYMENT_METHODS.map((m) => (
                <label
                  key={m.id}
                  className={`flex items-center gap-4 border rounded-lg px-4 py-3 cursor-pointer transition-colors ${
                    paymentMethod === m.id ? "border-rosegold-deep bg-blush" : "border-plum/15"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={m.id}
                    checked={paymentMethod === m.id}
                    onChange={() => setPaymentMethod(m.id)}
                    className="accent-rosegold-deep"
                  />
                  <div>
                    <p className="font-label text-sm">{m.label}</p>
                    <p className="text-xs text-plum-soft">{m.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </section>

          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        <aside className="bg-blush rounded-xl p-6 h-fit">
          <h2 className="font-display text-xl mb-4">Order Summary</h2>
          <ul className="space-y-2 text-sm text-plum-soft mb-4 max-h-48 overflow-y-auto no-scrollbar">
            {items.map((i) => (
              <li key={i.productId} className="flex justify-between">
                <span>{i.name} × {i.quantity}</span>
                <span>{formatPKR(i.price * i.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="divider-gold my-3" />
          <div className="flex justify-between text-sm text-plum-soft">
            <span>Subtotal</span>
            <span>{formatPKR(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm text-plum-soft mt-1">
            <span>Shipping</span>
            <span>{shipping === 0 ? "Free" : formatPKR(shipping)}</span>
          </div>
          <div className="flex justify-between font-display text-lg mt-3">
            <span>Total</span>
            <span>{formatPKR(total)}</span>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="mt-6 w-full bg-plum text-cream px-7 py-3 font-label text-xs uppercase tracking-widest2 hover:bg-rosegold-deep transition-colors disabled:opacity-50"
          >
            {submitting ? "Placing Order…" : "Place Order"}
          </button>
        </aside>
      </form>
    </div>
  );
}

function Field({ label, required, hint, className = "", children }) {
  return (
    <label className={`block ${className}`}>
      <span className="text-xs font-label uppercase tracking-wide text-plum-soft">
        {label} {required && <span className="text-rosegold-deep">*</span>}
      </span>
      <div className="mt-1">{children}</div>
      {hint && <span className="text-xs text-plum-soft/60">{hint}</span>}
    </label>
  );
}
