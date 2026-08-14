import "dotenv/config";
import { createApp } from "./app";

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
const app = createApp();
app.listen(PORT, () => {
  console.log(`Market Place API Server is running on port ${PORT}`);
});