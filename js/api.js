/**
 * ===============================
 * API CONFIG
 * ===============================
 * Bisa di-set dari HTML sebelum script load:
 * window.__API_BASE__ = "https://api.domain.com/api"
 */
const API_BASE =
  window.__API_BASE__ ||
  `${window.location.protocol}//${window.location.hostname}:3000/api`;

/**
 * ===============================
 * HELPER — REQUEST
 * ===============================
 */
async function request(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  // Auto attach admin token if exists
  const adminToken = localStorage.getItem("admin_token");
  if (adminToken) {
    headers.Authorization = `Bearer ${adminToken}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  let json;
  try {
    json = await res.json();
  } catch {
    throw new Error("Invalid server response");
  }

  if (!res.ok || json.success === false) {
    throw new Error(json.message || "Request failed");
  }

  return json;
}

/**
 * ===============================
 * PUBLIC API
 * ===============================
 */
export function fetchProducts() {
  return request("/product");
}

export function createOrder(payload) {
  return request("/order", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * ===============================
 * ADMIN API
 * ===============================
 */
export function adminLogin(payload) {
  return request("/admin/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function fetchAdminOrders() {
  return request("/order/admin");
}
