# Task Management Web Application

A full-stack task management application with user authentication, task filtering, and a modern responsive UI.

![Node.js](https://img.shields.io/badge/Node.js-v18+-green)
![MongoDB](https://img.shields.io/badge/MongoDB-v6+-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

## Features

- **User Authentication** - Register, login, JWT-based sessions
- **Task CRUD** - Create, read, update, delete tasks
- **Task Filtering** - Filter by status, search by title, sort options
- **User-specific Tasks** - Each user sees only their own tasks
- **Responsive Design** - Works on desktop and mobile

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Backend | Node.js, Express.js |
| Database | MongoDB with Mongoose |
| Auth | JWT (jsonwebtoken), bcryptjs |

## Project Structure

```
├── backend/
│   ├── config/db.js          # MongoDB connection
│   ├── controllers/          # Route handlers
│   ├── middleware/auth.js    # JWT authentication
│   ├── models/               # Mongoose schemas
│   ├── routes/               # API routes
│   └── server.js             # Express server
├── frontend/
│   ├── css/                  # Stylesheets
│   ├── js/                   # JavaScript files
│   ├── index.html            # Main app page
│   ├── login.html            # Login page
│   └── register.html         # Registration page
```

## Setup Instructions

### Prerequisites

- Node.js v18 or higher
- MongoDB (local or Atlas)
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/JalpPansuriya/Task-Management-Web-Application.git
cd Task-Management-Web-Application
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=your-secret-key-here
JWT_EXPIRE=7d
```

Start the backend server:

```bash
npm run dev
```

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend
npx live-server --port=3000
```

Or simply open `frontend/index.html` in your browser.

### 4. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |

### Tasks (Protected)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks |
| GET | `/api/tasks/:id` | Get single task |
| POST | `/api/tasks` | Create task |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |

### Query Parameters

```
GET /api/tasks?status=pending&search=meeting&sort=newest
```

| Parameter | Values |
|-----------|--------|
| status | all, pending, in-progress, completed |
| search | Any string (case-insensitive) |
| sort | newest, oldest, title_asc, title_desc |

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| MONGODB_URI | MongoDB connection string | - |
| JWT_SECRET | Secret key for JWT | - |
| JWT_EXPIRE | Token expiration time | 7d |

## License

MIT License - feel free to use this project for learning or building upon it.
