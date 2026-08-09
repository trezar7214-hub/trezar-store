import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../lib/api";

export default function AdminLogin() {
  const [email, setEmail] = useState("admin@trezar.pk");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { token } = await api.adminLogin(email, password);
      localStorage.setItem("trezar_admin_token", token);
      navigate("/admin");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-5">
      <div className="max-w-sm w-full">
        <div className="text-center mb-8">
          <img src="/trezar-mark.svg" alt="" className="w-12 h-12 mx-auto mb-3" />
          <h1 className="font-display text-2xl">Trezar Admin</h1>
          <p className="text-sm text-plum-soft mt-1">Sign in to manage the store</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-xs font-label uppercase tracking-wide text-plum-soft">Email</span>
            <input className="input mt-1" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label className="block">
            <span className="text-xs font-label uppercase tracking-wide text-plum-soft">Password</span>
            <input type="password" className="input mt-1" value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-plum text-cream px-7 py-3 font-label text-xs uppercase tracking-widest2 hover:bg-rosegold-deep transition-colors disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
        <p className="text-xs text-plum-soft/60 text-center mt-6">
          Default: admin@trezar.pk / Trezar@123
        </p>
      </div>
    </div>
  );
}
