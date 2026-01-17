import HeroSection from "../sections/HeroSection";
import FeaturesSection from "../sections/FeaturesSection";
import PricingSection from "../sections/PricingSection";

export default function HomePage() {
    return (
        <main className="min-h-screen bg-black overflow-x-hidden selection:bg-pink-500/30">
            <HeroSection />
            <FeaturesSection />
            <PricingSection />
        </main>
    );
}