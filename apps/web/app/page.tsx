"use client";
import { Button } from "@el-hodh0d/ui";
import { useProviders } from "@hodhod/data";

export default function Page() {
	const { data: providers } = useProviders();
	return (
		<main className="min-h-screen grid place-items-center">
			<div className="text-center space-y-6">
				<h1 className="text-3xl font-semibold">el-hodh0d Web</h1>
				<p className="opacity-80">Next.js 14 App Router + Tailwind</p>
				<p className="opacity-60">Providers: {providers?.length ?? 0}</p>
				<Button>Shared UI Button</Button>
			</div>
		</main>
	);
}


