import { db } from "../database.js";
import jwt from "jsonwebtoken";
import "dotenv/config";

const JWT_PASSWORD = process.env.JWT_PASSWORD;

export async function update(req, res, next) {
  try {
    const auth = req.cookies;

    if (!auth || auth.length === 0)
      return res
        .status(401)
        .json({ message: "Authorization token needed to peform this action." });

    /* if (!auth.startsWith("Bearer "))
      return res.status(401).json({ message: "Invalid token format." }); */

    const token = auth.token;
    const decoded = jwt.verify(token, JWT_PASSWORD);

    const { post_id, title, content } = req.body;

    const uuid = decoded.user_id;
    const tl = String(title || "").trim();
    const cnt = String(content || "").trim();

    if (!title || title.length === 0)
      return res.status(400).json({ message: "Invalid title." });
    if (title.length > 50)
      return res
        .status(400)
        .json({ message: "Title must be lesser than 50 characters." });
    if (!content || content.length === 0)
      return res.status(400).json({ message: "Invalid content." });
    if (!post_id || post_id.length === 0)
      return res.status(400).json({ message: "Invalid post ID." });

    const [row] = await db.query(
      "SELECT post_id FROM posts WHERE post_id = ? AND user_id = ?",
      [post_id, uuid],
    );
    if (row.length === 0)
      return res.status(404).json({
        message: "Post that you are trying to update does not exist.",
      });

    req.body.updatedAt = new Date();
    req.body.user_id = uuid;
    req.body.title = tl;
    req.body.content = cnt;

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Invalid or expired token." });
  }
}
