import formsPlugin from '@tailwindcss/forms';
import typographyPlugin from '@tailwindcss/typography';

export default {
  mode: 'jit', // Enable Just-In-Time (JIT) mode for faster build times and smaller file sizes.
  content: ['./app/**/*.{js,ts,jsx,tsx,css}'], // Specify where Tailwind should look for class names.
  darkMode: 'class', // Enable dark mode using a class rather than media queries.
  plugins: [
    formsPlugin, // Add the @tailwindcss/forms plugin for better form element styling.
    typographyPlugin, // Add the @tailwindcss/typography plugin for prose styling.
  ],
  safelist: [
    // Dynamically safelist classes to ensure they're not purged.
    {
      pattern: /^text-/, // Match any class starting with "text-".
      variants: ['hover', 'focus', 'active', 'group-hover'], // Include specific variants.
    },
  ],
  theme: {
    // Extend the default Tailwind theme.
    extend: {
      screens: {
        // Define custom breakpoints.
        xxs: '400px',
        xs: '460px',
        mxs: '560px',
        msm: '670px',
        mmd: '832px',
        mlg: '1100px',
        mxl: '1400px',
      },
      fontFamily: {
        // Add custom fonts.
        redhands: ['KGRedHands', 'kg-red-hands', 'sans-serif'],
        Montserrat: ['Montserrat', 'sans-serif'],
      },
    },
  },
};
