import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // FastAPI 백엔드와 연결 (localhost:8000 가정)
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8000", // ← FastAPI가 실행되는 포트
        changeOrigin: true,
        secure: false,
      },
    },
  },

  // 빌드할 때 static 폴더로 출력
  build: {
    outDir: "../static", // ← 중요! FastAPI의 static 폴더로 빌드됨
    emptyOutDir: true,
  },

  optimizeDeps: {
    include: ["react-grid-layout/legacy", "react-resizable"],
  },
});
