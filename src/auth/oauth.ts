import axios from "axios";
import { redis } from "../db/redis";
import { config } from "../config";

const TOKEN_KEY = "oauth:token";
const LOCK_KEY = "oauth:lock";

export async function getAccessToken(): Promise<string> {
  const cached = await redis.get(TOKEN_KEY);
  if (cached) return cached;

  const lock = await redis.set(LOCK_KEY, "1", "NX", "EX", 5);
  if (!lock) {
    await new Promise(r => setTimeout(r, 200));
    return (await redis.get(TOKEN_KEY)) as string;
  }

  const { data } = await axios.post(config.oauth.tokenUrl, {
    client_id: config.oauth.clientId,
    client_secret: config.oauth.clientSecret,
    grant_type: "client_credentials"
  });

  await redis.set(TOKEN_KEY, data.access_token, "EX", data.expires_in - 60);
  await redis.del(LOCK_KEY);
  return data.access_token;
}
