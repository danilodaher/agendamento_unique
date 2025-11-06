import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import LocationSection from "@/components/LocationSection";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <LocationSection />
    </div>
  );
}
