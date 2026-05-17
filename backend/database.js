import mysql from "mysql2/promise";
import fs from "fs";
import "dotenv/config";

export const db = await mysql.createConnection({
  host: process.env.HOST,
  port: process.env.PORT,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  ssl: {
    ca: fs.readFileSync("./ca.pem"),
  },
});
