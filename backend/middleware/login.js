import jwt from "jsonwebtoken";
import { db } from "../database.js";
import "dotenv/config";

const JWT_PASSWORD = process.env.JWT_PASSWORD;

export async function login(req, res, next) {
  try {
    const { username, password } = req.body;

    const un = String(username || "").trim();
    const pw = String(password || "").trim();

    if (pw === "")
      return res
        .status(400)
        .json({ message: "Your password cannot be blank." });
    if (un === "")
      return res
        .status(400)
        .json({ message: "Please, enter a valid username." });

    const [user] = await db.query(
      "SELECT user_id FROM users WHERE username = ? AND password = ?",
      [un, pw],
    );

    if (user.length === 0)
      return res.status(401).send({ message: "Wrong username or password." });

    const token = jwt.sign({ user_id: user[0].user_id }, JWT_PASSWORD);

    req.token = token;
    req.body.user_id = user[0].user_id;

    next();
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error.");
  }
}
