# MERN Authentication & Role-Based Dashboard

Production-quality MERN stack application with JWT authentication, protected routes, and role-based access control (RBAC).

## Features

- User registration and login with JWT
- bcrypt password hashing
- Protected API and frontend routes
- Role-based authorization (`admin` / `user`)
- Admin user management panel
- Session persistence with auto-fetch on refresh
- Token expiration handling with auto logout
- Axios interceptors for auth headers
- Toast notifications, loading spinners, skeleton loaders
- Responsive Tailwind CSS UI

## Tech Stack

| Layer    | Technologies                                      |
| -------- | --------------------------------------------------- |
| Frontend | React (Vite), React Router, Axios, Context API, Tailwind CSS |
| Backend  | Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs  |

## Technical Approach & Implementation

This section highlights the design choices, security measures, and architecture patterns utilized in this project:

### 1. Backend Security & Data Architecture
* **Password Hashing & Protection**: User passwords are automatically hashed with `bcryptjs` using 10 salt rounds in a Mongoose `pre('save')` hook. The code verifies if the password is modified (`isModified('password')`) before rehashing to prevent double-encryption on user updates. The password schema configuration includes `select: false` to ensure hashes are never returned in queries.
* **Stateless JWT Sessions**: Upon successful login, the system signs a JWT token including the user's `id` and `role`. 
* **Custom Express Middlewares**:
  * `authenticateUser`: Validates the `Authorization: Bearer <jwt_token>` header, handles `TokenExpiredError` explicitly, and attaches the user instance to `req.user`.
  * `authorizeRoles(...roles)`: Verifies role access (e.g. `admin`) and throws a `403 Forbidden` response for unauthorized roles.
  * `errorMiddleware`: Captures validation errors (400), duplicate key errors (409), and Mongoose CastErrors (404), converting them to structured JSON.

