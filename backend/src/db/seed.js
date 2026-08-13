import bcrypt from "bcryptjs";
import { db } from "./db.js";

const categories = [
  { name: "Earrings", slug: "earrings" },
  { name: "Necklace Sets", slug: "necklace-sets" },
  { name: "Rings", slug: "rings" },
  { name: "Bangles & Bracelets", slug: "bangles-bracelets" },
  { name: "Bridal Sets", slug: "bridal-sets" },
  { name: "Tikka & Maang Tikka", slug: "tikka" },
];

const insertCategory = db.prepare(
  "INSERT OR IGNORE INTO categories (name, slug) VALUES (?, ?)"
);
categories.forEach((c) => insertCategory.run(c.name, c.slug));

const catId = (slug) =>
  db.prepare("SELECT id FROM categories WHERE slug = ?").get(slug).id;

const products = [
  {
    name: "Zeenat Jhumka Earrings",
    slug: "zeenat-jhumka-earrings",
    description:
      "Delicate rose-gold plated jhumkas with dangling pearls, finished with hand-set kundan stones. A soft everyday statement piece inspired by classic South Asian silhouettes.",
    price: 1850,
    compare_at_price: 2400,
    category_id: catId("earrings"),
    color: "Rose Gold",
    material: "Alloy, Kundan, Pearl beads",
    stock: 24,
    featured: 1,
    // ImgBB se copy hua exact direct link:
    image: "https://i.ibb.co/FqH6CW4n/Diamond-Jewellery-in-Pakistan-with-Prices.jpg",
  },
  {
    name: "Anaya Layered Necklace Set",
    slug: "anaya-layered-necklace-set",
    description:
      "A blush-toned layered necklace and earring set with delicate floral motifs, perfect for mehndi and daytime functions.",
    price: 4200,
    compare_at_price: 5200,
    category_id: catId("necklace-sets"),
    color: "Blush Rose Gold",
    material: "Alloy, Zircon, Enamel",
    stock: 15,
    featured: 1,
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80",
  },
  {
    name: "Rose Vine Adjustable Ring",
    slug: "rose-vine-adjustable-ring",
    description:
      "A delicate adjustable ring with a rose-gold vine design, dotted with tiny cubic zirconia stones.",
    price: 950,
    category_id: catId("rings"),
    color: "Rose Gold",
    material: "Alloy, Cubic Zirconia",
    stock: 40,
    featured: 0,
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80",
  },
  {
    name: "Noorani Pearl Drop Earrings",
    slug: "noorani-pearl-drop-earrings",
    description:
      "Minimal pearl drop earrings with a soft rose-gold finish — an everyday elegant pick that pairs with both eastern and western wear.",
    price: 1200,
    category_id: catId("earrings"),
    color: "Rose Gold",
    material: "Alloy, Faux Pearl",
    stock: 30,
    featured: 1,
    image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=800&q=80",
  },
  {
    name: "Sitara Chooriyan Bangle Set (Set of 6)",
    slug: "sitara-chooriyan-bangle-set",
    description:
      "A set of six delicate stone-studded bangles in a blush and rose-gold palette, perfect for mehndi festivities.",
    price: 2600,
    compare_at_price: 3200,
    category_id: catId("bangles-bracelets"),
    color: "Blush & Rose Gold",
    material: "Alloy, Glass Stones",
    stock: 18,
    featured: 0,
    image: "https://images.unsplash.com/photo-1611591475165-da25d0c72c91?w=800&q=80",
  },
  {
    name: "Laila Maang Tikka",
    slug: "laila-maang-tikka",
    description:
      "A dainty rose-gold maang tikka with a teardrop pearl, adding a soft bridal touch to any hairstyle.",
    price: 1450,
    category_id: catId("tikka"),
    color: "Rose Gold",
    material: "Alloy, Pearl",
    stock: 20,
    featured: 0,
    image: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800&q=80",
  },
  {
    name: "Farah Floral Stud Set",
    slug: "farah-floral-stud-set",
    description:
      "Tiny floral stud earrings finished in matte rose gold — light enough for daily wear, pretty enough for gatherings.",
    price: 750,
    category_id: catId("earrings"),
    color: "Matte Rose Gold",
    material: "Alloy",
    stock: 50,
    featured: 0,
    image: "https://images.unsplash.com/photo-1629224316810-9d8805b95e76?w=800&q=80",
  },
  {
    name: "Simple Dulhan Bracelet",
    slug: "simple-dulhan-bracelet",
    description:
      "A soft chain-link bracelet with a single pearl charm, styled to complement layered bridal looks.",
    price: 1100,
    category_id: catId("bangles-bracelets"),
    color: "Rose Gold",
    material: "Alloy, Pearl",
    stock: 22,
    featured: 0,
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80",
  },
  {
    name: "Zoya Solitaire Ring",
    slug: "zoya-solitaire-ring",
    description:
      "A single-stone rose-gold ring with a brilliant-cut zircon centre stone — a everyday-luxe essential.",
    price: 1050,
    category_id: catId("rings"),
    color: "Rose Gold",
    material: "Alloy, Cubic Zirconia",
    stock: 35,
    featured: 0,
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80",
  },
  {
    name: "Iqra Pearl Choker",
    slug: "iqra-pearl-choker",
    description:
      "A multi-strand pearl choker with a rose-gold clasp, giving a soft vintage look to formal outfits.",
    price: 2200,
    category_id: catId("necklace-sets"),
    color: "Ivory & Rose Gold",
    material: "Faux Pearl, Alloy",
    stock: 14,
    featured: 0,
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80",
  },
];

// Pehle database ki purani entries update karne ke liye REPLACE query:
const insertProduct = db.prepare(`
  INSERT OR REPLACE INTO products
    (name, slug, description, price, compare_at_price, category_id, image, images, stock, featured, color, material)
  VALUES (@name, @slug, @description, @price, @compare_at_price, @category_id, @image, @images, @stock, @featured, @color, @material)
`);

products.forEach((p) => {
  insertProduct.run({
    ...p,
    compare_at_price: p.compare_at_price ?? null,
    image: p.image || "https://placehold.co/600x600/png?text=Trezar+Jewelry",
    images: JSON.stringify([]),
  });
});

const adminEmail = "admin@trezar.pk";
const existing = db.prepare("SELECT id FROM admins WHERE email = ?").get(adminEmail);
if (!existing) {
  const hash = bcrypt.hashSync("Trezar@123", 10);
  db.prepare(
    "INSERT INTO admins (email, password_hash, name) VALUES (?, ?, ?)"
  ).run(adminEmail, hash, "Trezar Admin");
  console.log("Created default admin -> email: admin@trezar.pk  password: Trezar@123");
}

console.log(`Seed complete. ${products.length} products ensured.`);