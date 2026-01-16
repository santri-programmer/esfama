import { getProducts } from "./api.js";
import { validateOrder } from "./order.js";

export async function loadProducts() {
  const list = document.getElementById("productList");

  try {
    const res = await getProducts();

    console.log("📦 Products:", res.data); // DEBUG

    list.innerHTML = "";

    res.data.forEach((p) => {
      const item = document.createElement("div");
      item.className = "product-card";

      item.innerHTML = `
        <div class="nominal">${p.nominal}</div>
        <div class="price">Rp ${p.price.toLocaleString("id-ID")}</div>
      `;

      item.onclick = () => {
        window.AppState.selectedProduct = {
          _id: p.id,
          nominal: p.nominal,
          price: p.price,
        };

        document
          .querySelectorAll(".product-card")
          .forEach((el) => el.classList.remove("active"));

        item.classList.add("active");
        validateOrder();
      };

      list.appendChild(item);
    });
  } catch (err) {
    console.error("❌ Load products error:", err);
    list.innerHTML = "<p>Gagal memuat produk</p>";
  }
}
