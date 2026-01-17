import { defineConfig } from "vite";
import variables from "./globalVariables";

export default defineConfig({
  server: {
    proxy: {
      "/api": `http://localhost:${variables.PORT}`
    },
    host: true,
    port: 5173,
    strictPort: true
  }
});
