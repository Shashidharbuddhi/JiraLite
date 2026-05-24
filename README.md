# JiraLite

A modern project management workspace with authentication, projects, tasks, and a Kanban-style workflow.

## Features
- Authentication with JWT-based sessions
- Projects and tasks CRUD
- Kanban board workflow
- Activity tracking
- Responsive UI with motion and theming

## Tech Stack
- Client: React, Redux Toolkit, Vite, Tailwind CSS, Framer Motion
- Server: Node.js, Express, MongoDB, Mongoose, JWT

## Project Structure
- client: React app
- server: Express API

## Getting Started

### Prerequisites
- Node.js 18+
- npm
- MongoDB instance

### Environment Variables
Create a `.env` file in the `server` folder:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

Create a `.env` file in the `client` folder (or copy from `client/.env.example`):
```
VITE_API_URL=http://localhost:5000/api
```

### Install Dependencies
```
cd server
npm install

cd ../client
npm install
```

### Run in Development
```
cd server
npm run dev

cd ../client
npm run dev
```

The client runs on http://localhost:5173 and the API runs on http://localhost:5000 by default.

## Scripts

### Client
- `npm run dev` - start Vite dev server
- `npm run build` - build for production
- `npm run preview` - preview production build
- `npm run lint` - run ESLint

### Server
- `npm run dev` - start server with nodemon
- `npm start` - start server

## License
ISC
