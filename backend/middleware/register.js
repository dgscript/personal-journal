import { db } from "../database.js";
import { randomUUID } from "crypto";

export async function register(req, res, next) {
  try {
    const regex = /^[a-zA-Z0-9_]{3,20}$/;
    const rUUID = randomUUID();
    const { username, password } = req.body;

    const un = String(username || "").trim();
    const pw = String(password || "").trim();

    req.body.username = un;
    req.body.password = pw;
    req.body.user_id = rUUID;

    if (pw === "")
      return res
        .status(400)
        .json({ message: "Your password cannot be blank." });

    if (un === "" || !regex.test(un))
      return res
        .status(400)
        .json({ message: "Please, enter a valid username." });

    const [checkUsername] = await db.query(
      "SELECT username FROM users WHERE username = ?",
      [un],
    );

    if (checkUsername.length > 0)
      return res.status(409).json({
        message: "Username already taken. Please, choose another one.",
      });

    if (un.length < 3 || un.length > 15)
      return res
        .status(400)
        .send({ message: "Your username must be 3-15 characters long!" });

    if (pw.length < 8 || pw.length > 16)
      return res
        .status(400)
        .json({ message: "Your password must be 8-16 characters long!" });

    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error." });
  }
}
