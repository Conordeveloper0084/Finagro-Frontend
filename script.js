const API_URL = "http://localhost:8000"
const STORAGE_KEY = "finagro_user"

// Menu Toggle
document.getElementById("menuToggle")?.addEventListener("click", () => {
  const menu = document.getElementById("mobileMenu")
  menu.classList.toggle("hidden")
})

// Module Switching
function switchModule(moduleName) {
  // Hide all modules
  document.querySelectorAll(".module-content").forEach((mod) => {
    mod.classList.add("hidden")
  })

  // Remove active class from all buttons
  document.querySelectorAll(".module-btn").forEach((btn) => {
    btn.classList.remove("active")
  })

  // Show selected module
  const moduleElement = document.getElementById(`module-${moduleName}`)
  if (moduleElement) {
    moduleElement.classList.remove("hidden")
  }

  // Add active class to clicked button
  event.target.closest(".module-btn").classList.add("active")

  // Scroll to module
  moduleElement?.scrollIntoView({ behavior: "smooth", block: "start" })
}

// Credit Calculator
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
        yer: yer,
        ekin: ekin,
        vil: vil,
        zichlik: zichlik,
      }),
    })

    const data = await response.json()

    // Format numbers
    const formatNumber = (num) => new Intl.NumberFormat("uz-UZ").format(Math.round(num))

    document.getElementById("resultHosil").textContent = formatNumber(data.taxminiy_hosil_t)
    document.getElementById("resultDaromad").textContent = formatNumber(data.taxminiy_daromad)
    document.getElementById("resultKredit").textContent = formatNumber(data.kredit_miqdori)

    document.getElementById("creditResult").classList.remove("hidden")
    console.log("[v0] Credit calculation successful:", data)
  } catch (error) {
    alert("Xatolik yuz berdi. Qayta urinib ko'ring.")
    console.error("[v0] Credit calculation error:", error)
  }
})

// Chat Functionality
async function sendMessage() {
  const chatInput = document.getElementById("chatInput")
  const message = chatInput.value.trim()

  if (!message) return

  // Add user message to chat
  const chatBox = document.getElementById("chatBox")
  const userMessageDiv = document.createElement("div")
  userMessageDiv.className = "flex justify-end"
  userMessageDiv.innerHTML = `<div class="bg-gradient-to-r from-green-500 to-blue-600 text-white px-4 py-2 rounded-lg max-w-xs rounded-br-none">${message}</div>`
  chatBox.appendChild(userMessageDiv)

  chatInput.value = ""
  chatBox.scrollTop = chatBox.scrollHeight

  try {
    const response = await fetch(`${API_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: message }),
    })

    const data = await response.json()

    // Add AI response
    const aiMessageDiv = document.createElement("div")
    aiMessageDiv.className = "flex justify-start"
    aiMessageDiv.innerHTML = `<div class="bg-gray-200 text-gray-900 px-4 py-2 rounded-lg max-w-xs rounded-bl-none">${data.reply}</div>`
    chatBox.appendChild(aiMessageDiv)

    // Show bank button if needed
    if (data.bank_button) {
      const bankBtnDiv = document.createElement("div")
      bankBtnDiv.className = "flex justify-start mt-2"
      bankBtnDiv.innerHTML = `<button onclick="contactBank()" class="px-4 py-2 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg text-sm font-semibold hover:shadow-lg transition">Agrobank bilan bog'lanish</button>`
      chatBox.appendChild(bankBtnDiv)
    }

    chatBox.scrollTop = chatBox.scrollHeight
    console.log("[v0] Chat message sent successfully")
  } catch (error) {
    const errorDiv = document.createElement("div")
    errorDiv.className = "flex justify-start"
    errorDiv.innerHTML = `<div class="bg-red-100 text-red-700 px-4 py-2 rounded-lg max-w-xs">Xatolik yuz berdi. Qayta urinib ko'ring.</div>`
    chatBox.appendChild(errorDiv)
    console.error("[v0] Chat error:", error)
  }
}

// Allow Enter to send message
document.getElementById("chatInput")?.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    sendMessage()
  }
})

// Auth Functions
function openSignIn() {
  document.getElementById("signInModal").classList.remove("hidden")
}

function closeSignIn() {
  document.getElementById("signInModal").classList.add("hidden")
}

function openSignUp() {
  document.getElementById("signUpModal").classList.remove("hidden")
}

function closeSignUp() {
  document.getElementById("signUpModal").classList.add("hidden")
}

function switchToSignIn() {
  closeSignUp()
  openSignIn()
}

function switchToSignUp() {
  closeSignIn()
  openSignUp()
}

// Handle Sign In
function handleSignIn(event) {
  event.preventDefault()
  const form = event.target
  const email = form.querySelector('input[type="email"]').value
  const password = form.querySelector('input[type="password"]').value

  // Save user data to localStorage (JSON file simulation)
  const userData = {
    email: email,
    name: email.split("@")[0],
    loginTime: new Date().toISOString(),
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(userData))
  console.log("[v0] User signed in:", userData)

  alert("Muvaffaqiyatli kirdingiz! Dashboard ga yo'naltirilmoqdasiz...")
  window.location.href = "dashboard.html"
}

// Handle Sign Up
function handleSignUp(event) {
  event.preventDefault()
  const form = event.target
  const name = form.querySelector('input[type="text"]').value
  const email = form.querySelector('input[type="email"]').value
  const password = form.querySelector('input[type="password"]').value

  if (password.length < 8) {
    alert("Parol kamida 8 ta belgidan iborat bo'lishi kerak!")
    return
  }

  // Save user data to localStorage (JSON file simulation)
  const userData = {
    name: name,
    email: email,
    password: password,
    registrationTime: new Date().toISOString(),
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(userData))
  console.log("[v0] User registered:", userData)

  alert("Akkaunt muvaffaqiyatli yaratildi! Dashboarda o'ting...")
  window.location.href = "dashboard.html"
}

// Close modals when clicking outside
window.addEventListener("click", (e) => {
  const signInModal = document.getElementById("signInModal")
  const signUpModal = document.getElementById("signUpModal")

  if (e.target === signInModal) signInModal.classList.add("hidden")
  if (e.target === signUpModal) signUpModal.classList.add("hidden")
})

// Contact Bank
function contactBank() {
  window.open("https://agrobank.uz", "_blank")
}
