import "dotenv/config";
import express from "express";
import { config } from "./config";
import { listProducts } from "./products/products.controller";
import { webhookHandler } from "./external/webhook";
import { rateLimiter } from "./rateLimit/redisRateLimit";
import { errorHandler } from "./middlewares/error";

const app = express();
app.use(express.json());
app.use(rateLimiter);

app.get("/products", listProducts);
app.post("/webhook", webhookHandler);
app.get("/metrics", (req, res) => res.send("metrics_placeholder"));

app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`FarmLokal backend running on port ${config.port}`);
});
