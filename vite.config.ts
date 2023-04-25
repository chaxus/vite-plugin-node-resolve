import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import nodeResolve from "./index";

export default defineConfig({
  build: {
    sourcemap: true,
    lib: {
      entry: "./index.ts",
      name: "vite-plugin-node-resolve",
      fileName: "index",
      formats: ["es", "umd"],
    },
  },
  plugins: [dts(), nodeResolve()],
});
