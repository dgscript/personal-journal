# Personal Posts - Full Stack Blog Application

A full-stack web application for creating, reading, updating, and deleting personal blog posts with user authentication.

## 🎯 Project Overview

**Personal Posts** is a modern blogging platform built with React/TypeScript and Node.js/Express. It features JWT-based authentication, MySQL database, and a responsive UI with SCSS styling.

## 📁 Project Structure

```
├── backend/          # Express.js REST API server
└── frontend/         # React + Vite + TypeScript application
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v14+)
- MySQL server
- npm or yarn

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env  # Configure your environment variables
npm run dev           # Start development server on port 8805
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev           # Start dev server on port 5173
```

## 📖 Documentation

- **[Backend Documentation](./backend/README.md)** - API endpoints, database schema, authentication
- **[Frontend Documentation](./frontend/README.md)** - Components, state management, styling

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) stored in HTTP-only cookies for secure authentication.

## 📚 Tech Stack

**Backend:**

- Express.js
- MySQL2
- JWT (jsonwebtoken)
- CORS

**Frontend:**

- React 19
- TypeScript
- React Router v7
- Axios
- Vite
- SCSS

## 🛡️ Security Features

- JWT token-based authentication
- HTTP-only cookies
- Rate limiting on auth endpoints
- Password validation (8-16 characters)
- Username validation (3-20 alphanumeric characters)
