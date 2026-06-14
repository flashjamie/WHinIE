/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{ts,tsx}', './App.tsx'],
  theme: {
    extend: {
      fontFamily: {
        // English / numbers — Itim (Google Fonts) with Cre Happiness alias
        en:  ["'Itim'", "'Cre Happiness'", 'cursive'],
        // Traditional Chinese — Noto Sans TC only; PMingLiU / MingLiU intentionally excluded
        zh:  [
          "'Noto Sans TC'",
          "'Microsoft JhengHei UI'",
          "'Microsoft JhengHei'",
          "'PingFang TC'",
          "'Heiti TC'",
          'sans-serif',
        ],
        // Composite default: Latin via Itim, CJK falls through to zh stack
        sans: [
          "'Itim'",
          "'Noto Sans TC'",
          "'Microsoft JhengHei UI'",
          "'PingFang TC'",
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
};
