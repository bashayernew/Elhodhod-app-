import "./globals.css";
import type { ReactNode } from "react";
import ClientProviders from "../src/providers/ClientProviders";

export const metadata = {
	title: "el-hodh0d",
	description: "Web app",
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en" className="dark">
			<body className="bg-background text-foreground antialiased">
				<ClientProviders>{children}</ClientProviders>
			</body>
		</html>
	);
}


