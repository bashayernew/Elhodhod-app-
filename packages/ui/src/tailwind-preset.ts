import type { Config } from "tailwindcss";

const preset: Partial<Config> = {
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

export default preset;


