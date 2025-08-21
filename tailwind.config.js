import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';

export default {
  content: ["./index.html", "./src/**/*.{js,ts}"],
  theme: {
    container: { center: true, padding: "1rem", screens: { "2xl": "1200px" } },
    extend: {
      colors: {
        brand: {
          green: "#008000",
          olive: "#4A7B2D",
          paper: "#F6F7F8",
          ink: "#1B1B1F",
          border: "#E5E7EB"
        }
      },
      fontFamily: {
        sans: ['"Source Sans 3"', "ui-sans-serif", "system-ui", "Segoe UI", "Roboto", "Arial", "sans-serif"]
      },
      boxShadow: { soft: "0 1px 2px rgba(0,0,0,.04), 0 6px 20px rgba(0,0,0,.06)" }
    }
  },
  plugins: [forms, typography],
};
