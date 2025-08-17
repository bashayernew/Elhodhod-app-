import type { Config } from "tailwindcss";
import preset from "@el-hodh0d/ui/tailwind-preset";

export default {
	content: [
		"./app/**/*.{ts,tsx}",
		"./pages/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"../../packages/ui/src/**/*.{ts,tsx}",
	],
	presets: [preset as any],
} satisfies Config;


