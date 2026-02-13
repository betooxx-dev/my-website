interface Stat {
	id: string;
	value: string;
	label: string;
}

const stats: Stat[] = [
	{ id: "01", value: "5+", label: "Años de experiencia" },
	{ id: "02", value: "50+", label: "Proyectos realizados" },
	{ id: "03", value: "30+", label: "Tecnologías dominadas" },
	{ id: "04", value: "∞", label: "Pasión por el código" },
];

export default function StatsSection() {
	return (
		<section className="border-t border-white/5 bg-navy-950">
			<div className="mx-auto grid max-w-6xl grid-cols-2 px-4 sm:px-6 md:grid-cols-4">
				{stats.map((stat) => (
					<div
						key={stat.id}
						className="flex flex-col gap-1 border-r border-white/5 px-6 py-8 last:border-r-0"
					>
						<span className="font-mono text-xs text-accent-500/50">
							{stat.id}
						</span>
						<span className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
							{stat.value}
						</span>
						<span className="text-sm text-navy-300">{stat.label}</span>
					</div>
				))}
			</div>
		</section>
	);
}
