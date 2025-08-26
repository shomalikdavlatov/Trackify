/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                brand: {
                    50: "#eef8ff",
                    100: "#d9edff",
                    200: "#bfe1ff",
                    300: "#94ceff",
                    400: "#61b2ff",
                    500: "#3a93ff",
                    600: "#2173f2",
                    700: "#1a5bcb",
                    800: "#1a4aa1",
                    900: "#1a437f",
                },
            },
        },
    },
    plugins: [],
};
