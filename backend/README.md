# Trezar — Full-Stack Jewelry Store

A complete online store for **Trezar**, a Pakistani fashion-jewelry label. Soft
blush & rose-gold design, built for everyday and bridal jewelry, with Cash on
Delivery, JazzCash, Easypaisa and card checkout, plus a full admin panel.

```
trezar/
├── backend/     Node.js + Express + SQLite API
└── frontend/    React + Vite + Tailwind storefront + admin panel
```

## What you get

**Storefront**
- Home page, shop with category/search/sort filters, product detail pages
- Cart (persists in the browser) and a 4-step checkout: delivery details →
  payment method → pay → order confirmation
- Payment methods: Cash on Delivery, JazzCash, Easypaisa (manual
  confirmation), and Card (Stripe-ready, runs in a safe simulated mode until
  you add real keys)

**Admin panel** (`/admin`)
- Dashboard with order/revenue/stock summary
- Full product CRUD (add, edit, delete, feature on homepage)
- Order list with live status updates (payment + fulfillment)
- Default login: **admin@trezar.pk** / **Trezar@123** — change this before
  going live (see "Before you launch" below)

**Design**
- Palette: blush background, rose-gold accents, deep plum text
- Typography: Cormorant Garamond (display) + Jost (body)
- Signature motif: an arch ("jharokha") frame used on product photography,
  category tiles and the hero — a nod to South Asian architecture, used
  consistently instead of the usual generic e-commerce card

## Running it locally

You'll need [Node.js](https://nodejs.org) 18+ installed.

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
npm run seed      # creates the database + sample products + admin login
npm start         # runs on http://localhost:4000
```

### 2. Frontend

In a second terminal:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev        # runs on http://localhost:5173
```

Open **http://localhost:5173** for the store, and
**http://localhost:5173/admin/login** for the admin panel.

## Product photos

Products ship without real photos (to avoid using stock/copyrighted images) —
each one shows an elegant rose-gold placeholder instead. To add real photos:

1. Go to **Admin → Products → Edit**, and paste a hosted image URL into the
   "Image URL" field (e.g. an image uploaded to Cloudinary, Imgur, or your
   own hosting). The photo will automatically appear inside the arch frame.

## Payments — what's real and what's simulated

- **Cash on Delivery** — fully functional, no setup needed.
- **JazzCash / Easypaisa** — the checkout shows your merchant account number
  and collects the customer's transaction ID for manual verification. This
  avoids needing JazzCash/Easypaisa's merchant API (which requires a business
  merchant account with them). Update the placeholder number in
  `frontend/src/pages/WalletPayment.jsx` (`MERCHANT_NUMBERS`) with your real
  account.
- **Card payments** — wired for [Stripe](https://stripe.com). Without a key,
  it runs in a clearly-labeled simulated mode so you can test the full flow.
  To go live: add `STRIPE_SECRET_KEY` to `backend/.env`, and consider
  upgrading the card form in `CardPayment.jsx` to use Stripe Elements/Stripe.js
  directly for PCI-compliant card capture (the current form posts card
  details only in the simulated demo path — do not use it to collect real
  card numbers without adding Stripe Elements first).

## Before you launch

- Change the default admin password (create a new admin via the database, or
  add a "change password" endpoint) and set a strong, random `JWT_SECRET` in
  `backend/.env`.
- Swap SQLite for a hosted database (e.g. Postgres) if you expect concurrent
  traffic at scale — SQLite is great for getting started and moderate traffic.
- Deploy the backend (Render, Railway, Fly.io, a VPS) and the frontend
  (Vercel, Netlify), then set `VITE_API_URL` in the frontend's `.env` to your
  live backend URL.
- Add real product photography and adjust shipping fee / free-shipping
  threshold in `backend/src/routes/orders.js`.

## Tech stack

- **Backend:** Node.js, Express, better-sqlite3, JWT auth, bcrypt, Stripe SDK
- **Frontend:** React 18, Vite, React Router, Tailwind CSS
