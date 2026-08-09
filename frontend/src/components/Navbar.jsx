import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const LINKS = [
  { label: "Shop All", to: "/shop" },
  { label: "Earrings", to: "/shop?category=earrings" },
  { label: "Necklace Sets", to: "/shop?category=necklace-sets" },
  { label: "Bridal", to: "/shop?category=bridal-sets" },
];

export default function Navbar() {
  const { count } = useCart();
  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  function handleSearch(e) {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
    setMobileOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 bg-cream/90 backdrop-blur border-b border-rosegold-light/40">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="flex items-center justify-between h-20">
          <button
            className="md:hidden text-plum"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>

          <Link to="/" className="flex items-center gap-2 mx-auto md:mx-0">
            <img src="/trezar-mark.svg" alt="" className="w-9 h-9" />
            <span className="font-display text-2xl tracking-widest2 text-plum">TREZAR</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 font-label text-[13px] uppercase tracking-wide text-plum-soft">
            {LINKS.map((l) => (
              <Link key={l.to} to={l.to} className="hover:text-rosegold-deep transition-colors">
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <form onSubmit={handleSearch} className="hidden md:flex items-center border-b border-plum/20 focus-within:border-rosegold-deep transition-colors">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                type="text"
                placeholder="Search pieces..."
                className="bg-transparent outline-none text-sm py-1 px-1 w-36 placeholder:text-plum-soft/60"
              />
              <button type="submit" aria-label="Search">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="11" cy="11" r="7" stroke="#3E2A2C" strokeWidth="1.5" />
                  <path d="M21 21l-4-4" stroke="#3E2A2C" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </form>

            <Link to="/cart" className="relative" aria-label="Cart">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M6 8h12l-1 12H7L6 8Z" stroke="#3E2A2C" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M9 8a3 3 0 0 1 6 0" stroke="#3E2A2C" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              {count > 0 && (
                <span className="absolute -top-2 -right-2 bg-rosegold-deep text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {count}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-rosegold-light/40 bg-cream px-5 py-4">
          <form onSubmit={handleSearch} className="flex items-center border-b border-plum/20 mb-4 pb-1">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="text"
              placeholder="Search pieces..."
              className="bg-transparent outline-none text-sm py-1 flex-1"
            />
          </form>
          <div className="flex flex-col gap-3 font-label text-sm uppercase tracking-wide text-plum-soft">
            {LINKS.map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setMobileOpen(false)}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
