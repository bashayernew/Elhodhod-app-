/** Tailwind preset shared across apps (JS for Node compatibility) */
/** @type {import('tailwindcss').Config} */
module.exports = {
	theme: {
		extend: {
			colors: {
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				border: "hsl(var(--foreground) / 0.12)",
			},
			borderRadius: {
				DEFAULT: "var(--radius)",
			},
		},
	},
};


