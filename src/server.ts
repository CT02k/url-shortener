import { createApp } from "./app";
import { env } from "./lib/config";

const app = createApp();

app.listen(env.PORT, () => {
  console.log(`📡 Server running at http://localhost:${env.PORT}`);
  console.log(`📘 Swagger docs at http://localhost:${env.PORT}/docs`);
});
