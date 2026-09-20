import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Cormorant Garamond"', "serif"],
        sans: ['"Manrope"', "sans-serif"],
      },
      boxShadow: {
        card: "0 18px 40px -24px rgba(62, 42, 29, 0.28)",
      },
      backgroundImage: {
        "greek-key":
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='10' viewBox='0 0 48 10'%3E%3Cpath d='M0 0h10v10H0V0zm10 0h10v10H10V0zm10 0h10v10h-10V0zm10 0h10v10h-10V0' fill='none' stroke='%23DAB383' stroke-width='1.1'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
} satisfies Config;
