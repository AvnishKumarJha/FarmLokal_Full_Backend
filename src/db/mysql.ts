import mysql from "mysql2/promise";
import { config } from "../config";

export const db = mysql.createPool({
  ...config.mysql,
  waitForConnections: true,
  connectionLimit: 20
});
