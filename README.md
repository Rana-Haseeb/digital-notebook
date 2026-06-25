# 📓 Digital Notebook

[![Live Demo](https://img.shields.io/badge/Live_Demo-Visit_Site-7c3aed?style=for-the-badge&logo=vercel&logoColor=white)](https://digital-notebook-pied.vercel.app/)

> A modern, full-stack web application for creating, managing, and organizing your digital notes with authentication and cloud storage.

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green?logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?logo=mongodb)](https://www.mongodb.com/cloud/atlas)
[![React](https://img.shields.io/badge/React-18.3-blue?logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5.3-purple?logo=vite)](https://vitejs.dev)

---

## 🎯 Features

✨ **Core Features:**

- 🔐 **Secure Authentication** - JWT-based login/registration with bcrypt password hashing
- 📝 **Create & Edit Notes** - Rich note creation with title and content
- 🔍 **Advanced Search** - Search notes by title or content (case-insensitive)
- 🗂️ **Organize Notes** - View all notes sorted by latest update
- 🛡️ **Private Access** - Only authorized users can access their own notes
- 🎨 **Modern UI** - Beautiful, responsive design with Tailwind CSS
- ☁️ **Cloud Storage** - All data persisted in MongoDB Atlas

**Technical Highlights:**

- ⚡ **Fast Development** - Vite for instant HMR during development
- 🔄 **Auto-reload** - Nodemon for automatic backend restart
- 🎯 **Production Ready** - Optimized build for deployment
- 📱 **Fully Responsive** - Works seamlessly on desktop, tablet, and mobile

---

## 🏗️ Project Structure

```
digital-notebook/
├── backend/                    # Node.js + Express server
│   ├── controllers/           # Business logic
│   │   ├── authController.js  # Auth related endpoints
│   │   └── notesController.js # Notes CRUD operations
│   ├── middleware/
│   │   └── auth.js            # JWT verification middleware
│   ├── models/                # MongoDB schemas
│   │   ├── User.js            # User model
│   │   └── Note.js            # Note model
│   ├── routes/                # API endpoints
│   │   ├── auth.js
│   │   └── notes.js
│   ├── .env                   # Environment variables (git ignored)
│   ├── .env.example           # Template for environment setup
│   ├── package.json
│   └── server.js              # Express app entry point
│
├── frontend/                  # React + Vite SPA
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js       # Axios instance with JWT interceptor
│   │   ├── components/        # Reusable React components
│   │   │   ├── NoteCard.jsx
│   │   │   ├── NoteModal.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx # Global auth state management
│   │   ├── pages/             # Page components
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   └── RegisterPage.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css          # Global styles + Tailwind
│   ├── tailwind.config.js
│   ├── vite.config.js
│   ├── package.json
│   └── index.html
│
├── package.json               # Root package.json
├── .gitignore                 # Git ignore rules
└── README.md                  # This file
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** or **yarn** (comes with Node.js)
- **MongoDB Atlas** account ([Sign up free](https://www.mongodb.com/cloud/atlas))

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Rana-Haseeb/digital-notebook.git
   cd digital-notebook
   ```

2. **Setup Backend**

   ```bash
   cd backend
   npm install
   ```

   Create `.env` file in the `backend/` directory (use `.env.example` as template):

   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
   JWT_SECRET=your_strong_random_secret_key_here
   ```

3. **Setup Frontend**

   ```bash
   cd ../frontend
   npm install
   ```

4. **Start Development Servers**

   **Terminal 1 - Backend:**

   ```bash
   cd backend
   npm run dev
   ```

   Backend runs on: `http://localhost:5000`

   **Terminal 2 - Frontend:**

   ```bash
   cd frontend
   npm run dev
   ```

   Frontend runs on: `http://localhost:5173`

5. **Open in Browser**
   ```
   http://localhost:5173
   ```

---

## 🔌 API Documentation

### Authentication Endpoints

| Method | Endpoint             | Description              | Auth Required |
| ------ | -------------------- | ------------------------ | ------------- |
| `POST` | `/api/auth/register` | Register a new user      | ❌            |
| `POST` | `/api/auth/login`    | Login user and get JWT   | ❌            |
| `GET`  | `/api/auth/me`       | Get current user profile | ✅            |

**Request/Response Examples:**

**Register:**

```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (201):**

```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Notes Endpoints

| Method   | Endpoint                    | Description          | Auth Required |
| -------- | --------------------------- | -------------------- | ------------- |
| `GET`    | `/api/notes`                | Get all user's notes | ✅            |
| `GET`    | `/api/notes?search=keyword` | Search notes         | ✅            |
| `GET`    | `/api/notes/:id`            | Get single note      | ✅            |
| `POST`   | `/api/notes`                | Create new note      | ✅            |
| `PUT`    | `/api/notes/:id`            | Update note          | ✅            |
| `DELETE` | `/api/notes/:id`            | Delete note          | ✅            |

**Example - Create Note:**

```bash
POST /api/notes
Authorization: Bearer <your_jwt_token>
Content-Type: application/json

{
  "title": "My First Note",
  "content": "This is the content of my note"
}
```

---

## 🛠️ Tech Stack

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js 4.19
- **Database**: MongoDB 8.4 with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken) + bcryptjs
- **CORS**: Enabled for frontend communication
- **Dev Tools**: Nodemon for auto-restart

### Frontend

- **Library**: React 18.3
- **Build Tool**: Vite 5.3
- **Routing**: React Router DOM 6.24
- **HTTP Client**: Axios 1.7
- **Styling**: Tailwind CSS 3.4
- **Runtime**: ES Modules

---

## 📦 Deployment

### Deploy Frontend on Vercel

1. Push to GitHub
2. Visit [vercel.com](https://vercel.com)
3. Import project → Set root directory to `frontend`
4. Add environment variable: `VITE_API_URL=your_backend_url/api`
5. Deploy (auto-deploys on push)

### Deploy Backend on Render

1. Visit [render.com](https://render.com)
2. Create Web Service from GitHub
3. Build Command: `cd backend && npm install`
4. Start Command: `cd backend && npm start`
5. Add environment variables (PORT, MONGO_URI, JWT_SECRET)

---

## 🔐 Security Practices

✅ **Implemented:**

- JWT tokens for stateless authentication
- bcryptjs for password hashing (10 rounds)
- HTTP-only token storage
- Protected routes with middleware
- Input validation on backend
- CORS configured
- `.env` files in `.gitignore` (never commit secrets!)

📋 **Best Practices:**

- Always use strong JWT_SECRET in production
- Rotate secrets periodically
- Monitor MongoDB Atlas activity
- Use HTTPS in production
- Implement rate limiting (recommended for production)

---

## 🐛 Troubleshooting

**Problem: "Token is invalid or expired"**

- Clear browser localStorage → Logout → Login again
- Check JWT_SECRET consistency between backend and `.env`

**Problem: MongoDB connection failed**

- Verify connection string in `.env`
- Check IP whitelist in MongoDB Atlas (add 0.0.0.0/0 for development)
- Ensure MongoDB user has correct password

**Problem: Frontend can't reach backend**

- Verify backend is running on port 5000
- Check `VITE_API_URL` in frontend `.env`
- CORS errors? Check backend `server.js` CORS config

**Problem: Changes not reflecting**

- Frontend: Vite has HMR, wait 1-2 seconds or manual refresh
- Backend: Nodemon watches for changes, may need to save again

---

## 📝 Environment Variables

### Backend `.env`

```env
PORT=5000                    # Server port
MONGO_URI=...               # MongoDB connection string
JWT_SECRET=...              # Private key for signing JWTs (use strong random)
```

### Frontend `.env.production`

```env
VITE_API_URL=https://your-api.com/api
```

### Frontend `.env.development`

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 📄 License

This project is licensed under the **ISC License** - see the LICENSE file for details.

---

## 👨‍💻 Author

**Muhammad Haseeb Rajpoot**

- GitHub: [@Rana-Haseeb](https://github.com/Rana-Haseeb)
- Email: rajpootmuhammadhaseeb@gmail.com

---

## 🙏 Contributing

Contributions are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 💡 Future Enhancements

- [ ] Note categories/tags
- [ ] Rich text editor
- [ ] Note sharing functionality
- [ ] Dark mode
- [ ] Export notes (PDF, Markdown)
- [ ] Mobile app (React Native)
- [ ] Collaborative real-time editing
- [ ] Note reminders/scheduled notes

---

<div align="center">

**Made with ❤️ by Rana-Haseeb**

⭐ If you find this helpful, please star the repository!

</div>
