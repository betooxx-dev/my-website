import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/features/home/HeroSection";
import StatsSection from "@/components/features/home/StatsSection";

export default function Home() {
	return (
		<>
			<Navbar />
			<main>
				<HeroSection />
				<StatsSection />
			</main>
		</>
	);
}
