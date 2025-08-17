import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
	title: "el-hodh0d",
	description: "Web app",
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en" className="dark">
			<body className="bg-background text-foreground antialiased">{children}</body>
		</html>
	);
}


