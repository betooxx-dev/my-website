import BlogPreviewSection from "@/components/features/home/BlogPreviewSection";
import ContactSection from "@/components/features/home/ContactSection";
import ExperienceSection from "@/components/features/home/ExperienceSection";
import HeroSection from "@/components/features/home/HeroSection";
import ProjectsSection from "@/components/features/home/ProjectsSection";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <ExperienceSection />
        <ProjectsSection />
        <BlogPreviewSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
