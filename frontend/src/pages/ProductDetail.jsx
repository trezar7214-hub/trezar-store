import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { api, formatPKR } from "../lib/api";
import { useCart } from "../context/CartContext";
import ProductImage from "../components/ProductImage";

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    api
      .getProduct(slug)
      .then(setProduct)
      .catch(() => setError("We couldn't find that piece."))
      .finally(() => setLoading(false));
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return <div className="max-w-7xl mx-auto px-5 py-24 text-center text-plum-soft">Loading…</div>;
  }
  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-5 py-24 text-center">
        <p className="font-display text-2xl">{error || "Product not found"}</p>
        <Link to="/shop" className="text-rosegold-deep underline mt-4 inline-block">Back to shop</Link>
      </div>
    );
  }

  const onSale = product.compare_at_price && product.compare_at_price > product.price;
  const outOfStock = product.stock <= 0;

  function handleAdd() {
    addItem(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  function handleBuyNow() {
    addItem(product, qty);
    navigate("/cart");
  }

  return (
    <div className="max-w-7xl mx-auto px-5 md:px-8 py-12">
      <nav className="text-xs text-plum-soft/70 mb-8 font-label uppercase tracking-wide">
        <Link to="/shop">Shop</Link> / {product.category_name && <Link to={`/shop?category=${product.category_slug}`}>{product.category_name}</Link>} / {product.name}
      </nav>

      <div className="grid md:grid-cols-2 gap-14">
        <div className="arch-outline max-w-md mx-auto md:mx-0 w-full">
          <div className="aspect-[4/5] arch-frame bg-blush-deep">
            <ProductImage src={product.image} alt={product.name} />
          </div>
        </div>

        <div>
          <p className="font-label text-xs uppercase tracking-widest2 text-rosegold-deep">
            {product.category_name || "Trezar"}
          </p>
          <h1 className="font-display text-4xl mt-2">{product.name}</h1>

          <div className="mt-4 flex items-center gap-3">
            <span className="text-xl text-plum">{formatPKR(product.price)}</span>
            {onSale && (
              <>
                <span className="text-sm text-plum-soft/60 line-through">{formatPKR(product.compare_at_price)}</span>
                <span className="text-xs bg-rosegold-deep text-white px-2 py-0.5 rounded-full">
                  {Math.round(100 - (product.price / product.compare_at_price) * 100)}% off
                </span>
              </>
            )}
          </div>

          <p className="mt-6 text-plum-soft leading-relaxed">{product.description}</p>

          <dl className="mt-6 grid grid-cols-2 gap-y-2 text-sm max-w-xs">
            {product.color && (
              <>
                <dt className="text-plum-soft/70">Color</dt>
                <dd>{product.color}</dd>
              </>
            )}
            {product.material && (
              <>
                <dt className="text-plum-soft/70">Material</dt>
                <dd>{product.material}</dd>
              </>
            )}
            <dt className="text-plum-soft/70">Availability</dt>
            <dd>{outOfStock ? "Out of stock" : `${product.stock} in stock`}</dd>
          </dl>

          {!outOfStock && (
            <div className="mt-8 flex items-center gap-4">
              <div className="flex items-center border border-plum/25 rounded">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-9 h-10 text-plum-soft hover:text-plum"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="w-8 text-center">{qty}</span>
                <button
                  onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                  className="w-9 h-10 text-plum-soft hover:text-plum"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>
          )}

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              disabled={outOfStock}
              onClick={handleAdd}
              className="flex-1 bg-plum text-cream px-7 py-3 font-label text-xs uppercase tracking-widest2 hover:bg-rosegold-deep transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {added ? "Added ✓" : outOfStock ? "Out of Stock" : "Add to Bag"}
            </button>
            <button
              disabled={outOfStock}
              onClick={handleBuyNow}
              className="flex-1 border border-plum text-plum px-7 py-3 font-label text-xs uppercase tracking-widest2 hover:border-rosegold-deep hover:text-rosegold-deep transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Buy Now
            </button>
          </div>

          <div className="mt-10 divider-gold" />
          <div className="mt-6 space-y-2 text-sm text-plum-soft">
            <p>✓ Cash on Delivery available across Pakistan</p>
            <p>✓ JazzCash, Easypaisa &amp; card payments accepted</p>
            <p>✓ 7-day easy exchange on unworn pieces</p>
          </div>
        </div>
      </div>
    </div>
  );
}
