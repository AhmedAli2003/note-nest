import type { Config } from "tailwindcss"

export default {
  content: [
    "./src/renderer/index.html",
    "./src/renderer/src/**/*.{ts,tsx}"
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        priority: {
          high: "#ef4444",
          medium: "#f59e0b",
          low: "#3b82f6"
        }
      }
    }
  },
  plugins: []
} satisfies Config
