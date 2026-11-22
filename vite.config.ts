import { defineConfig } from "vite";

export default defineConfig({
  // GitHub Pages serves this project from /Scrap-KingdomA/.
  base: "/Scrap-KingdomA/",
  server: { host: "0.0.0.0" },
  build: { target: "es2022" }
});
