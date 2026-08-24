import defaultTheme from 'tailwindcss/defaultTheme';

export default {
    // - Ye paths batate hain ke Tailwind kahan kahan CSS classes ko scan karega
    content: [
        "./index.html",
        "./src/**/*.{js,jsx,ts,tsx}",
    ],

    theme: {
        extend: {
            // - Custom fonts configuration jo default fonts ke sath fallback bhi provide karti hai
            fontFamily: {
                display: ['Cormorant Garamond', ...defaultTheme.fontFamily.serif],
                body: ['Inter', ...defaultTheme.fontFamily.sans],
                mono: ['DM Mono', ...defaultTheme.fontFamily.mono],
                script: ['Allura', 'cursive'],
            },
        },
    },

    plugins: [],
};