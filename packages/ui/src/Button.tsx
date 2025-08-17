import * as React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
	variant?: "primary" | "secondary";
};

export function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
	const base =
		"inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:pointer-events-none";
	const styles =
		variant === "primary"
			? "bg-violet-600 text-white hover:bg-violet-500"
			: "bg-zinc-800 text-zinc-100 hover:bg-zinc-700";
	return <button className={`${base} ${styles} ${className}`} {...props} />;
}


