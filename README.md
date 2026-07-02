# 🍽️ Taste Haven Restaurant Project

A full-stack restaurant menu and order management web app using **HTML**, **CSS**, **JavaScript**, **Node.js**, and **MongoDB**.

## 🚀 Features
- View menu with images
- Place food orders
- Stylish dark theme
- Logo, menu cards, contact section

## 📦 Technologies
- Frontend: HTML, CSS, JS
- Backend: Node.js, Express
- Database: MongoDB
- Styling: Dark theme with responsive layout

## 💻 How to Run

**1. Start the backend**
```bash
git clone https://github.com/rakshit0907/restaurant-project.git
cd restaurant-project/backend
npm install
cp .env.example .env
# then edit .env and paste in your own MongoDB connection string
npm start
```
The API will run on `http://localhost:3000`.

**2. Open the frontend**
Open `index.html` (in the project root) directly in your browser, or serve it with a simple static server. Make sure the backend is running first, or "View Menu" / "Submit Order" will fail with a connection error.

> ⚠️ Never commit your real `.env` file. It's already excluded via `.gitignore`.
