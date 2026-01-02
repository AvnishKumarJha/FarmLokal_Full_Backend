import axios from "axios";

export async function fetchApiA() {
  let attempts = 0;
  while (attempts < 3) {
    try {
      return await axios.get("https://jsonplaceholder.typicode.com/posts", { timeout: 3000 });
    } catch {
      attempts++;
      await new Promise(r => setTimeout(r, attempts * 200));
    }
  }
  throw new Error("API A failed");
}
