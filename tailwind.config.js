/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            screens: {
              'xs': '500px', // Đặt kích thước cho breakpoint XS tại 500px hoặc bất kỳ kích thước nào bạn muốn
            }
          },boxShadow: {
            'custom': '15px 15px 16.83px 10px rgba(0, 0, 0, 0.1)',
          },
    },
    variants: {
        extend: {
            display: ['group-focus'],
            opacity: ['group-focus'],
            inset: ['group-focus'],
        },
    },
    plugins: [],
};
