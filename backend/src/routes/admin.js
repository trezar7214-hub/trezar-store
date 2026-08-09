import { Router } from "express";
import { db } from "../db/db.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();
router.use(requireAdmin);

// ---- Dashboard summary ----
router.get("/summary", (req, res) => {
  const totalOrders = db.prepare("SELECT COUNT(*) AS n FROM orders").get().n;
  const totalRevenue =
    db.prepare("SELECT COALESCE(SUM(total),0) AS s FROM orders WHERE payment_status = 'paid' OR payment_method = 'cod'").get().s;
  const totalProducts = db.prepare("SELECT COUNT(*) AS n FROM products").get().n;
  const lowStock = db.prepare("SELECT COUNT(*) AS n FROM products WHERE stock <= 5").get().n;
  const recentOrders = db
    .prepare("SELECT * FROM orders ORDER BY created_at DESC LIMIT 5")
    .all();
  res.json({ totalOrders, totalRevenue, totalProducts, lowStock, recentOrders });
});

// ---- Products CRUD ----
router.get("/products", (req, res) => {
  const rows = db
    .prepare(
      `SELECT p.*, c.name AS category_name FROM products p
       LEFT JOIN categories c ON c.id = p.category_id ORDER BY p.created_at DESC`
    )
    .all();
  res.json(rows.map((r) => ({ ...r, images: JSON.parse(r.images || "[]") })));
});

router.post("/products", (req, res) => {
  const {
    name, slug, description, price, compare_at_price,
    category_id, image, images, stock, featured, color, material,
  } = req.body;

  if (!name || !slug || !price) {
    return res.status(400).json({ error: "name, slug and price are required" });
  }

  try {
    const info = db
      .prepare(
        `INSERT INTO products
          (name, slug, description, price, compare_at_price, category_id, image, images, stock, featured, color, material)
         VALUES (@name, @slug, @description, @price, @compare_at_price, @category_id, @image, @images, @stock, @featured, @color, @material)`
      )
      .run({
        name, slug,
        description: description || "",
        price,
        compare_at_price: compare_at_price || null,
        category_id: category_id || null,
        image: image || null,
        images: JSON.stringify(images || []),
        stock: stock ?? 0,
        featured: featured ? 1 : 0,
        color: color || "",
        material: material || "",
      });
    res.status(201).json({ id: info.lastInsertRowid });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put("/products/:id", (req, res) => {
  const existing = db.prepare("SELECT * FROM products WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: "Product not found" });

  const merged = { ...existing, ...req.body };
  db.prepare(
    `UPDATE products SET
      name=@name, slug=@slug, description=@description, price=@price,
      compare_at_price=@compare_at_price, category_id=@category_id, image=@image,
      images=@images, stock=@stock, featured=@featured, color=@color, material=@material
     WHERE id=@id`
  ).run({
    ...merged,
    images: JSON.stringify(
      typeof merged.images === "string" ? JSON.parse(merged.images || "[]") : merged.images || []
    ),
    featured: merged.featured ? 1 : 0,
    id: req.params.id,
  });
  res.json({ ok: true });
});

router.delete("/products/:id", (req, res) => {
  db.prepare("DELETE FROM products WHERE id = ?").run(req.params.id);
  res.json({ ok: true });
});

// ---- Categories ----
router.post("/categories", (req, res) => {
  const { name, slug } = req.body;
  if (!name || !slug) return res.status(400).json({ error: "name and slug required" });
  try {
    const info = db
      .prepare("INSERT INTO categories (name, slug) VALUES (?, ?)")
      .run(name, slug);
    res.status(201).json({ id: info.lastInsertRowid });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ---- Orders ----
router.get("/orders", (req, res) => {
  const rows = db.prepare("SELECT * FROM orders ORDER BY created_at DESC").all();
  res.json(rows);
});

router.get("/orders/:id", (req, res) => {
  const order = db.prepare("SELECT * FROM orders WHERE id = ?").get(req.params.id);
  if (!order) return res.status(404).json({ error: "Order not found" });
  const items = db.prepare("SELECT * FROM order_items WHERE order_id = ?").all(order.id);
  res.json({ ...order, items });
});

router.put("/orders/:id/status", (req, res) => {
  const { order_status, payment_status } = req.body;
  const existing = db.prepare("SELECT * FROM orders WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: "Order not found" });
  db.prepare(
    "UPDATE orders SET order_status = COALESCE(?, order_status), payment_status = COALESCE(?, payment_status) WHERE id = ?"
  ).run(order_status || null, payment_status || null, req.params.id);
  res.json({ ok: true });
});

export default router;
