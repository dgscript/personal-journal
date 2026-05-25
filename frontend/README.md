# Frontend - React + TypeScript + Vite

React-based single-page application for the Personal Posts platform.

## Project Structure

```
src/
├── App.tsx                    # Main app component with routing
├── main.tsx                   # Entry point
├── contexts/
│   └── AuthContext.tsx        # Global auth state & user data
├── components/
│   ├── Home.tsx              # Feed of all posts
│   ├── Login.tsx             # Login page
│   ├── Register.tsx          # User registration page
│   ├── Write.tsx             # Create/edit post page
│   ├── Me.tsx                # User profile with their posts
│   ├── Header.tsx            # Navigation header
│   ├── Footer.tsx            # Footer component
│   ├── Notification.tsx      # Toast notifications
│   ├── DeletePost.tsx        # Delete confirmation modal
│   ├── EditPost.tsx          # Edit post modal
│   └── NotFound.tsx          # 404 page
├── styles/
│   ├── _variables.scss       # SCSS variables & color scheme
│   ├── *.css & *.scss        # Component-specific styles
│   └── footer.scss           # Shared styles
└── assets/                   # Images, fonts, etc.
```

## Components

### App.tsx

Main application component with React Router setup.

**Routes:**

- `/` - Home (all posts)
- `/login` - Login page
- `/signin` - Register page
- `/write` - Create/edit post
- `/me` - User profile
- `*` - 404 Not Found

### AuthContext.tsx

Global state management for authentication and user data.

**Provides:**

- `user` - Current logged-in user object
- `setUser` - Update user state
- `loading` - Loading state during auth check

**Hook:** `useAuth()`

```typescript
const { user, setUser, loading } = useAuth();
```

**User Interface:**

```typescript
interface User {
  username: string;
  posts: Post[];
}

interface Post {
  post_id: number;
  title: string;
  content: string;
  createdAt: string;
}
```

### Home.tsx

Displays all posts from all users.

**Features:**

- Fetches all posts from backend
- Displays posts in a grid/list
- Shows post metadata (author, date)
- Loading states

### Login.tsx & Register.tsx

Authentication pages.

**Login Features:**

- Username & password form validation
- Error handling
- Redirects to home on success
- Rate-limited by backend (5 attempts per 10 min)

**Register Features:**

- Username validation (3-20 alphanumeric + underscore)
- Password validation (8-16 characters)
- Checks for duplicate username
- Auto-login after registration

### Write.tsx

Create and edit blog posts.

**Features:**

- Title input (max 50 characters)
- Rich content textarea
- Create new post
- Edit existing post
- Auto-save support
- Post limit: 30 posts per 10 minutes

### Me.tsx

User profile page with user's own posts.

**Features:**

- Display user's posts
- Search/filter posts
- Edit post button
- Delete post with confirmation
- Shows post count & other stats
- Loading indicator

### Header.tsx

Navigation header with user info.

**Features:**

- Conditional navigation (logged in vs logged out)
- User menu
- Logout button
- Links to main routes
- Responsive design

### Notification.tsx

Toast notification component.

**Usage:**

```typescript
const { addNotification } = useNotification();
addNotification("Success message", "success");
addNotification("Error message", "error");
```

### DeletePost.tsx & EditPost.tsx

Modal components for post management.

**DeletePost Modal:**

- Confirmation dialog
- Prevents accidental deletion
- Loading state during delete

**EditPost Modal:**

- Form to edit post title/content
- Validation
- Submit/cancel buttons

## State Management

**AuthContext** provides:

- User authentication state
- Posts data
- Loading states
- Global user information

Uses axios for API calls with credentials (cookies for JWT).

## Styling

**SCSS Variables** (\_variables.scss):

- Color scheme (primary, secondary, accent colors)
- Typography (sans-serif, serif fonts)
- Responsive breakpoints
- Spacing scales

**Component Styles:**

- Each component has `component.scss` file
- CSS compiled from SCSS
- Responsive design with CSS Grid/Flexbox
- Smooth transitions and animations

### Color Variables

```scss
$accent         // Primary action color
$accent-dim     // Hover state for accent
$text-primary   // Main text color
$text-secondary // Secondary text
$text-muted     // Disabled/muted text
$border         // Border color
$surface        // Background surface
$muted          // Muted background
$ink            // Text on accent color
$red            // Delete/error color
```

## 🔌 API Integration

Axios configured to use credentials for cookie-based authentication:

```typescript
axios.get("http://localhost:8805/posts", {
  withCredentials: true,
});
```

**API Base URL:** `http://localhost:8805`

### Endpoints Used

| Method | Endpoint     | Purpose                  |
| ------ | ------------ | ------------------------ |
| GET    | `/posts`     | Fetch user's posts       |
| GET    | `/users`     | Fetch all users (public) |
| POST   | `/register`  | Create new account       |
| POST   | `/login`     | Authenticate user        |
| POST   | `/logoff`    | Logout                   |
| POST   | `/posts`     | Create new post          |
| PUT    | `/posts`     | Update post              |
| DELETE | `/posts/:id` | Delete post              |

## Dependencies

**Core:**

- **react** ^19.2.5 - UI library
- **react-dom** ^19.2.5 - React rendering
- **react-router-dom** ^7.15.0 - Client-side routing
- **axios** ^1.16.0 - HTTP client

**Dev:**

- **typescript** - Type safety
- **vite** - Build tool
- **eslint** - Code quality
- **@vitejs/plugin-react** - Vite React support

## Features

- ✅ User registration & authentication
- ✅ Create, read, update, delete posts
- ✅ User profile page
- ✅ Global post feed
- ✅ Responsive design
- ✅ JWT token authentication
- ✅ Form validation
- ✅ Error handling & notifications
- ✅ Rate limiting (backend enforced)
- ✅ Loading states

## Security

- JWT tokens stored in HTTP-only cookies
- Credentials included in all API requests
- Input validation on all forms
- Protected routes (require authentication)
- Rate limiting on auth endpoints

## Common Issues

**"Invalid or expired token"**

- Try logging out and logging back in
- Check browser cookies are enabled
- Verify backend is running

**Posts not loading**

- Ensure you're logged in to see your posts
- Check network tab in DevTools
- Verify backend API is accessible

**CORS errors**

- Backend CORS is configured for `localhost:5173`
- Verify both frontend and backend are running
- Check backend .env has correct PORT
