import Hero from "@/components/sections/Hero";
import FeaturedCars from "@/components/sections/FeaturedCars";
import Brands from "@/components/sections/Brands";
import HowItWorks from "@/components/sections/HowItWorks";
import Testimonials from "@/components/sections/Testimonials";
import CTASection from "@/components/sections/CTASection";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedCars />
      <Brands />
      <HowItWorks />
      <Testimonials />
      <CTASection />
    </>
  );
}
