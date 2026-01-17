import { AppState } from "./state.js";

const phoneInput = document.getElementById("phoneInput");
const providerInfo = document.getElementById("providerInfo");

const PROVIDER_RULES = [
  { name: "TELKOMSEL/By.U", regex: /^08(11|12|13|21|22|23|51)/ },
  { name: "XL", regex: /^08(17|18|19|59|77|78)/ },
  { name: "INDOSAT", regex: /^08(14|15|16|55|56|57|58)/ },
  { name: "THREE", regex: /^089/ },
];

let t;

phoneInput.addEventListener("input", (e) => {
  clearTimeout(t);

  t = setTimeout(() => {
    const value = e.target.value.trim();

    AppState.phone = value;
    AppState.provider = null;
    providerInfo.textContent = "";

    for (const p of PROVIDER_RULES) {
      if (p.regex.test(value)) {
        AppState.provider = p.name;
        providerInfo.textContent = `📡 Provider: ${p.name}`;
        break;
      }
    }
  }, 80);
});
