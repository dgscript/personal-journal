# Backend API

Node.js/Express REST API with MySQL database for the Personal Posts application.

## 🏗️ Architecture

```
middleware/
├── auth.js          # JWT token verification
├── register.js      # User registration validation
├── login.js         # User login authentication
├── post.js          # Create post validation
├── update.js        # Update post validation
└── deletePost.js    # Delete post validation
database.js          # MySQL connection
server.js            # Express app setup & routes
```

## 📡 API Endpoints

### Authentication

#### Register User

```http
POST /register
Content-Type: application/json

{
  "username": "johndoe",
  "password": "securepass123"
}
```

- **Rate Limited:** 10 requests per 10 minutes
- **Response:** `201 Created`

```json
{
  "username": "johndoe",
  "posts": []
}
```

- **Validation:**
  - Username: 3-20 alphanumeric characters + underscores, must be unique
  - Password: 8-16 characters

#### Login User

```http
POST /login
Content-Type: application/json

{
  "username": "johndoe",
  "password": "securepass123"
}
```

- **Response:** `200 OK` + JWT cookie

```json
{
  "username": "johndoe",
  "posts": [...]
}
```

#### Logout

```http
POST /logoff
Authorization: Bearer {token}
```

- **Response:** `200 OK`
- **Clears:** HTTP-only token cookie

### Posts

#### Get User Posts

```http
GET /posts
Authorization: Bearer {token}
```

- **Response:** `200 OK`

```json
{
  "username": "johndoe",
  "posts": [
    {
      "post_id": 1,
      "user_id": "uuid-string",
      "title": "My First Post",
      "content": "Post content here...",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

- **Auth Required:** Yes (JWT token)

#### Create Post

```http
POST /posts
Content-Type: application/json
Authorization: Bearer {token}

{
  "title": "New Post Title",
  "content": "Post content..."
}
```

- **Rate Limited:** 30 posts per 10 minutes
- **Response:** `201 Created`
- **Validation:**
  - Title: Required, max 50 characters
  - Content: Required, no length limit
- **Auth Required:** Yes

#### Update Post

```http
PUT /posts
Content-Type: application/json
Authorization: Bearer {token}

{
  "post_id": 1,
  "title": "Updated Title",
  "content": "Updated content..."
}
```

- **Response:** `200 OK`
- **Validation:** Same as create post, user must own the post
- **Auth Required:** Yes

#### Delete Post

```http
DELETE /posts/:id
Authorization: Bearer {token}
```

- **Response:** `200 OK`
- **Auth Required:** Yes
- **Ownership:** User must own the post

### Utility

#### Health Check

```http
GET /ping
```

- **Response:** `200 OK`

```json
{
  "message": "Pong! Server running..."
}
```

## 🗄️ Database Schema

### Users Table

```sql
CREATE TABLE users (
  user_id VARCHAR(36) PRIMARY KEY,
  username VARCHAR(20) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Posts Table

```sql
CREATE TABLE posts (
  post_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  title VARCHAR(50) NOT NULL,
  content LONGTEXT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NULL,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
```

## ⚙️ Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=8805
HOST=your_mysql_host
USER=your_mysql_user
PASSWORD=your_mysql_password
DATABASE=your_database_name
JWT_PASSWORD=your_jwt_secret_key
```

## 🔐 Middleware

### authMiddleware

- Verifies JWT token from cookies
- Adds user info to `req.user`
- Returns 401 if token invalid/missing

### register

- Validates username (3-20 chars, alphanumeric + underscore, unique)
- Validates password (8-16 chars)
- Generates UUID for user_id
- Returns 400/409 for validation errors

### login

- Verifies username and password against database
- Generates JWT token
- Returns 401 if credentials invalid

### post

- Verifies JWT token
- Validates title (required, max 50 chars)
- Validates content (required)
- Returns 400/401 for validation errors

### update

- Verifies JWT token
- Validates post ownership
- Validates title and content
- Returns 400/404 for validation/not found

### deletePost

- Verifies JWT token
- Validates post ownership
- Returns 403 if user doesn't own post

## 📦 Dependencies

- **express** ^5.2.1 - Web framework
- **mysql2** ^3.22.3 - MySQL client
- **jsonwebtoken** ^9.0.3 - JWT generation/verification
- **cors** ^2.8.6 - Cross-origin requests
- **cookie-parser** ^1.4.7 - Cookie parsing
- **express-rate-limit** ^8.4.1 - Rate limiting
- **dotenv** ^17.4.2 - Environment variables
- **nodemon** ^3.1.14 - Dev server auto-reload

## 🐛 Common Issues

**"Invalid or expired token"**

- Token might be expired or malformed
- Verify JWT_PASSWORD matches between registration and request

**"Too many requests"**

- Rate limit exceeded on auth endpoints (10 attempts per 10 min)
- Wait before trying again

**"Username already taken"**

- Try a different username
- Usernames are case-sensitive

**Database connection fails**

- Verify .env variables are correct
- Check MySQL server is running
- Verify ca.pem file exists for SSL connection
