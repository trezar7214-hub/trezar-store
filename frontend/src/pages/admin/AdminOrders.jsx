import { useEffect, useState } from "react";
import { adminApi, formatPKR } from "../../lib/api";

const ORDER_STATUSES = ["processing", "shipped", "delivered", "cancelled"];
const PAYMENT_STATUSES = ["pending", "paid", "failed"];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [details, setDetails] = useState(null);

  function load() {
    setLoading(true);
    adminApi.listOrders().then(setOrders).finally(() => setLoading(false));
  }
  useEffect(load, []);

  async function toggleExpand(order) {
    if (expanded === order.id) {
      setExpanded(null);
      return;
    }
    setExpanded(order.id);
    const full = await adminApi.getOrder(order.id);
    setDetails(full);
  }

  async function updateStatus(id, field, value) {
    await adminApi.updateOrderStatus(id, { [field]: value });
    load();
  }

  return (
    <div>
      <h1 className="font-display text-2xl mb-6">Orders</h1>
      <div className="bg-cream rounded-xl shadow-soft overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead>
            <tr className="text-left text-plum-soft/70 border-b border-plum/10">
              <th className="py-3 px-4">Order #</th>
              <th>Customer</th>
              <th>Payment</th>
              <th>Payment Status</th>
              <th>Order Status</th>
              <th className="text-right px-4">Total</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="py-8 text-center text-plum-soft/60">Loading…</td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan={6} className="py-8 text-center text-plum-soft/60">No orders yet.</td></tr>
            ) : (
              orders.map((o) => (
                <>
                  <tr
                    key={o.id}
                    className="border-b border-plum/5 cursor-pointer hover:bg-blush/40"
                    onClick={() => toggleExpand(o)}
                  >
                    <td className="py-3 px-4">{o.order_number}</td>
                    <td>{o.customer_name}</td>
                    <td className="capitalize">{o.payment_method}</td>
                    <td>
                      <select
                        value={o.payment_status}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => updateStatus(o.id, "payment_status", e.target.value)}
                        className="capitalize border border-plum/15 rounded px-2 py-1 text-xs"
                      >
                        {PAYMENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td>
                      <select
                        value={o.order_status}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => updateStatus(o.id, "order_status", e.target.value)}
                        className="capitalize border border-plum/15 rounded px-2 py-1 text-xs"
                      >
                        {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="text-right px-4">{formatPKR(o.total)}</td>
                  </tr>
                  {expanded === o.id && details && (
                    <tr className="bg-blush/30">
                      <td colSpan={6} className="p-4">
                        <div className="text-xs text-plum-soft space-y-1 mb-3">
                          <p>Phone: {details.phone} {details.email && `· ${details.email}`}</p>
                          <p>Address: {details.address}, {details.city}</p>
                          {details.transaction_ref && <p>Transaction ref: {details.transaction_ref}</p>}
                        </div>
                        <ul className="text-sm space-y-1">
                          {details.items?.map((it) => (
                            <li key={it.id} className="flex justify-between max-w-md">
                              <span>{it.product_name} × {it.quantity}</span>
                              <span>{formatPKR(it.unit_price * it.quantity)}</span>
                            </li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  )}
                </>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
