const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || "Something went wrong. Please try again.");
  }
  return data;
}

export const api = {
  getProducts: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/products${qs ? `?${qs}` : ""}`);
  },
  getCategories: () => request("/products/categories"),
  getProduct: (slug) => request(`/products/${slug}`),
  createOrder: (payload) =>
    request("/orders", { method: "POST", body: JSON.stringify(payload) }),
  getOrder: (orderNumber) => request(`/orders/${orderNumber}`),
  confirmWalletPayment: (orderNumber, payload) =>
    request(`/orders/${orderNumber}/confirm-wallet-payment`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  createCardIntent: (orderNumber) =>
    request("/payments/card-intent", {
      method: "POST",
      body: JSON.stringify({ orderNumber }),
    }),
  confirmCardPayment: (orderNumber) =>
    request("/payments/confirm-card", {
      method: "POST",
      body: JSON.stringify({ orderNumber }),
    }),
  adminLogin: (email, password) =>
    request("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
};

function authHeaders() {
  const token = localStorage.getItem("trezar_admin_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const adminApi = {
  summary: () => request("/admin/summary", { headers: authHeaders() }),
  listProducts: () => request("/admin/products", { headers: authHeaders() }),
  createProduct: (payload) =>
    request("/admin/products", { method: "POST", body: JSON.stringify(payload), headers: authHeaders() }),
  updateProduct: (id, payload) =>
    request(`/admin/products/${id}`, { method: "PUT", body: JSON.stringify(payload), headers: authHeaders() }),
  deleteProduct: (id) =>
    request(`/admin/products/${id}`, { method: "DELETE", headers: authHeaders() }),
  listOrders: () => request("/admin/orders", { headers: authHeaders() }),
  getOrder: (id) => request(`/admin/orders/${id}`, { headers: authHeaders() }),
  updateOrderStatus: (id, payload) =>
    request(`/admin/orders/${id}/status`, { method: "PUT", body: JSON.stringify(payload), headers: authHeaders() }),
};

export function formatPKR(amount) {
  return `Rs. ${Number(amount).toLocaleString("en-PK")}`;
}
