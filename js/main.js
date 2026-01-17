import { fetchProducts } from "./api.js";
import { AppState } from "./state.js";
import "./provider.js";
import "./order.js";

const grid = document.getElementById("productGrid");
const orderBtn = document.getElementById("orderBtn");
const phoneInput = document.getElementById("phoneInput");

let cachedProducts = null;

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
 * RENDER PRODUCTS (FAST)
 * ===============================
 */
function renderProducts(products) {
  grid.innerHTML = "";

  const fragment = document.createDocumentFragment();

  products.forEach((p) => {
    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <div class="nominal">${p.nominal}</div>
      <div class="price">Rp ${p.price.toLocaleString("id-ID")}</div>
    `;

    card.onclick = () => {
      // Hapus active sebelumnya (lebih cepat dari querySelectorAll)
      const active = grid.querySelector(".product-card.active");
      if (active) active.classList.remove("active");

      card.classList.add("active");
      AppState.selectedProduct = p;
      updateOrderButton();
    };

    fragment.appendChild(card);
  });

  grid.appendChild(fragment);
}

/**
 * ===============================
 * INIT (WITH CACHE)
 * ===============================
 */
async function init() {
  try {
    if (cachedProducts) {
      renderProducts(cachedProducts);
      return;
    }

    const res = await fetchProducts();
    cachedProducts = res.data;
    renderProducts(res.data);
  } catch (err) {
    console.error("❌ Load products error:", err);
    grid.innerHTML =
      "<p class='text-center text-red-500'>Gagal memuat produk</p>";
  }
}

/**
 * ===============================
 * EVENTS
 * ===============================
 */
phoneInput.addEventListener("input", updateOrderButton);

// Default state
orderBtn.disabled = true;

// Start app
init();
