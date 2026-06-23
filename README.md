# 🚀 Full-Stack Kanban Project Management Board

A modern, responsive full-stack Kanban board application designed to manage tasks efficiently using a clean UI and a robust backend. This project demonstrates core concepts of full-stack development including API design, state management, and cloud deployment.

---

## 🌐 Live Links

* 🔗 Frontend: https://vercel.app
* 🔗 Backend API: https://onrender.com

---

## 🏗️ Tech Stack

### Frontend

* React (Vite)
* Tailwind CSS
* Axios

### Backend

* Node.js
* Express.js
* MongoDB (Mongoose)

### Deployment

* Vercel (Frontend)
* Render (Backend)
* MongoDB Atlas (Database)

---

## ✨ Features

* ✅ Create, update, and delete tasks (CRUD)
* ✅ Drag-and-drop Kanban board layout
* ✅ Real-time UI updates
* ✅ Responsive design (mobile + desktop)
* ✅ RESTful API integration
* ✅ Environment variable configuration
* ✅ Secure backend with CORS

---

## 📁 Project Structure

```
├── backend/
│   ├── config/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── context/
    │   ├── hooks/
    │   ├── views/
    │   └── App.tsx
    ├── package.json
    └── vite.config.ts
```

---

## ⚙️ Installation & Setup

### 1. Clone Repository

```
git clone https://github.com/CharlesKariuki-001/internet-programming-kanban.git
cd internet-programming-kanban
```

---

### 2. Backend Setup

```
cd backend
npm install
```

Create `.env` file:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

Run server:

```
npm start
```

---

### 3. Frontend Setup

Open a new terminal:

```
cd frontend
npm install
```

Create `.env` file:

```
VITE_API_URL=http://localhost:5000
```

Run frontend:

```
npm run dev
```

---

## 🌍 Deployment

### Backend (Render)

* Create a Web Service
* Set root directory: `backend`
* Build command: `npm install`
* Start command: `node server.js`
* Add environment variable: `MONGO_URI`

---

### Frontend (Vercel)

* Import GitHub repo
* Set root directory: `frontend`
* Add environment variable:
  `VITE_API_URL=<your_render_backend_url>`

---

## 📌 Future Improvements

* 🔐 User authentication (JWT)
* 📊 Advanced analytics dashboard
* 🔔 Notifications system
* 🧑‍🤝‍🧑 Team collaboration features

---

## 👨‍💻 Author

**Charles Kariuki**

---

## 📄 License

This project is licensed under the MIT License.
