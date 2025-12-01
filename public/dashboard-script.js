// ========================
// GLOBAL SETTINGS
// ========================
const API_URL = "https://finagro-ai.onrender.com";
const STORAGE_KEY = "finagro_user";


// ========================
// TOAST NOTIFICATION
// ========================
function showToast(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <div class="toast-content">
      <span>${message}</span>
      <button class="toast-close" onclick="this.parentElement.parentElement.remove()">×</button>
    </div>
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 5000);
}


// ========================
// MOBILE MENU
// ========================
document.getElementById("menuToggle")?.addEventListener("click", () => {
  document.getElementById("mobileMenu").classList.toggle("hidden");
});


// ========================
// MODULE SWITCHING FIXED
// ========================
function switchModule(moduleName) {
  // Hide all modules
  document.querySelectorAll(".module-content").forEach((mod) => {
    mod.classList.add("hidden")
  })

  // Remove active class from all sidebar buttons
  document.querySelectorAll(".sidebar-link").forEach((btn) => {
    btn.classList.remove("active")
  })

  // Show selected module
  const moduleElement = document.getElementById(`module-${moduleName}`)
  if (moduleElement) {
    moduleElement.classList.remove("hidden")
  }

  // Highlight the clicked button
  const activeBtn = document.querySelector(`.sidebar-link[data-module="${moduleName}"]`)
  if (activeBtn) activeBtn.classList.add("active")

  // Scroll to module
  moduleElement?.scrollIntoView({ behavior: "smooth", block: "start" })

  console.log("[v0] Module switched:", moduleName)
}

// ========================
// CREDIT CALCULATOR (FIXED KEYS)
// ========================
document.getElementById("creditForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const dataToSend = {
    yer_maydoni_ha: Number(document.getElementById("yer").value),
    ekin_turi: document.getElementById("ekin").value,
    viloyat: document.getElementById("viloyat").value,
    zichlik: Number(document.getElementById("zichlik").value)
  };

  try {
    const response = await fetch(`${API_URL}/hosildan-kredit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataToSend),
    });

    const data = await response.json();

    const format = (n) => new Intl.NumberFormat("uz-UZ").format(Math.round(n));

    document.getElementById("resultHosil").textContent = format(data.taxminiy_hosil_t);
    document.getElementById("resultDaromad").textContent = format(data.taxminiy_daromad);
    document.getElementById("resultKredit").textContent = format(data.kredit_miqdori);

    document.getElementById("creditResult").classList.remove("hidden");

  } catch (err) {
    showToast("❌ Xatolik yuz berdi!", "error");
    console.error(err);
  }
});


// ========================
// CHAT FUNCTIONALITY
// ========================
async function sendMessage() {
  const chatInput = document.getElementById("chatInput");
  const message = chatInput.value.trim();
  if (!message) return;

  const chatBox = document.getElementById("chatBox");

  // User message
  chatBox.innerHTML += `
    <div class="flex justify-end">
      <div class="bg-gradient-to-r from-green-500 to-blue-600 text-white px-4 py-2 rounded-lg max-w-xs rounded-br-none">
        ${message}
      </div>
    </div>
  `;
  chatInput.value = "";
  chatBox.scrollTop = chatBox.scrollHeight;

  try {
    const response = await fetch(`${API_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    const data = await response.json();

    chatBox.innerHTML += `
      <div class="flex justify-start">
        <div class="bg-gray-200 text-gray-900 px-4 py-2 rounded-lg max-w-xs rounded-bl-none">
          ${data.reply}
        </div>
      </div>
    `;

    // Add button if bank needed
    if (data.bank_button) {
      chatBox.innerHTML += `
        <div class="flex justify-start mt-2">
          <button onclick="contactBank()" class="px-4 py-2 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg text-sm font-semibold hover:shadow-lg">
            Agrobank bilan bog'lanish
          </button>
        </div>
      `;
    }

    chatBox.scrollTop = chatBox.scrollHeight;

  } catch (err) {
    chatBox.innerHTML += `
      <div class="flex justify-start">
        <div class="bg-red-100 text-red-700 px-4 py-2 rounded-lg max-w-xs">
          Xatolik yuz berdi. Qayta urinib ko'ring.
        </div>
      </div>
    `;
  }
}

// ENTER → Send
document.getElementById("chatInput")?.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});


// ========================
// AUTH FUNCTIONS
// ========================
function handleSignIn(e) {
  e.preventDefault();
  const form = e.target;

  const payload = {
    email: form.querySelector('input[type="email"]').value,
    password: form.querySelector('input[type="password"]').value,
  };

  fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
    .then(async (res) => {
      if (!res.ok) throw new Error((await res.json()).detail);
      return res.json();
    })
    .then((data) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data.user));
      showToast("Muvaffaqiyatli kirdingiz!", "success");
      setTimeout(() => (window.location.href = "dashboard.html"), 800);
    })
    .catch((err) => showToast(err.message, "error"));
}

function handleSignUp(e) {
  e.preventDefault();
  const form = e.target;

  const payload = {
    name: form.querySelector('input[type="text"]').value,
    email: form.querySelector('input[type="email"]').value,
    password: form.querySelector('input[type="password"]').value,
  };

  fetch(`${API_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
    .then(async (res) => {
      if (!res.ok) throw new Error((await res.json()).detail);
      return res.json();
    })
    .then((data) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data.user));
      showToast("Akkaunt yaratildi!", "success");
      setTimeout(() => (window.location.href = "dashboard.html"), 800);
    })
    .catch((err) => showToast(err.message, "error"));
}


// ========================
// CONTACT BANK
// ========================
function contactBank() {
  window.open("https://agrobank.uz", "_blank");
}