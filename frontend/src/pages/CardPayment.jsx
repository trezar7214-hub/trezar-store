import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api, formatPKR } from "../lib/api";

export default function CardPayment() {
  const { orderNumber } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [intent, setIntent] = useState(null);
  const [card, setCard] = useState({ number: "", name: "", expiry: "", cvv: "" });
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.getOrder(orderNumber).then(setOrder).catch(() => {});
    api.createCardIntent(orderNumber).then(setIntent).catch(() => {});
  }, [orderNumber]);

  async function handlePay(e) {
    e.preventDefault();
    setError("");
    if (card.number.replace(/\s/g, "").length < 12 || !card.name || !card.expiry || card.cvv.length < 3) {
      setError("Please fill in all card details correctly.");
      return;
    }
    setProcessing(true);
    try {
      // In a production build with a real Stripe key, this step would use
      // Stripe.js / Elements to confirm the PaymentIntent client-side before
      // calling the backend. Here we confirm directly against our API.
      await api.confirmCardPayment(orderNumber);
      navigate(`/order-success/${orderNumber}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto px-5 py-16">
      <p className="font-label text-xs uppercase tracking-widest2 text-rosegold-deep text-center">
        Order {orderNumber}
      </p>
      <h1 className="font-display text-3xl text-center mt-2">Pay by Card</h1>
      {order && (
        <p className="text-center text-plum-soft mt-3">
          Amount to pay: <span className="font-medium text-plum">{formatPKR(order.total)}</span>
        </p>
      )}

      {intent?.simulated && (
        <p className="text-xs text-center text-rosegold-deep bg-blush rounded-lg px-4 py-2 mt-6">
          Demo mode: no live Stripe key configured, so this payment is simulated and won't charge a real card.
        </p>
      )}

      <form onSubmit={handlePay} className="mt-8 space-y-4">
        <label className="block">
          <span className="text-xs font-label uppercase tracking-wide text-plum-soft">Cardholder Name</span>
          <input
            className="input mt-1"
            value={card.name}
            onChange={(e) => setCard({ ...card, name: e.target.value })}
            placeholder="Name on card"
          />
        </label>
        <label className="block">
          <span className="text-xs font-label uppercase tracking-wide text-plum-soft">Card Number</span>
          <input
            className="input mt-1"
            value={card.number}
            onChange={(e) => setCard({ ...card, number: e.target.value })}
            placeholder="1234 5678 9012 3456"
            inputMode="numeric"
          />
        </label>
        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="text-xs font-label uppercase tracking-wide text-plum-soft">Expiry</span>
            <input
              className="input mt-1"
              value={card.expiry}
              onChange={(e) => setCard({ ...card, expiry: e.target.value })}
              placeholder="MM/YY"
            />
          </label>
          <label className="block">
            <span className="text-xs font-label uppercase tracking-wide text-plum-soft">CVV</span>
            <input
              className="input mt-1"
              value={card.cvv}
              onChange={(e) => setCard({ ...card, cvv: e.target.value })}
              placeholder="123"
              inputMode="numeric"
            />
          </label>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={processing}
          className="w-full bg-plum text-cream px-7 py-3 font-label text-xs uppercase tracking-widest2 hover:bg-rosegold-deep transition-colors disabled:opacity-50"
        >
          {processing ? "Processing…" : `Pay ${order ? formatPKR(order.total) : ""}`}
        </button>
      </form>
    </div>
  );
}
