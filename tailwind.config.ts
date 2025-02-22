import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      padding: {
        "extra-sm": "6px", // Exemplo: Pequeno
        "extra-lg": "48px", // Exemplo: Grande
        "98": "500px", // Exemplo: Personalizado
        "100":"600px",
      },
    },
  },
  plugins: [],
} satisfies Config;
