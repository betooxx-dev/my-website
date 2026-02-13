import Link from "next/link";

const navLinks = [
	{ href: "/", label: "Inicio" },
	{ href: "/blog", label: "Blog" },
	{ href: "/now", label: "Now" },
] as const;

export default function Navbar() {
	return (
		<header className="fixed inset-x-0 top-0 z-50 px-4 pt-3 sm:px-6 sm:pt-4">
			<nav className="mx-auto flex w-full items-center justify-between rounded-full bg-navy-950/50 px-4 py-2.5 backdrop-blur-xl sm:px-6 sm:py-3">
				{/* Logo */}
				<Link
					href="/"
					className="text-xl font-bold tracking-tight text-white transition-opacity hover:opacity-80"
				>
					<span className="text-accent-400">b</span>etooxx
				</Link>

				{/* Navigation Links */}
				<div className="hidden items-center gap-8 sm:flex">
					{navLinks.map((link) => (
						<Link
							key={link.href}
							href={link.href}
							className="text-base font-medium text-white/70 transition-colors hover:text-white"
						>
							{link.label}
						</Link>
					))}
				</div>

				{/* CTA Button */}
				<Link
					href="mailto:contacto@betooxx.dev"
					className="text-base font-medium text-white/70 transition-colors hover:text-white"
				>
					Contacto
				</Link>
			</nav>
		</header>
	);
}
