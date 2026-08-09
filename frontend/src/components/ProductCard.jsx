import { Link } from "react-router-dom";
import ProductImage from "./ProductImage";
import { formatPKR } from "../lib/api";

export default function ProductCard({ product }) {
  const onSale = product.compare_at_price && product.compare_at_price > product.price;
  return (
    <Link to={`/product/${product.slug}`} className="group block">
      <div className="arch-outline">
        <div className="aspect-[4/5] arch-frame bg-blush-deep">
          <ProductImage src={product.image} alt={product.name} />
        </div>
      </div>
      <div className="mt-4 px-1">
        <p className="font-label text-[11px] uppercase tracking-widest2 text-rosegold-deep">
          {product.category_name || "Trezar"}
        </p>
        <h3 className="font-display text-lg mt-1 text-plum group-hover:text-rosegold-deep transition-colors">
          {product.name}
        </h3>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-sm text-plum">{formatPKR(product.price)}</span>
          {onSale && (
            <span className="text-xs text-plum-soft/60 line-through">
              {formatPKR(product.compare_at_price)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
