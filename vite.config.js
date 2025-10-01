import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "react-toastify",
      "@mui/material",
      "@mui/icons-material",
      "lottie-react",
    ],
  },
  server: {
    port: 5173,
    open: true,
    sourcemapIgnoreList: () => true, // bu yerga birlashtiriladi
  },
  build: {
    sourcemap: false, // prod uchun sourcemap o‘chiradi
  },
});
