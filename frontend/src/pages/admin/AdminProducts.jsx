import { useEffect, useState } from "react";
import { adminApi, api, formatPKR } from "../../lib/api";

const EMPTY_FORM = {
  id: null,
  name: "",
  slug: "",
  description: "",
  price: "",
  compare_at_price: "",
  category_id: "",
  image: "",
  stock: 10,
  featured: false,
  color: "",
  material: "",
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(null); // null = list view, object = editing/creating
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    Promise.all([adminApi.listProducts(), api.getCategories()])
      .then(([p, c]) => {
        setProducts(p);
        setCategories(c);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  function slugify(str) {
    return str.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }

  async function handleSave(e) {
    e.preventDefault();
    setError("");
    const payload = {
      ...form,
      slug: form.slug || slugify(form.name),
      price: Number(form.price),
      compare_at_price: form.compare_at_price ? Number(form.compare_at_price) : null,
      category_id: form.category_id ? Number(form.category_id) : null,
      stock: Number(form.stock),
      featured: !!form.featured,
      images: [],
    };
    try {
      if (form.id) {
        await adminApi.updateProduct(form.id, payload);
      } else {
        await adminApi.createProduct(payload);
      }
      setForm(null);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    await adminApi.deleteProduct(id);
    load();
  }

  if (form) {
    return (
      <div className="max-w-2xl">
        <h1 className="font-display text-2xl mb-6">{form.id ? "Edit Product" : "New Product"}</h1>
        <form onSubmit={handleSave} className="space-y-4 bg-cream rounded-xl p-6 shadow-soft">
          <div className="grid sm:grid-cols-2 gap-4">
            <FField label="Name" required>
              <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </FField>
            <FField label="Slug (URL)" hint="Leave blank to auto-generate">
              <input className="input" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
            </FField>
            <FField label="Price (PKR)" required>
              <input type="number" className="input" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            </FField>
            <FField label="Compare-at Price (optional)">
              <input type="number" className="input" value={form.compare_at_price} onChange={(e) => setForm({ ...form, compare_at_price: e.target.value })} />
            </FField>
            <FField label="Category">
              <select className="input" value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}>
                <option value="">— None —</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </FField>
            <FField label="Stock">
              <input type="number" className="input" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
            </FField>
            <FField label="Color">
              <input className="input" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} />
            </FField>
            <FField label="Material">
              <input className="input" value={form.material} onChange={(e) => setForm({ ...form, material: e.target.value })} />
            </FField>
            <FField label="Image URL" className="sm:col-span-2" hint="Paste a hosted image link. Leave blank to use a placeholder.">
              <input className="input" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
            </FField>
            <FField label="Description" className="sm:col-span-2">
              <textarea rows={4} className="input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </FField>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
            Feature on homepage
          </label>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex gap-3">
            <button type="submit" className="bg-plum text-cream px-6 py-2.5 font-label text-xs uppercase tracking-widest2 hover:bg-rosegold-deep transition-colors">
              Save Product
            </button>
            <button type="button" onClick={() => setForm(null)} className="px-6 py-2.5 font-label text-xs uppercase tracking-widest2 text-plum-soft border border-plum/20">
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl">Products</h1>
        <button
          onClick={() => setForm(EMPTY_FORM)}
          className="bg-plum text-cream px-5 py-2.5 font-label text-xs uppercase tracking-widest2 hover:bg-rosegold-deep transition-colors"
        >
          + New Product
        </button>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="bg-cream rounded-xl shadow-soft overflow-x-auto">
        <table className="w-full text-sm min-w-[600px]">
          <thead>
            <tr className="text-left text-plum-soft/70 border-b border-plum/10">
              <th className="py-3 px-4">Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Featured</th>
              <th className="text-right px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="py-8 text-center text-plum-soft/60">Loading…</td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan={6} className="py-8 text-center text-plum-soft/60">No products yet.</td></tr>
            ) : (
              products.map((p) => (
                <tr key={p.id} className="border-b border-plum/5">
                  <td className="py-3 px-4">{p.name}</td>
                  <td>{p.category_name || "—"}</td>
                  <td>{formatPKR(p.price)}</td>
                  <td className={p.stock <= 5 ? "text-red-600" : ""}>{p.stock}</td>
                  <td>{p.featured ? "Yes" : "—"}</td>
                  <td className="text-right px-4 space-x-3">
                    <button onClick={() => setForm({ ...EMPTY_FORM, ...p, category_id: p.category_id || "" })} className="text-rosegold-deep hover:underline">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FField({ label, required, hint, className = "", children }) {
  return (
    <label className={`block ${className}`}>
      <span className="text-xs font-label uppercase tracking-wide text-plum-soft">
        {label} {required && <span className="text-rosegold-deep">*</span>}
      </span>
      <div className="mt-1">{children}</div>
      {hint && <span className="text-xs text-plum-soft/60">{hint}</span>}
    </label>
  );
}
