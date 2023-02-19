import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  if (command === "serve") {
    console.log(mode)
    const isDev = false // mode === "development"

    return {
      plugins: [react()],
      assetsInclude: ["src/assets", "**/*.glb"],
      server: {
        proxy: {
          "/ws": {
            target: isDev
              ? "ws://localhost:8000"
              : "wss://3d-backgammon-production.up.railway.app",
            ws: true,
            // changeOrigin: true,
          },
          "/api": {
            target: isDev
              ? "http://localhost:8000"
              : "https://3d-backgammon-production.up.railway.app",
            changeOrigin: isDev,
            secure: !isDev,
          },
        },
      },
    }
  } else {
    return defaultConfig
  }
})
