import AboutSection from "@/components/features/home/AboutSection";
import BlogPreviewSection from "@/components/features/home/BlogPreviewSection";
import ContactSection from "@/components/features/home/ContactSection";
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
        <AboutSection />
        <ProjectsSection />
        <BlogPreviewSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
