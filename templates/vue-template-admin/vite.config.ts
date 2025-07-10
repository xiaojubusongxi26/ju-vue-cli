import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import VueDevTools from "vite-plugin-vue-devtools";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";

export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@use "@/style/variables.scss";',
      },
    },
  },
  plugins: [
    vue(),
    VueDevTools(),
    createSvgIconsPlugin({
      // 指定 SVG图标 保存的文件夹路径
      iconDirs: [resolve(process.cwd(), "src/icons/svg")],
      // 指定 使用svg图标的格式
      symbolId: "[name]",
    }),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  base: "./",
  server: {
    port: 6001,
    cors: true,
    host: "0.0.0.0",
    proxy: {
      "/api": {
        target: "http://127.0.0.1/api", // 测试
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
