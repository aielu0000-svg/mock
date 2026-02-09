import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        fg: "var(--fg)",
        muted: "var(--muted)",
        "muted-fg": "var(--muted-fg)",
        border: "var(--border)",
        primary: "var(--primary)",
        "primary-fg": "var(--primary-fg)",
        danger: "var(--danger)",
        warn: "var(--warn)",
        "warn-bg": "var(--warn-bg)"
      },
      borderRadius: {
        lg: "var(--radius-lg)",
        md: "var(--radius-md)"
      }
    }
  },
  plugins: []
} satisfies Config;
