import express from "express";
import cors from "cors";
import "dotenv/config";
import jwt from "jsonwebtoken";
import { db } from "./database.js";
import { post } from "./middleware/post.js";
import { register } from "./middleware/register.js";
import { login } from "./middleware/login.js";
import { update } from "./middleware/update.js";
import { deletePost } from "./middleware/deletePost.js";
import { authMiddleware } from "./middleware/auth.js";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 200, // max 100 requests
  message: "Too many requests, try again later.",
});

const PORT = process.env.PORT || 3000;
const app = express();

app.use(limiter);
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.get("/ping", (req, res) => {
  res.json({ message: "Server running..." });
});

/* get posts from the logged user */
app.get("/posts", authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    const [posts] = await db.query("SELECT * FROM posts WHERE user_id = ?", [
      user.user_id,
    ]);
    const [username] = await db.query(
      "SELECT username FROM users WHERE user_id = ?",
      [user.user_id],
    );

    if (posts.length === 0)
      return res.status(404).json({ message: "This user has no posts." });

    res.status(200).send({ username: username[0].username, posts: posts });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error." });
  }
});
/* registers a new user */
app.post(
  "/register",
  rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 10,
    message: "Too many requests to register, try again later.",
  }),
  register,
  async (req, res) => {
    try {
      const { user_id, username, password } = req.body;
      await db.query(
        "INSERT INTO users (user_id, username, password) VALUES (?, ?, ?)",
        [user_id, username, password],
      );

      const token = jwt.sign({ user_id: user_id }, process.env.JWT_PASSWORD);
      res.cookie("token", token, {
        httpOnly: true,
        secure: false,
      });

      res.status(201).json({ username: username, posts: [] });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something went wrong, try again." });
    }
  },
);
/* login route */
app.post(
  "/login",
  rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 10,
    message: "Too many attempts to login, try again later.",
  }),
  login,
  async (req, res) => {
    const token = req.token;
    const username = req.body.username;
    const id = req.body.user_id;

    const [posts] = await db.query("SELECT * FROM posts WHERE user_id = ?", [
      id,
    ]);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
    });

    return res.status(200).json({
      username: username,
      posts: posts,
    });
  },
);
app.post("/logoff", authMiddleware, (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
    sameSite: "none",
  });

  res.status(200).json({
    message: "Logged off successfully",
  });
});
/* makes a new post */
app.post(
  "/posts",
  rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 30,
    message: "You are making too many posts, try again later.",
  }),
  post,
  async (req, res) => {
    try {
      const { user_id, title, content, createdAt } = req.body;
      await db.query(
        "INSERT INTO posts (user_id, title, content, createdAt) VALUES (?, ?, ?, ?)",
        [user_id, title, content, createdAt],
      );
      res.status(200).json({ message: "Post successfully made!" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something went wrong, try again." });
    }
  },
);
/* updates a post */
app.put("/posts", update, async (req, res) => {
  try {
    const { user_id, post_id, title, content, updatedAt } = req.body;
    await db.query(
      "UPDATE posts SET title = ?, content = ?, updatedAt = ? WHERE user_id = ? AND post_id = ?",
      [title, content, updatedAt, user_id, post_id],
    );
    res.status(200).json({ message: "Post was successfully updated!" });
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went wrong, try again.");
  }
});
/* deletes a post */
app.delete("/posts/:id", deletePost, async (req, res) => {
  try {
    const post_id = req.params.id;
    await db.query("DELETE FROM posts WHERE post_id = ?", [post_id]);
    res.status(200).json({ message: "Post successfully deleted!" });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error. ");
  }
});

app.listen(PORT, () => {
  console.log("Server running in port " + PORT);
});
