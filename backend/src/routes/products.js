import { Router } from "express";
import { db } from "../db/db.js";

const router = Router();

// GET /api/products?category=earrings&featured=1&search=ring&sort=price_asc
router.get("/", (req, res) => {
  const { category, featured, search, sort } = req.query;
  let sql = `
    SELECT p.*, c.name AS category_name, c.slug AS category_slug
    FROM products p
    LEFT JOIN categories c ON c.id = p.category_id
    WHERE 1=1
  `;
  const params = [];

  if (category) {
    sql += " AND c.slug = ?";
    params.push(category);
  }
  if (featured) {
    sql += " AND p.featured = 1";
  }
  if (search) {
    sql += " AND (p.name LIKE ? OR p.description LIKE ?)";
    params.push(`%${search}%`, `%${search}%`);
  }

  if (sort === "price_asc") sql += " ORDER BY p.price ASC";
  else if (sort === "price_desc") sql += " ORDER BY p.price DESC";
  else sql += " ORDER BY p.created_at DESC";

  const rows = db.prepare(sql).all(...params);
  const products = rows.map((r) => ({ ...r, images: JSON.parse(r.images || "[]") }));
  res.json(products);
});

router.get("/categories", (req, res) => {
  const rows = db.prepare("SELECT * FROM categories ORDER BY name").all();
  res.json(rows);
});

router.get("/:slug", (req, res) => {
  const row = db
    .prepare(
      `SELECT p.*, c.name AS category_name, c.slug AS category_slug
       FROM products p LEFT JOIN categories c ON c.id = p.category_id
       WHERE p.slug = ?`
    )
    .get(req.params.slug);
  if (!row) return res.status(404).json({ error: "Product not found" });
  res.json({ ...row, images: JSON.parse(row.images || "[]") });
});

export default router;
