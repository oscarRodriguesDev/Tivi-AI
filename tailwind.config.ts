import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        tivi: {
          primary: "#2A8C4A", // Verde escuro - título e ícones
          secondary: "#64C27B", // Verde médio - problemas
          tertiary: "#9BFAB0", // Verde claro - soluções
          light: "#D0FDD7", // Verde muito claro - uso geral
          white: "#FFFFFF", // Branco
        },
        military: {
          50: "#f5f6f0",
          100: "#e6e9d9",
          200: "#d0d6bb",
          300: "#b3bd95",
          400: "#96a36f",
          500: "#778a4d",
          600: "#5d6e3c",
          700: "#4b5320",
          800: "#3d461e",
          900: "#333d14",
          950: "#1a2009",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      padding: {
        "extra-sm": "6px", // Exemplo: Pequeno
        "extra-lg": "48px", // Exemplo: Grande
        "98": "500px", // Exemplo: Personalizado
        "100":"600px",
      },
      spacing: {//meus valores de margin left
        'ml-perc-1': '10%',
        'ml-perc-2': '15%',
        'ml-perc-3': '30%',
        'ml-perc-4': '40%',
        'ml-perc-5': '50%',
        'ml-perc-6': '80%',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
