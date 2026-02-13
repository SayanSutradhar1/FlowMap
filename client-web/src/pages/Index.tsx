import AnalyticsPreview from "@/components/Landing/AnalyticsPreview";
import FeaturesSection from "@/components/Landing/FeaturesSection";
import HeroSection from "@/components/Landing/HeroSection";
import Footer from "@/components/Shared/Footer";

const Index = () => {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <HeroSection />
      <FeaturesSection />
      <AnalyticsPreview />
      <Footer />
    </main>
  );
};

export default Index;
