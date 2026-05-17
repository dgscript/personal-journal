import jwt from "jsonwebtoken";
import "dotenv/config";

const JWT_PASSWORD = process.env.JWT_PASSWORD;

export function authMiddleware(req, res, next) {
  try {
    const token = req.cookies.token;

    if (!token)
      return res
        .status(401)
        .json({
          message: "Authorization token needed to perform this action.",
        });

    const decoded = jwt.verify(token, process.env.JWT_PASSWORD);

    req.user = decoded;

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Invalid or expired token." });
  }
}
