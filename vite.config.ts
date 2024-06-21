import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import typescript from "@rollup/plugin-typescript";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    typescript({
      tsconfig: "./tsconfig.json",
      declaration: true,
      declarationDir: resolve(__dirname, "dist/types"),
      rootDir: resolve(__dirname, "src"),
      tslib: resolve("tslib"),
    }),
  ],
  build: {
    target: "es2015", // 默认值是 'modules'，也就是使用 ES Modules 的形式来构建代码
    lib: {
      entry: resolve(__dirname, "./src/components/Video/index.ts"),
      name: "Video",
      fileName: (format) => `video.${format}.js`,
    },
    rollupOptions: {
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          vue: "Vue",
        },
      },
    },
    // 打包存放地址，相对于当前目录的路径
    outDir: "dist",
    // 静态资源目录
    assetsDir: "public",
  },
  server: {
    host: "192.168.0.1",
  },
});
