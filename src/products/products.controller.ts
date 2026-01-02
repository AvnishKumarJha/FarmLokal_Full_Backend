import { Request, Response } from "express";
import { db } from "../db/mysql";
import { redis } from "../db/redis";

export async function listProducts(req: Request, res: Response) {
  const limit = Number(req.query.limit) || 20;
  const cursor = Number(req.query.cursor) || 0;

  const cacheKey = `products:${cursor}:${limit}`;
  const cached = await redis.get(cacheKey);
  if (cached) return res.json(JSON.parse(cached));

  const [rows] = await db.query(
    "SELECT id, name, price FROM products WHERE id > ? ORDER BY id LIMIT ?",
    [cursor, limit]
  );

  await redis.set(cacheKey, JSON.stringify(rows), "EX", 30);
  res.json(rows);
}
