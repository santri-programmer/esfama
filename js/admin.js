import { adminLogin, fetchAdminOrders } from "./api.js";

const loginPage = document.getElementById("loginPage");
const dashboard = document.getElementById("dashboard");

const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const loginError = document.getElementById("loginError");

const logoutBtn = document.getElementById("logoutBtn");
const tableBody = document.getElementById("orderTable");

/**
 * ===============================
 * AUTH HELPERS
 * ===============================
 */
function getToken() {
  return localStorage.getItem("admin_token");
}

function setToken(token) {
  localStorage.setItem("admin_token", token);
}

function clearToken() {
  localStorage.removeItem("admin_token");
}

function showLogin() {
  loginPage.classList.remove("hidden");
  dashboard.classList.add("hidden");
}

function showDashboard() {
  loginPage.classList.add("hidden");
  dashboard.classList.remove("hidden");
}

/**
 * ===============================
 * LOGIN FLOW
 * ===============================
 */
loginBtn.onclick = async () => {
  loginError.classList.add("hidden");

  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (!username || !password) {
    loginError.textContent = "Username dan password wajib diisi";
    loginError.classList.remove("hidden");
    return;
  }

  try {
    const res = await adminLogin({ username, password });
    setToken(res.token);
    showDashboard();
    loadOrders();
  } catch (err) {
    loginError.textContent = err.message;
    loginError.classList.remove("hidden");
  }
};

/**
 * ===============================
 * LOGOUT
 * ===============================
 */
logoutBtn.onclick = () => {
  clearToken();
  showLogin();
};

/**
 * ===============================
 * LOAD ORDERS (ADMIN)
 * ===============================
 */
async function loadOrders() {
  try {
    const res = await fetchAdminOrders();
    renderOrders(res.data);
  } catch (err) {
    // Token invalid / expired
    clearToken();
    showLogin();
  }
}

function renderOrders(orders) {
  if (!orders.length) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="7" class="text-center py-6 text-gray-400">
          Belum ada order
        </td>
      </tr>
    `;
    return;
  }

  tableBody.innerHTML = "";

  orders.forEach((o) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td class="px-4 py-3 font-mono">${o.orderCode}</td>
      <td class="px-4 py-3">${o.phone}</td>
      <td class="px-4 py-3">${o.provider}</td>
      <td class="px-4 py-3">${o.productName}</td>
      <td class="px-4 py-3 text-right">
        Rp ${Number(o.price).toLocaleString("id-ID")}
      </td>
      <td class="px-4 py-3 text-center">
        <span class="px-2 py-1 rounded text-xs font-semibold
          ${
            o.status === "PENDING"
              ? "bg-yellow-100 text-yellow-700"
              : o.status === "SUCCESS"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }">
          ${o.status}
        </span>
      </td>
      <td class="px-4 py-3 text-sm text-gray-500">
        ${new Date(o.createdAt).toLocaleString("id-ID")}
      </td>
    `;

    tableBody.appendChild(tr);
  });
}

/**
 * ===============================
 * INIT
 * ===============================
 */
if (getToken()) {
  showDashboard();
  loadOrders();
} else {
  showLogin();
}
