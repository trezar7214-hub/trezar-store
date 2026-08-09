import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import ProductCard from "../components/ProductCard";
import ProductImage from "../components/ProductImage";

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getProducts({ featured: 1 }), api.getCategories()])
      .then(([products, cats]) => {
        setFeatured(products);
        setCategories(cats);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-5 md:px-8 pt-10 md:pt-16 pb-20 grid md:grid-cols-2 gap-12 items-center">
        <div className="order-2 md:order-1">
          <p className="font-label text-xs uppercase tracking-widest2 text-rosegold-deep mb-5">
            Everyday to Bridal
          </p>
          <h1 className="font-display text-5xl md:text-6xl leading-[1.08] text-plum">
            Jewelry for your
            <br />
            <em className="italic text-rosegold-deep">every</em> day and your
            <br />
            biggest day.
          </h1>
          <p className="mt-6 text-plum-soft max-w-md leading-relaxed">
            Trezar is a Pakistani fashion jewelry label — delicate rose-gold
            pieces designed to move from mehndi to office desk. Cash on
            delivery, JazzCash, Easypaisa and card payments accepted.
          </p>
          <div className="mt-8 flex items-center gap-4">
            <Link
              to="/shop"
              className="bg-plum text-cream px-7 py-3 font-label text-xs uppercase tracking-widest2 hover:bg-rosegold-deep transition-colors"
            >
              Shop the Collection
            </Link>
            <Link
              to="/shop?category=bridal-sets"
              className="font-label text-xs uppercase tracking-widest2 text-plum border-b border-plum/40 pb-1 hover:border-rosegold-deep hover:text-rosegold-deep transition-colors"
            >
              Bridal Edit
            </Link>
          </div>
        </div>

        <div className="order-1 md:order-2">
          <div className="arch-outline max-w-sm mx-auto">
            <div className="aspect-[3/4] arch-frame bg-blush-deep">
              <ProductImage alt="Trezar signature piece" />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="divider-gold" />
      </div>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-5 md:px-8 py-16">
        <h2 className="font-display text-3xl text-center">Shop by Category</h2>
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          {(loading ? Array.from({ length: 4 }) : categories.slice(0, 8)).map((c, i) => (
            <Link
              key={c?.id ?? i}
              to={c ? `/shop?category=${c.slug}` : "#"}
              className="group block text-center"
            >
              <div className="aspect-square arch-frame bg-blush-deep">
                <ProductImage alt={c?.name || ""} />
              </div>
              <p className="mt-3 font-label text-xs uppercase tracking-wide text-plum-soft group-hover:text-rosegold-deep transition-colors">
                {c?.name || "Loading"}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="max-w-7xl mx-auto px-5 md:px-8 py-16">
        <div className="flex items-end justify-between mb-10">
          <h2 className="font-display text-3xl">New &amp; Loved</h2>
          <Link to="/shop" className="font-label text-xs uppercase tracking-widest2 text-rosegold-deep hover:text-plum">
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
          {(loading ? Array.from({ length: 4 }) : featured).map((p, i) =>
            p ? <ProductCard key={p.id} product={p} /> : <div key={i} className="animate-pulse aspect-[4/5] bg-blush-deep arch-frame" />
          )}
        </div>
      </section>

      {/* Trust strip */}
      <section className="bg-blush py-14 mt-10">
        <div className="max-w-7xl mx-auto px-5 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <h3 className="font-display text-xl">Cash on Delivery</h3>
            <p className="text-sm text-plum-soft mt-2">Pay when your order arrives, anywhere in Pakistan.</p>
          </div>
          <div>
            <h3 className="font-display text-xl">JazzCash &amp; Easypaisa</h3>
            <p className="text-sm text-plum-soft mt-2">Pay instantly using your mobile wallet.</p>
          </div>
          <div>
            <h3 className="font-display text-xl">Easy Returns</h3>
            <p className="text-sm text-plum-soft mt-2">7-day easy exchange on unworn pieces.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
