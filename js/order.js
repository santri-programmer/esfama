import { createOrder } from "./api.js";
import { AppState } from "./state.js";

const btn = document.getElementById("orderBtn");

let isSubmitting = false;

/**
 * ===============================
 * ORDER SUBMIT
 * ===============================
 */
btn.onclick = async () => {
  if (isSubmitting) return;

  if (!AppState.selectedProduct || !AppState.phone) {
    alert("Silakan pilih produk dan isi nomor tujuan");
    return;
  }

  isSubmitting = true;
  btn.textContent = "Memproses...";
  btn.disabled = true;

  try {
    const res = await createOrder({
      productId: AppState.selectedProduct.id,
      phone: AppState.phone,
    });

    const order = res.data;

    const message = `
Halo Admin 👋

🆔 Order ID: ${order.orderCode}

📱 Nomor: ${order.phone}
📡 Provider: ${order.provider}
💰 Produk: ${order.product}
💵 Total: Rp ${Number(order.price).toLocaleString("id-ID")}

Mohon diproses 🙏
`.trim();

    window.open(
      `https://wa.me/6282138051507?text=${encodeURIComponent(message)}`,
      "_blank"
    );

    // Reset state (optional UX)
    AppState.selectedProduct = null;
    btn.textContent = "Pesan Sekarang";
  } catch (err) {
    alert(err.message || "Gagal membuat order");
    btn.textContent = "Pesan Sekarang";
  } finally {
    isSubmitting = false;
    btn.disabled = false;
  }
};
