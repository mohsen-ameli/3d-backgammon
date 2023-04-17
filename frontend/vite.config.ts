import react from "@vitejs/plugin-react-swc"
import { defineConfig } from "vite"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  assetsInclude: ["src/assets", "**/*.hdr", "**/*.glb", "**/*.svg"],
  build: { chunkSizeWarningLimit: 3500 },
})
