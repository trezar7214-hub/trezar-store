import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../lib/api";
import ProductCard from "../components/ProductCard";

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category") || "";
  const search = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "";

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (category) params.category = category;
    if (search) params.search = search;
    if (sort) params.sort = sort;
    api
      .getProducts(params)
      .then(setProducts)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [category, search, sort]);

  function setParam(key, value) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
  }

  const activeCategoryName = categories.find((c) => c.slug === category)?.name;

  return (
    <div className="max-w-7xl mx-auto px-5 md:px-8 py-12">
      <div className="text-center mb-10">
        <p className="font-label text-xs uppercase tracking-widest2 text-rosegold-deep">
          {search ? `Results for "${search}"` : activeCategoryName || "All Jewelry"}
        </p>
        <h1 className="font-display text-4xl mt-2">
          {search ? "Search Results" : activeCategoryName || "The Full Collection"}
        </h1>
      </div>

      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between mb-10">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setParam("category", "")}
            className={`px-4 py-1.5 rounded-full text-xs font-label uppercase tracking-wide border ${
              !category ? "bg-plum text-cream border-plum" : "border-plum/30 text-plum-soft hover:border-rosegold-deep"
            }`}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setParam("category", c.slug)}
              className={`px-4 py-1.5 rounded-full text-xs font-label uppercase tracking-wide border ${
                category === c.slug ? "bg-plum text-cream border-plum" : "border-plum/30 text-plum-soft hover:border-rosegold-deep"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        <select
          value={sort}
          onChange={(e) => setParam("sort", e.target.value)}
          className="border border-plum/30 bg-cream text-sm px-3 py-2 rounded font-label text-plum-soft"
        >
          <option value="">Sort: Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse aspect-[4/5] bg-blush-deep arch-frame" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-24">
          <p className="font-display text-2xl text-plum-soft">No pieces found.</p>
          <p className="text-sm text-plum-soft/70 mt-2">Try a different search or browse all categories.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
