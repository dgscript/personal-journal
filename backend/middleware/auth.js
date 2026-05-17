import jwt from "jsonwebtoken";
import "dotenv/config";

const JWT_PASSWORD = process.env.JWT_PASSWORD;

export function authMiddleware(req, res, next) {
  try {
    const auth = req.cookies;

    if (!auth || auth.length === 0)
      return res
        .status(401)
        .json({ message: "Authorization token needed to peform this action." });

    /* if (!auth.startsWith("Bearer "))
      return res.status(401).json({ message: "Invalid token format." }); */

    const token = auth.token;
    const decoded = jwt.verify(token, process.env.JWT_PASSWORD);

    req.user = decoded;

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Invalid or expired token." });
  }
}
