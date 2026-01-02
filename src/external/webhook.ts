import { Request, Response } from "express";
import { redis } from "../db/redis";

export async function webhookHandler(req: Request, res: Response) {
  const eventId = req.headers["x-event-id"] as string;
  if (!eventId) return res.status(400).send("Missing event id");

  const exists = await redis.get(`event:${eventId}`);
  if (exists) return res.status(200).send("Duplicate");

  await redis.set(`event:${eventId}`, "1", "EX", 3600);
  res.status(200).send("OK");
}
