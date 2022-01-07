// tailwind.config.js
const colors = require('tailwindcss/colors');
module.exports = {
    darkMode: 'media',
    content: [
        'src/index.html',
    ],
    safelist: [
        'text-2xl',
        'text-3xl',
        {
            pattern:
                /(bg|text)-(red|green|yellow|gray|blue)-(100|200|300|400|500|600|700|800|900)/,
        },
    ],

    theme: {
        extend: {
            colors: {
                'blue-tb1': '#3fa4dc',
                'blue-tb2': '#2c2c79',
            },
            height: {
                112: '33rem',
                'screen-60': '60vh',
            },
            width: {
                100: '28rem',
            },
            fontSize: {
                xsm: '.50rem',
            },
        },
    },

    plugins: [require('@tailwindcss/forms')],
};
