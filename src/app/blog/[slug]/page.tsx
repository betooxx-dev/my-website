interface BlogPostPageProps {
	params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
	const { slug } = await params;

	return (
		<main className="flex min-h-screen items-center justify-center bg-navy-950">
			<div className="text-center">
				<h1 className="font-heading text-4xl font-bold text-white">
					{slug}
				</h1>
				<p className="mt-4 text-navy-300">Contenido del artículo próximamente...</p>
			</div>
		</main>
	);
}
