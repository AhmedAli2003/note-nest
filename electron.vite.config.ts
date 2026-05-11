import { resolve, join } from "path"
import { cpSync, existsSync } from "fs"
import { defineConfig, externalizeDepsPlugin } from "electron-vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  main: {
    resolve: {
      alias: {
        "@shared": resolve("src/shared")
      }
    },
    plugins: [
      externalizeDepsPlugin(),
      {
        name: "copy-migrations",
        closeBundle() {
          const src = resolve("src/main/db/migrations")
          const dst = resolve("out/main/migrations")
          if (existsSync(src)) {
            cpSync(src, dst, { recursive: true })
          }
        }
      }
    ]
  },
  preload: {
    resolve: {
      alias: {
        "@shared": resolve("src/shared")
      }
    },
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        "@": resolve("src/renderer/src"),
        "@shared": resolve("src/shared")
      }
    },
    plugins: [react()]
  }
})
