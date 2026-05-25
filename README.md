# Personal Posts - Full Stack Blog Application

A full-stack web application for creating, reading, updating, and deleting personal blog posts with user authentication.

**Personal Posts** is a modern blogging platform built with React/TypeScript and Node.js/Express. It features JWT-based authentication, MySQL database, and a responsive UI with SCSS styling.

## Project Structure

```
├── backend/          # Express.js REST API server
└── frontend/         # React + Vite + TypeScript application
```

## Documentation

- **[Backend Documentation](./backend/README.md)** - API endpoints, database schema, authentication
- **[Frontend Documentation](./frontend/README.md)** - Components, state management, styling

## Authentication

The application uses JWT (JSON Web Tokens) stored in HTTP-only cookies for secure authentication.

## Tech Stack

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

## Security Features

- JWT token-based authentication
- HTTP-only cookies
- Rate limiting on auth endpoints
- Password validation (8-16 characters)
- Username validation (3-20 alphanumeric characters)
