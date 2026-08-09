import { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { api, formatPKR } from "../lib/api";

const MERCHANT_NUMBERS = {
  jazzcash: "0300-1234567",
  easypaisa: "0300-1234567",
};

export default function WalletPayment() {
  const { orderNumber } = useParams();
  const [searchParams] = useSearchParams();
  const method = searchParams.get("method") || "jazzcash";
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [accountNumber, setAccountNumber] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.getOrder(orderNumber).then(setOrder).catch(() => {});
  }, [orderNumber]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!accountNumber || !transactionId) {
      setError("Please enter both your account number and transaction ID.");
      return;
    }
    setSubmitting(true);
    try {
      await api.confirmWalletPayment(orderNumber, { accountNumber, transactionId });
      setDone(true);
      setTimeout(() => navigate(`/order-success/${orderNumber}`), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  const methodLabel = method === "easypaisa" ? "Easypaisa" : "JazzCash";

  return (
    <div className="max-w-lg mx-auto px-5 py-16">
      <p className="font-label text-xs uppercase tracking-widest2 text-rosegold-deep text-center">
        Order {orderNumber}
      </p>
      <h1 className="font-display text-3xl text-center mt-2">Pay with {methodLabel}</h1>

      {order && (
        <p className="text-center text-plum-soft mt-3">
          Amount to pay: <span className="font-medium text-plum">{formatPKR(order.total)}</span>
        </p>
      )}

      <div className="bg-blush rounded-xl p-6 mt-8 text-sm text-plum-soft leading-relaxed">
        <p className="font-label text-plum uppercase tracking-wide text-xs mb-2">How to pay</p>
        <ol className="list-decimal list-inside space-y-1">
          <li>Open your {methodLabel} app.</li>
          <li>Send {order ? formatPKR(order.total) : "the order total"} to <strong>{MERCHANT_NUMBERS[method]}</strong> (Trezar).</li>
          <li>Copy the transaction ID from your payment receipt.</li>
          <li>Enter your details below to confirm your order.</li>
        </ol>
      </div>

      {done ? (
        <p className="text-center text-rosegold-deep mt-8 font-label">
          Payment details received! Redirecting to your order…
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <label className="block">
            <span className="text-xs font-label uppercase tracking-wide text-plum-soft">
              Your {methodLabel} Account Number
            </span>
            <input
              className="input mt-1"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="03XXXXXXXXX"
            />
          </label>
          <label className="block">
            <span className="text-xs font-label uppercase tracking-wide text-plum-soft">
              Transaction ID
            </span>
            <input
              className="input mt-1"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              placeholder="e.g. TXN123456789"
            />
          </label>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-plum text-cream px-7 py-3 font-label text-xs uppercase tracking-widest2 hover:bg-rosegold-deep transition-colors disabled:opacity-50"
          >
            {submitting ? "Confirming…" : "I've Made the Payment"}
          </button>
        </form>
      )}
    </div>
  );
}
