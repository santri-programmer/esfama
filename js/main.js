import "./config.js"; // ⬅️ WAJIB PALING ATAS
import { fetchProducts } from "./api.js";
import { AppState } from "./state.js";
import "./provider.js";
import "./order.js";

const grid = document.getElementById("productGrid");
const orderBtn = document.getElementById("orderBtn");
const phoneInput = document.getElementById("phoneInput");

let cachedProducts = null;
const CACHE_KEY = "products_cache_v1";

function updateOrderButton() {
  const enabled = AppState.selectedProduct && AppState.phone;

  orderBtn.disabled = !enabled;
  orderBtn.classList.toggle("active", enabled);
}


function renderProducts(products) {
  grid.innerHTML = "";
  const fragment = document.createDocumentFragment();

  products.forEach((p, i) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.dataset.index = i;

    const nominal = document.createElement("div");
    nominal.className = "nominal";
    nominal.textContent = p.nominal;

    const price = document.createElement("div");
    price.className = "price";
    price.textContent = `Rp ${p.price.toLocaleString("id-ID")}`;

    card.append(nominal, price);
    fragment.appendChild(card);
  });

  grid.appendChild(fragment);
}

grid.addEventListener("click", (e) => {
  const card = e.target.closest(".product-card");
  if (!card) return;

  const active = grid.querySelector(".product-card.active");
  if (active) active.classList.remove("active");

  card.classList.add("active");
  AppState.selectedProduct = cachedProducts[card.dataset.index];
  updateOrderButton();
});

phoneInput.addEventListener("input", updateOrderButton);

async function init() {
  const cached = sessionStorage.getItem(CACHE_KEY);
  if (cached) {
    cachedProducts = JSON.parse(cached);
    renderProducts(cachedProducts);
    return;
  }

  const res = await fetchProducts();
  cachedProducts = res.data;
  sessionStorage.setItem(CACHE_KEY, JSON.stringify(res.data));
  renderProducts(res.data);
}

orderBtn.disabled = true;
init();
