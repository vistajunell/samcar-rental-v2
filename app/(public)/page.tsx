import HeroSection from "@/components/sections/HeroSection";
import BookingRequestBar from "@/components/sections/BookingRequestBar";
import FeaturedCars from "@/components/sections/FeaturedCars";
import HowItWorks from "@/components/sections/HowItWorks";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import ContactSection from "@/components/sections/ContactSection";
import { getCarsForCarousel } from "@/lib/queries/cars";

export default async function HomePage() {
  const cars = await getCarsForCarousel();

  return (
    <main>
      <HeroSection cars={cars} />
      <BookingRequestBar />
      <FeaturedCars cars={cars.slice(0, 6)} />
      <HowItWorks />
      <WhyChooseUs />
      <ContactSection />
    </main>
  );
}
