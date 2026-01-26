import AnalyticsPreview from "@/components/Landing/AnalyticsPreview";
import CTASection from "@/components/Landing/CTASection";
import FeaturesSection from "@/components/Landing/FeaturesSection";
import HeroSection from "@/components/Landing/HeroSection";

const Index = () => {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <HeroSection />
      <FeaturesSection />
      <AnalyticsPreview />
      <CTASection />
    </main>
  );
};

export default Index;
