import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api, formatPKR } from "../lib/api";

export default function OrderSuccess() {
  const { orderNumber } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getOrder(orderNumber).then(setOrder).catch(() => {}).finally(() => setLoading(false));
  }, [orderNumber]);

  if (loading) return <div className="text-center py-24 text-plum-soft">Loading…</div>;
  if (!order) {
    return (
      <div className="text-center py-24">
        <p className="font-display text-2xl">We couldn't find that order.</p>
        <Link to="/shop" className="text-rosegold-deep underline mt-4 inline-block">Back to shop</Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-5 py-20 text-center">
      <div className="w-16 h-16 rounded-full bg-blush flex items-center justify-center mx-auto">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path d="M5 13l4 4L19 7" stroke="#A2664E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h1 className="font-display text-3xl mt-6">Thank you, {order.customer_name.split(" ")[0]}!</h1>
      <p className="text-plum-soft mt-2">
        Your order <strong>{order.order_number}</strong> has been placed successfully.
      </p>

      <div className="bg-blush rounded-xl p-6 mt-8 text-left">
        <div className="flex justify-between text-sm text-plum-soft mb-1">
          <span>Payment Method</span>
          <span className="capitalize">{order.payment_method}</span>
        </div>
        <div className="flex justify-between text-sm text-plum-soft mb-1">
          <span>Payment Status</span>
          <span className="capitalize">{order.payment_status}</span>
        </div>
        <div className="flex justify-between text-sm text-plum-soft mb-4">
          <span>Delivery Address</span>
          <span className="text-right max-w-[60%]">{order.address}, {order.city}</span>
        </div>
        <div className="divider-gold my-3" />
        <ul className="space-y-1 text-sm text-plum-soft">
          {order.items?.map((it) => (
            <li key={it.id} className="flex justify-between">
              <span>{it.product_name} × {it.quantity}</span>
              <span>{formatPKR(it.unit_price * it.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="divider-gold my-3" />
        <div className="flex justify-between font-display text-lg">
          <span>Total</span>
          <span>{formatPKR(order.total)}</span>
        </div>
      </div>

      <p className="text-sm text-plum-soft mt-6">
        We'll reach out on <strong>{order.phone}</strong> to confirm delivery details.
      </p>

      <Link
        to="/shop"
        className="inline-block mt-8 bg-plum text-cream px-7 py-3 font-label text-xs uppercase tracking-widest2 hover:bg-rosegold-deep transition-colors"
      >
        Continue Shopping
      </Link>
    </div>
  );
}
