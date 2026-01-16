import { fetchProducts } from "./api.js";
import { AppState } from "./state.js";
import "./provider.js";
import "./order.js";

const grid = document.getElementById("productGrid");
const orderBtn = document.getElementById("orderBtn");
const phoneInput = document.getElementById("phoneInput");

/**
 * ===============================
 * UI STATE UPDATE
 * ===============================
 */
function updateOrderButton() {
  if (AppState.selectedProduct && AppState.phone) {
    orderBtn.classList.add("active");
    orderBtn.disabled = false;
  } else {
    orderBtn.classList.remove("active");
    orderBtn.disabled = true;
  }
}

/**
 * ===============================
 * RENDER PRODUCTS
 * ===============================
 */
function renderProducts(products) {
  grid.innerHTML = "";

  products.forEach((p) => {
    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <div class="nominal">${p.nominal}</div>
      <div class="price">Rp ${p.price.toLocaleString("id-ID")}</div>
    `;

    card.onclick = () => {
      document
        .querySelectorAll(".product-card")
        .forEach((c) => c.classList.remove("active"));

      card.classList.add("active");
      AppState.selectedProduct = p;
      updateOrderButton();
    };

    grid.appendChild(card);
  });
}

/**
 * ===============================
 * INIT
 * ===============================
 */
async function init() {
  try {
    const res = await fetchProducts();
    renderProducts(res.data);
  } catch (err) {
    grid.innerHTML =
      "<p class='text-center text-red-500'>Gagal memuat produk</p>";
  }
}

phoneInput.addEventListener("input", updateOrderButton);

// Disable button by default
orderBtn.disabled = true;

init();