### 2. Frontend State & Navigation Architecture
* **Global Auth Context ([AuthContext.jsx](file:///c:/Users/thaku/Desktop/authentiaction/frontend/src/context/AuthContext.jsx))**: Centralizes session states (`user`, `token`, `loading`) and authentication routines.
* **Navigation Protection & Flicker Prevention**: A [ProtectedRoute.jsx](file:///c:/Users/thaku/Desktop/authentiaction/frontend/src/components/ProtectedRoute.jsx) wrapper shields dashboard pages from public access. The application preserves a global loading state while checking `/users/me` on refresh to avoid visual page flashes.
* **Axios Interceptors ([axios.js](file:///c:/Users/thaku/Desktop/authentiaction/frontend/src/api/axios.js))**: Injects the stored JWT token into all outgoing requests. Automatically intercepts `401 Token expired` errors to perform a clean state logout and redirect the user.
* **Dynamic Role-Based Dashboard**: Differentiates views based on `user.role`. Admins are shown the [AdminPanel.jsx](file:///c:/Users/thaku/Desktop/authentiaction/frontend/src/components/AdminPanel.jsx) displaying metrics and a searchable user grid, whereas standard users see basic details.

## Project Structure

```
authentiaction/
├── backend/
│   ├── src/
│   │   ├── config/db.js
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/User.js
│   │   ├── routes/
│   │   ├── utils/generateToken.js
│   │   └── app.js
│   ├── server.js
│   ├── .env
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/axios.js
│   │   ├── context/AuthContext.jsx
│   │   ├── pages/
│   │   ├── components/
│   │   └── routes/AppRoutes.jsx
│   └── package.json
└── README.md
```

## Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/) running locally or a MongoDB Atlas connection string

## Installation

### 1. Clone and enter the project

```bash
cd authentiaction
```

### 2. Backend setup

```bash
cd backend
npm install
```

Copy the environment file and update values:

```bash
cp .env.example .env
```

Edit `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/auth-app
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

Start the backend:

```bash
npm run dev
```

Server runs at `http://localhost:5000`

### 3. Frontend setup

Open a new terminal:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Frontend runs at `http://localhost:5173`

## Environment Variables

### Backend (`.env`)

| Variable         | Description                    | Example                              |
| ---------------- | ------------------------------ | ------------------------------------ |
| `PORT`           | Server port                    | `5000`                               |
| `MONGO_URI`      | MongoDB connection string      | `mongodb://localhost:27017/auth-app` |
| `JWT_SECRET`     | Secret key for signing JWTs    | `your_secret_key`                    |
| `JWT_EXPIRES_IN` | Token expiration               | `7d`                                 |
| `NODE_ENV`       | Environment                    | `development`                        |

### Frontend (`.env`)

| Variable       | Description      | Example                      |
| -------------- | ---------------- | ---------------------------- |
| `VITE_API_URL` | Backend API base | `http://localhost:5000/api`  |

---

## API Documentation

Base URL: `http://localhost:5000/api`

All protected routes require the header:

```
Authorization: Bearer <jwt_token>
```

### Health Check

```
GET /api/health
```

**Response `200`**

```json
{
  "status": "ok",
  "message": "Server is running"
}
```

---

### Register

```
POST /api/auth/register
```

**Body**

```json
{
  "name": "John",
  "email": "john@test.com",
  "password": "123456",
  "role": "user"
}
```

| Field    | Required | Rules                          |
| -------- | -------- | ------------------------------ |
| `name`   | Yes      | Non-empty string               |
| `email`  | Yes      | Valid email format, unique     |
| `password` | Yes    | Minimum 6 characters           |
| `role`   | No       | `admin` or `user` (default: `user`) |

**Response `201 Created`**

```json
{
  "message": "User registered successfully",
  "user": {
    "id": "...",
    "name": "John",
    "email": "john@test.com",
    "role": "user"
  }
}
```

**Response `409 Conflict`**

```json
{
  "message": "Email already exists"
}
```

---

### Login

```
POST /api/auth/login
```

**Body**

```json
{
  "email": "john@test.com",
  "password": "123456"
}
```

**Response `200 OK`**

```json
{
  "token": "jwt_token",
  "user": {
    "id": "...",
    "name": "John",
    "email": "john@test.com",
    "role": "user"
  }
}
```

**Response `401 Unauthorized`**

```json
{
  "message": "Invalid credentials"
}
```

Returned for both unknown email and wrong password to prevent user enumeration.

---

### Get Current User

```
GET /api/users/me
```

Protected route.

**Response `200 OK`**

```json
{
  "id": "...",
  "name": "John",
  "email": "john@test.com",
  "role": "user"
}
```

**Response `401 Unauthorized`**

```json
{
  "message": "Not authorized, no token"
}
```

---

### Get All Users (Admin Only)

```
GET /api/users
```

Protected route. Requires `admin` role.

**Response `200 OK`**

```json
[
  {
    "name": "John",
    "email": "john@test.com",
    "role": "user"
  }
]
```

**Response `403 Forbidden`**

```json
{
  "message": "Forbidden"
}
```

---

## JWT Payload

```json
{
  "id": "user_mongodb_id",
  "role": "admin"
}
```

- Expiration: 7 days (configurable via `JWT_EXPIRES_IN`)
- Signed with `JWT_SECRET`

---

## Frontend Routes

| Route         | Access        | Description              |
| ------------- | ------------- | ------------------------ |
| `/login`      | Public        | Login page               |
| `/register`   | Public        | Registration page        |
| `/dashboard`  | Authenticated | User dashboard           |

- Unauthenticated users are redirected to `/login`
- Authenticated users visiting `/login` or `/register` are redirected to `/dashboard`
- Admin panel is only rendered when `user.role === "admin"`

---

## Security

- Passwords hashed with bcrypt (salt rounds: 10)
- JWT stored in `localStorage`
- Backend route protection via `authenticateUser` middleware
- Role checks via `authorizeRoles(...roles)` middleware
- Input validation on register/login
- Centralized error handling with meaningful messages
- Token expiration triggers automatic logout on the frontend

---

## Quick Test Flow

1. Start MongoDB and both servers
2. Open `http://localhost:5173/register`
3. Register as **admin** (select Admin in role dropdown)
4. Log in and verify the dashboard shows your profile
5. Confirm the **User Management** table appears for admin users
6. Register a second user with role **user**, log in, and confirm the admin panel is hidden

---

## Scripts

### Backend

| Command       | Description              |
| ------------- | ------------------------ |
| `npm start`   | Start production server  |
| `npm run dev` | Start with file watching |

### Frontend

| Command         | Description        |
| --------------- | ------------------ |
| `npm run dev`   | Development server |
| `npm run build` | Production build   |
| `npm run preview` | Preview build    |

---

## License

ISC
