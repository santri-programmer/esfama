import { createOrder } from "./api.js";
import { AppState } from "./state.js";

const btn = document.getElementById("orderBtn");
let isSubmitting = false;

const safe = (v) => String(v).replace(/[<>]/g, "");

btn.onclick = async () => {
  if (isSubmitting) return;

  if (!AppState.selectedProduct || !AppState.phone) {
    alert("Silakan pilih produk dan isi nomor tujuan");
    return;
  }

  isSubmitting = true;
  btn.disabled = true;
  btn.textContent = "Memproses...";

  try {
    const res = await createOrder({
      productId: AppState.selectedProduct.id,
      phone: AppState.phone,
    });

    const o = res.data;

    const msg = `
Halo Admin 👋😊

Saya ingin melakukan pembelian pulsa dengan detail berikut ya:

━━━━━━━━━━━━━━
🧾 *Detail Pesanan*
🆔 ID Pesanan : ${safe(o.orderCode)}

📱 Nomor      : ${safe(o.phone)}
📡 Provider   : ${safe(o.provider)}
💰 Produk     : ${safe(o.product)}
💵 Total Bayar: Rp ${Number(o.price).toLocaleString("id-ID")}
━━━━━━━━━━━━━━

Mohon bantu diproses 🙏  
Terima kasih banyak ya 😊
`.trim();


    window.open(
      `https://wa.me/6282138051507?text=${encodeURIComponent(msg)}`,
      "_blank"
    );

    AppState.selectedProduct = null;
  } catch (err) {
    alert(err.message || "Gagal membuat order");
  } finally {
    btn.textContent = "Pesan Sekarang";
    btn.disabled = false;
    isSubmitting = false;
  }
};
