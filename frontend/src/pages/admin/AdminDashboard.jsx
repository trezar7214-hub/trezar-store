import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminApi } from "../../lib/api";
import { formatPKR } from "../../lib/api";

export default function AdminDashboard() {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    adminApi.summary().then(setSummary).catch((e) => setError(e.message));
  }, []);

  if (error) return <p className="text-red-600">{error}</p>;
  if (!summary) return <p className="text-plum-soft">Loading…</p>;

  const cards = [
    { label: "Total Orders", value: summary.totalOrders },
    { label: "Revenue", value: formatPKR(summary.totalRevenue) },
    { label: "Products", value: summary.totalProducts },
    { label: "Low Stock (≤5)", value: summary.lowStock },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {cards.map((c) => (
          <div key={c.label} className="bg-cream rounded-xl p-5 shadow-soft">
            <p className="text-xs font-label uppercase tracking-wide text-plum-soft">{c.label}</p>
            <p className="font-display text-2xl mt-2">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-cream rounded-xl p-5 shadow-soft">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl">Recent Orders</h2>
          <Link to="/admin/orders" className="text-xs font-label uppercase tracking-wide text-rosegold-deep">
            View All →
          </Link>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-plum-soft/70 border-b border-plum/10">
              <th className="py-2">Order #</th>
              <th>Customer</th>
              <th>Payment</th>
              <th>Status</th>
              <th className="text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {summary.recentOrders.map((o) => (
              <tr key={o.id} className="border-b border-plum/5">
                <td className="py-2">{o.order_number}</td>
                <td>{o.customer_name}</td>
                <td className="capitalize">{o.payment_method}</td>
                <td className="capitalize">{o.order_status}</td>
                <td className="text-right">{formatPKR(o.total)}</td>
              </tr>
            ))}
            {summary.recentOrders.length === 0 && (
              <tr><td colSpan={5} className="py-6 text-center text-plum-soft/60">No orders yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
