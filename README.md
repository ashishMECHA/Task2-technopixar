# MERN User Authentication & Role-Based Dashboard

A production-ready full-stack authentication system featuring secure registration, login, and a role-aware dashboard. The system restricts application access to authenticated users and exposes administrative panels exclusively to users with the Admin role.

---

## How to Run Locally

### 1. Prerequisites
Ensure you have the following installed on your machine:
*   [Node.js](https://nodejs.org/) (Version 18 or higher)
*   [MongoDB](https://www.mongodb.com/) (Local installation or a remote Atlas cloud database connection string)

### 2. Clone the Repository
Clone the repository using Git and navigate into the project root directory:
```bash
git clone https://github.com/ashishMECHA/Task2-technopixar.git
cd Task2-technopixar
```

### 3. Backend Setup
1. Open your terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install the required dependencies:
   ```bash
   npm install
   ```
3. Set up the environment file:
   * Copy the example file to create a `.env` file:
     ```bash
     cp .env.example .env
     ```
   * Open the `.env` file and configure your variables (e.g., your database connection string and secret session keys).
4. Start the backend development server:
   ```bash
   npm run dev
   ```
   The backend server will run at `http://localhost:5000`.

### 4. Frontend Setup
1. Open a new terminal window and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the frontend dependencies:
   ```bash
   npm install
   ```
3. Set up the environment file:
   * Copy the example file to create a `.env` file:
     ```bash
     cp .env.example .env
     ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   The application will be accessible at `http://localhost:5173`.

---

## Environment Variables Configuration

### Backend Environment (`backend/.env`)

| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `PORT` | The network port the server listens on | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/auth-app` |
| `JWT_SECRET` | Secret key used for signing session tokens | `your_secret_session_signing_key` |
| `JWT_EXPIRES_IN` | Duration before a session token expires | `7d` |
| `NODE_ENV` | Mode of operation | `development` |

### Frontend Environment (`frontend/.env`)

| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `VITE_API_URL` | Base URL of the backend API service | `http://localhost:5000/api` |

---

## Technical Approach & Architecture

The system is designed with security and clean separation of concerns in mind:

### 1. Data Integrity and Security (Backend)
*   **Password Safety**: User passwords are encrypted using `bcryptjs` with 10 hashing rounds before saving to the database. The system only encrypts the password if it has been newly created or modified, preventing duplicate encryption. Passwords are also configured to be excluded from database query returns by default to prevent leakage.
*   **Token-Based Sessions**: Sessions are managed using JSON Web Tokens (JWT). When a user successfully logs in, the backend issues a signed token containing their identifier and user role.
*   **Route Safeguards (Middlewares)**:
    *   **User Verification**: Inspects incoming HTTP requests for valid session tokens. If the token is missing or has expired, access is denied.
    *   **Role Check**: Ensures only users with the `admin` role can access management endpoints.
    *   **Error Handling**: Centralizes all error processing to return structured, user-friendly error responses (e.g., indicating when an email is already registered or inputs are invalid).

### 2. User Experience and State Management (Frontend)
*   **Consistent Session State**: A global React Context manages the login, registration, and logout states. It checks for a valid session token on page load, fetching the user profile to prevent layout flashes.
*   **Automatic Logout**: An Axios response interceptor monitors all server interactions. If the backend reports that a session token has expired, the client automatically clears local storage, updates the application state, and redirects the user to the Login page.
*   **Role-Aware Views**: Users with the `admin` role are shown an interactive Admin Panel displaying user statistics and a searchable, filterable grid of all registered users. Non-admin users see a simple dashboard with their profile summary.

---

## API Endpoints

All protected endpoints require an `Authorization` header containing the token: `Bearer <your_token>`.

### Authentication Endpoints
*   `POST /api/auth/register` — Create a new user account (accepts name, email, password, and role).
*   `POST /api/auth/login` — Verifies user credentials and returns a session token.

### User Endpoints
*   `GET /api/users/me` *(Protected)* — Retrieves the profile details of the logged-in user.
*   `GET /api/users` *(Admin Only)* — Retrieves a list of all registered users.
*   `GET /api/users/stats` *(Admin Only)* — Retrieves statistics on user counts and monthly registrations.

---

## Project Structure

```
authentiaction/
├── backend/                  # Node.js + Express backend service
│   ├── src/
│   │   ├── config/           # Database configuration
│   │   ├── controllers/      # Route handler logic
│   │   ├── middleware/       # Token checks, role validation, and errors
│   │   ├── models/           # Mongoose schemas (User database structure)
│   │   ├── routes/           # REST API routes
│   │   └── app.js            # Express app configuration
│   └── server.js             # Service entry point
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── api/              # Axios configuration and interceptors
│   │   ├── context/          # Shared authentication state
│   │   ├── components/       # Shared interface components (Admin Panel, Navbar)
│   │   ├── pages/            # Login, Signup, and Dashboard pages
│   │   └── routes/           # Frontend route definitions and safeguards
│   └── package.json          # Frontend packages and scripts
└── README.md
```

---

## License

This project is licensed under the ISC License.
