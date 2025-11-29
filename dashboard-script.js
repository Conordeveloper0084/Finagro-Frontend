const API_URL = "https://finagro-ai.onrender.com";
const STORAGE_KEY = "finagro_user"

// Check authentication on page load
window.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem(STORAGE_KEY))

  if (!user) {
    alert("Avval ro'yxatdan o'tishingiz kerak!")
    window.location.href = "index.html"
  } else {
    document.getElementById("userName").textContent = user.name || "Fermer"
    document.getElementById("userInitial").textContent = (user.name || "F").charAt(0).toUpperCase()
    document.getElementById("sidebarFooterUserName").textContent = user.name || "Fermer"
  }

  switchModule("kredit")
})

function openModule(moduleName) {
  document.getElementById("dashboard-home").classList.add("hidden")
  document.getElementById("dashboard-container").classList.remove("hidden")
  switchModule(moduleName)
}

function goHome() {
  document.getElementById("dashboard-home").classList.remove("hidden")
  document.getElementById("dashboard-container").classList.add("hidden")
}

function toggleSidebar() {
  const sidebar = document.getElementById("sidebar")
  sidebar.classList.toggle("closed")
}

function closeSidebar() {
  const sidebar = document.getElementById("sidebar")
  const overlay = document.getElementById("sidebarOverlay")
  sidebar.classList.remove("show")
  overlay.classList.remove("show")
}

function closeSidebarOnMobile() {
  if (window.innerWidth <= 768) {
    closeSidebar()
  }
}

function logout() {
  localStorage.removeItem(STORAGE_KEY)
  alert("Chiqishdan muvaffaq oldingiz!")
  window.location.href = "index.html"
}

function switchModule(moduleName) {
  document.querySelectorAll(".module-content").forEach((mod) => {
    mod.classList.add("hidden")
  })

  document.querySelectorAll(".sidebar-link").forEach((btn) => {
    btn.classList.remove("active")
  })

  const moduleElement = document.getElementById(`module-${moduleName}`)
  if (moduleElement) {
    moduleElement.classList.remove("hidden")
  }

  document.querySelector(`[data-module="${moduleName}"]`)?.classList.add("active")
}

// Credit Calculator - Integrated with API
document.getElementById("creditForm")?.addEventListener("submit", async (e) => {
  e.preventDefault()

  const yer = Number.parseFloat(document.getElementById("yer").value)
  const ekin = document.getElementById("ekin").value
  const vil = document.getElementById("viloyat").value
  const zichlik = Number.parseFloat(document.getElementById("zichlik").value)

  try {
    const response = await fetch(`${API_URL}/hosildan-kredit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        yer_maydoni_ha: yer,
        ekin_turi: ekin,
        viloyat: vil,
        zichlik: zichlik,
      }),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()

    const formatNumber = (num) => new Intl.NumberFormat("uz-UZ").format(Math.round(num))

    document.getElementById("resultHosil").textContent = formatNumber(data.taxminiy_hosil_t || 0)
    document.getElementById("resultDaromad").textContent = formatNumber(data.taxminiy_daromad || 0)
    document.getElementById("resultKredit").textContent = formatNumber(data.kredit_miqdori || 0)

    document.getElementById("creditResult").classList.remove("hidden")
  } catch (error) {
    alert("Xatolik yuz berdi. Qayta urinib ko'ring. Backend ishlamayotgan bo'lishi mumkin.")
    console.error("Credit calculation error:", error)
  }
})

// Chat Functionality - Integrated with API
async function sendMessage() {
  const chatInput = document.getElementById("chatInput")
  const message = chatInput.value.trim()

  if (!message) return

  // Add user message to chat
  const chatBox = document.getElementById("chatBox")
  const userMessageDiv = document.createElement("div")
  userMessageDiv.className = "chat-message user-message"
  userMessageDiv.innerHTML = `<div class="message-content">${message}</div>`
  chatBox.appendChild(userMessageDiv)

  chatInput.value = ""
  chatBox.scrollTop = chatBox.scrollHeight

  const loadingDiv = document.createElement("div")
  loadingDiv.className = "chat-message bot-message"
  loadingDiv.id = "loadingIndicator"
  loadingDiv.innerHTML = `<div class="message-content">
    <div class="typing-indicator">
      <span class="typing-text">Javob tayyorlanmoqda</span>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
    </div>
  </div>`
  chatBox.appendChild(loadingDiv)
  chatBox.scrollTop = chatBox.scrollHeight

  try {
    const response = await fetch(`${API_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: message }),
    })

    const loadingElement = document.getElementById("loadingIndicator")
    if (loadingElement) {
      loadingElement.remove()
    }

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()

    const aiMessageDiv = document.createElement("div")
    aiMessageDiv.className = "chat-message bot-message"
    aiMessageDiv.innerHTML = `<div class="message-content">${data.reply}</div>`
    chatBox.appendChild(aiMessageDiv)

    // Show bank button if needed
    // if (data.bank_button) {
    //   const bankBtnDiv = document.createElement("div")
    //   bankBtnDiv.className = "flex justify-start mt-2"
    //   bankBtnDiv.innerHTML = `<button onclick="contactBank()" class="px-4 py-2 bg-gradient-to-r from-emerald-600 to-green-600 text-red rounded-lg text-sm font-semibold hover:shadow-lg transition">Agrobank bilan bog'lanish</button>`
    //   chatBox.appendChild(bankBtnDiv)
    // }

    chatBox.scrollTop = chatBox.scrollHeight
  } catch (error) {
    const loadingElement = document.getElementById("loadingIndicator")
    if (loadingElement) {
      loadingElement.remove()
    }

    const errorDiv = document.createElement("div")
    errorDiv.className = "chat-message bot-message"
    errorDiv.innerHTML = `<div class="message-content" style="background-color: #fee; color: #c00;">Xatolik yuz berdi. Qayta urinib ko'ring.</div>`
    chatBox.appendChild(errorDiv)
    console.error("Chat error:", error)
  }
}

// Allow Enter to send message
document.getElementById("chatInput")?.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    sendMessage()
  }
})

// Contact Bank
function contactBank() {
  window.open("https://agrobank.uz", "_blank")
}
