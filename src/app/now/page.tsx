import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Now | betooxx",
	description: "Lo que estoy haciendo ahora mismo.",
};

export default function NowPage() {
	return (
		<main className="flex min-h-screen items-center justify-center bg-navy-950">
			<div className="text-center">
				<h1 className="font-heading text-4xl font-bold text-white">Now</h1>
				<p className="mt-4 text-navy-300">Próximamente...</p>
			</div>
		</main>
	);
}
