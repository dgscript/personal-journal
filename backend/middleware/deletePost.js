import jwt from "jsonwebtoken";
import { db } from "../database.js";
import "dotenv/config";

const JWT_PASSWORD = process.env.JWT_PASSWORD;

export async function deletePost(req, res, next) {
  try {
    const auth = req.cookies;

    if (!auth || auth === "")
      return res.status(401).json({
        message: "Authorization token needed to perform this action.",
      });

    /* if (!auth.startsWith("Bearer "))
      return res.status(401).json({ message: "Invalid token format." }); */

    const token = auth.token;
    const decoded = jwt.verify(token, JWT_PASSWORD);
    const post_id = req.params.id;

    if (!post_id || post_id === "")
      return res.status(400).json({ message: "Invalid post ID." });

    const [post] = await db.query(
      "SELECT post_id FROM posts WHERE post_id = ? AND user_id = ?",
      [post_id, decoded.user_id],
    );

    if (post.length === 0)
      return res
        .status(403)
        .json({ message: "Reference error. Unable to perform this action." });

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token." });
    console.log(error);
  }
}
