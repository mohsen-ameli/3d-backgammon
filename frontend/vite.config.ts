import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  assetsInclude: ["src/assets", "**/*.hdr", "**/*.glb"],
  build: { chunkSizeWarningLimit: 3500 },
})
