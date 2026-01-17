if (!window.__API_BASE__) {
  throw new Error("API_BASE is not defined");
}

const API_BASE = window.__API_BASE__;

async function request(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  const adminToken = sessionStorage.getItem("admin_token");
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

export const fetchProducts = () => request("/product");

export const createOrder = (payload) =>
  request("/order", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const adminLogin = (payload) =>
  request("/admin/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const fetchAdminOrders = () => request("/order/admin");
