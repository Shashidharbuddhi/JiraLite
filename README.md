# JiraLite

A modern SaaS-style project management workspace with role-based authentication, projects, tasks, workspace search, activity tracking, and password recovery.

## Features
- Role-based authentication for `platform_admin`, `workspace_admin`, and `workspace_member`
- Separate admin and member login experience
- Workspace creation during registration
- Project and task CRUD
- Workspace-wide search across projects, tasks, and activity
- Kanban-ready task workflow
- Activity tracking
- Forgot password and reset password flows
- Responsive frontend rebuilt from scratch

## Tech Stack
- Client: React, Redux Toolkit, Vite, Tailwind CSS, Framer Motion
- Server: Node.js, Express, MongoDB, Mongoose, JWT, Nodemailer

## Project Structure
- `client`: React app
- `server`: Express API

## Getting Started

### Prerequisites
- Node.js 18+
- npm
- MongoDB instance

### Environment Variables

Create a `.env` file in the `server` folder:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
CLIENT_URL=http://localhost:5173

# Optional seeded admin overrides
PLATFORM_ADMIN_NAME=Platform Admin
PLATFORM_ADMIN_EMAIL=admin@jiralite.app
PLATFORM_ADMIN_PASSWORD=Admin@123456

# Optional for forgot-password email delivery
MAIL_FROM="JiraLite <no-reply@jiralite.local>"
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
```

Create a `.env` file in the `client` folder:

```env
VITE_API_URL=http://localhost:5000/api
```



### Install Dependencies

```bash
cd server
npm install

cd ../client
npm install
```

### Run in Development

```bash
cd server
npm run dev

cd ../client
npm run dev
```

The client runs on `http://localhost:5173` and the API runs on `http://localhost:5000` by default.

## Search

The top navbar search now performs authenticated workspace search across:
- projects
- tasks
- activity entries

Search requests go through `GET /api/search?q=...`.

## Password Reset

The password reset flow is now available through:
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password/:token`

Frontend routes:
- `/forgot-password`
- `/reset-password/:token`

Reset tokens are hashed before storage and expire after 15 minutes.

## Scripts

### Client
- `npm run dev` - start Vite dev server
- `npm run build` - build for production
- `npm run lint` - run ESLint

### Server
- `npm run dev` - start server with nodemon
- `npm start` - start server

## License
ISC
