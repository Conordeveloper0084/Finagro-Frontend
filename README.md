🌾 Finagro AI — Agro & Banking Assistant (Full-Stack MVP)

Finagro AI is a lightweight, fast, and intuitive AI-powered platform designed to help farmers calculate crop-based credit, detect plant diseases, optimize fertilization & irrigation plans, and communicate with an AI assistant specialized in agriculture and rural banking.

This project includes:
	•	Full Frontend (HTML, CSS, JS – V0 styled)
	•	FastAPI Backend (chatbot + credit calculator API)
	•	OpenAI-powered AI assistant (domain-restricted)
	•	Modular dashboard UI for navigating features
	•	Local JSON-based data handling (MVP friendly)

⸻

🚀 Features

✅ AI Chat Assistant
	•	Trained to answer agriculture + Agrobank banking topics only
	•	Forbidden categories filter
	•	Fun responses for informal topics (e.g., love, Mars, etc.)

✅ Crop-Based Credit Calculator (API + UI)
	•	Calculates:
	•	Estimated yield (tons)
	•	Estimated revenue (UZS)
	•	Recommended credit amount
	•	Considers crop type, region, density, and base coefficients.

✅ Modular Dashboard

Includes the following modules:
	•	Hosildan Kredit (Credit Calculator)
	•	KasallikShield (Disease info – placeholder)
	•	Fertilizer & Irrigation Planner (coming soon)
	•	AI Chat Assistant

✅ Clean Architecture
	•	services/ → Chat logic & domain logic
	•	routers/ → API endpoints
	•	kredit_hisoblash.py → Credit calculation model
	•	main.py → FastAPI app initialization
	•	Frontend → Static HTML/CSS/JS, ready for deployment

⸻

🛠 Tech Stack

Backend
	•	Python 3.11+
	•	FastAPI
	•	Uvicorn
	•	OpenAI API
	•	Pydantic
	•	CORS middleware

Frontend
	•	HTML / CSS / JavaScript
	•	Tailwind-style utility classes
	•	Fully responsive dashboard UI

Project Structure:

Finagro/
│── main.py
│── config.py
│── kredit_hisoblash.py
│── routers/
│     └── chat.py
│── services/
│     └── chat_service.py
│── static/
│     ├── index.html
│     ├── dashboard.html
│     ├── styles.css
│     └── dashboard-script.js
│── venv/
│── requirements.txt
└── README.md

