const defaultTheme = require("tailwindcss/defaultTheme");
module.exports = {
    purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            fontFamily: {
                sans: ["Roboto", ...defaultTheme.fontFamily.sans],
            },
            colors: {
                brand: {
                    primary: "#6188FF",
                    secondary: "#292D3F",
                },
            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [
        // require("@tailwindcss/forms")
    ],
};
