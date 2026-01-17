import { adminLogin, fetchAdminOrders } from "./api.js";

const loginPage = document.getElementById("loginPage");
const dashboard = document.getElementById("dashboard");
const tableBody = document.getElementById("orderTable");

const getToken = () => sessionStorage.getItem("admin_token");
const setToken = (t) => sessionStorage.setItem("admin_token", t);
const clearToken = () => sessionStorage.removeItem("admin_token");

function showLogin() {
  loginPage.classList.remove("hidden");
  dashboard.classList.add("hidden");
}

function showDashboard() {
  loginPage.classList.add("hidden");
  dashboard.classList.remove("hidden");
}

async function loadOrders() {
  const res = await fetchAdminOrders();
  tableBody.innerHTML = "";

  res.data.forEach((o) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="px-4 py-3 font-mono">${o.orderCode}</td>
      <td class="px-4 py-3">${o.phone}</td>
      <td class="px-4 py-3">${o.provider}</td>
      <td class="px-4 py-3">${o.productName}</td>
      <td class="px-4 py-3 text-right">
        Rp ${Number(o.price).toLocaleString("id-ID")}
      </td>
      <td class="px-4 py-3 text-center">${o.status}</td>
      <td class="px-4 py-3">${new Date(o.createdAt).toLocaleString("id-ID")}</td>
    `;
    tableBody.appendChild(tr);
  });
}

if (getToken()) {
  showDashboard();
  loadOrders();
} else {
  showLogin();
}
