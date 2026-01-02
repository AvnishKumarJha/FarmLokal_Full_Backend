import axios from "axios";
import { redis } from "../db/redis";
import { config } from "../config";

const TOKEN_KEY = "oauth:token";
const LOCK_KEY = "oauth:lock";

export async function getAccessToken(): Promise<string> {
  const cached = await redis.get(TOKEN_KEY);
  if (cached) return cached;

  const lock = await redis.setex(LOCK_KEY, 5, "1");
  if (!lock) {
    await new Promise(r => setTimeout(r, 200));
    return (await redis.get(TOKEN_KEY)) as string;
  }

  const { data } = await axios.post(config.oauth.tokenUrl, {
    client_id: config.oauth.clientId,
    client_secret: config.oauth.clientSecret,
    grant_type: "client_credentials"
  });

  await redis.setex(
    TOKEN_KEY,
    data.expires_in - 60,
    data.access_token
  );

  await redis.del(LOCK_KEY);
  return data.access_token;
}
