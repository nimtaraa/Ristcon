import Navigation from "../components/Navigation";
import HeroSection from "@/components/Home/HeroSection";
import StatsSection from "@/components/Home/StatSection";
import ServicesSection from "@/components/Home/ServicesSection";
import TestimonialsSection from "@/components/Home/TestimonialsSection"; 
import TimelineSection from "@/components/Home/timelinesection";
import DownloadsSection from "@/components/DownloadsSection";
const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-16">
        <HeroSection />
        <StatsSection />
        <ServicesSection />
        <TimelineSection/>
        <DownloadsSection />
        <TestimonialsSection />
      </main>

    </div>
  );
};

export default Index;