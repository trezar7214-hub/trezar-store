import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatPKR } from "../lib/api";
import ProductImage from "../components/ProductImage";

const SHIPPING_FEE = 200;
const FREE_SHIPPING_THRESHOLD = 5000;

export default function Cart() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();
  const navigate = useNavigate();

  const shipping = items.length === 0 ? 0 : subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-5 py-24 text-center">
        <h1 className="font-display text-3xl">Your bag is empty</h1>
        <p className="text-plum-soft mt-3">Find something you'll love from the collection.</p>
        <Link
          to="/shop"
          className="inline-block mt-8 bg-plum text-cream px-7 py-3 font-label text-xs uppercase tracking-widest2 hover:bg-rosegold-deep transition-colors"
        >
          Shop the Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-5 md:px-8 py-12">
      <h1 className="font-display text-3xl mb-8">Your Bag</h1>

      <div className="grid md:grid-cols-3 gap-10">
        <div className="md:col-span-2 divide-y divide-plum/10">
          {items.map((item) => (
            <div key={item.productId} className="flex gap-4 py-5">
              <div className="w-20 h-24 arch-frame bg-blush-deep shrink-0">
                <ProductImage src={item.image} alt={item.name} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <Link to={`/product/${item.slug}`} className="font-display text-lg hover:text-rosegold-deep">
                    {item.name}
                  </Link>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="text-plum-soft/60 hover:text-rosegold-deep text-sm"
                    aria-label={`Remove ${item.name}`}
                  >
                    Remove
                  </button>
                </div>
                <p className="text-sm text-plum-soft mt-1">{formatPKR(item.price)}</p>
                <div className="mt-3 flex items-center border border-plum/25 rounded w-fit">
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    className="w-8 h-8 text-plum-soft hover:text-plum"
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-sm">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    className="w-8 h-8 text-plum-soft hover:text-plum"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-blush rounded-xl p-6 h-fit">
          <h2 className="font-display text-xl mb-4">Order Summary</h2>
          <div className="space-y-2 text-sm text-plum-soft">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatPKR(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{shipping === 0 ? "Free" : formatPKR(shipping)}</span>
            </div>
            {shipping > 0 && (
              <p className="text-xs text-rosegold-deep pt-1">
                Add {formatPKR(FREE_SHIPPING_THRESHOLD - subtotal)} more for free shipping.
              </p>
            )}
          </div>
          <div className="divider-gold my-4" />
          <div className="flex justify-between font-display text-lg">
            <span>Total</span>
            <span>{formatPKR(total)}</span>
          </div>
          <button
            onClick={() => navigate("/checkout")}
            className="mt-6 w-full bg-plum text-cream px-7 py-3 font-label text-xs uppercase tracking-widest2 hover:bg-rosegold-deep transition-colors"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
