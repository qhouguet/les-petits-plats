/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./**/*.{html,js}'],
    theme: {
        extend: {
            boxShadow: {
                custom: '0 4px 34px 30px rgba(0, 0, 0, 0.04)',
            },
            colors: {
                yellow: {
                    custom: '#FFD15B',
                },
                gray: {
                    custom: '#7A7A7A',
                    light: '#EDEDED',
                },
            },
            height: {
                600: '600px',
            },
            maxWidth: {
                'screen-1440': '1440px',
            },
            fontFamily: {
                anton: ['Anton', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
