# JiraLite

A modern SaaS-style project management workspace with role-based authentication, projects, tasks, workspace search, activity tracking, and password recovery.

## Features
- Role-based authentication for `platform_admin`, `workspace_admin`, and `workspace_member`
- Separate admin and member login experience
- Gmail-verified workspace creation during registration
- Project and task CRUD
- Workspace-wide search across projects, tasks, and activity
- Kanban-ready task workflow
- Activity tracking
- Forgot password and reset password flows for verified accounts
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
PLATFORM_ADMIN_EMAIL=admin@jiralite.local
PLATFORM_ADMIN_PASSWORD=Admin@123456

# Required for Gmail verification and forgot-password email delivery
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

### Default Admin Access

If you do not override the platform admin environment variables, the server seeds this admin automatically:

```txt
Email: admin@jiralite.local
Password: Admin@123456
```

Use the admin portal from `/admin/login`, or choose `Admin Login` from the shared login screen.

### Gmail Verification

Workspace self-registration now accepts only `@gmail.com` addresses and does not create the account immediately.

Flow:
- Submit name, workspace name, Gmail address, and password
- JiraLite emails a verification link to that Gmail inbox
- Open `/verify-email/:token` from the email to finish creating the workspace and first workspace admin account

Workspace admins can still add members manually, but member accounts must also use Gmail addresses.

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
- `GET /api/auth/verify-email/:token`

Frontend routes:
- `/forgot-password`
- `/reset-password/:token`

Verification links expire after 30 minutes. Reset tokens are hashed before storage and expire after 15 minutes.

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
