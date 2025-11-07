import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import LocationSection from "@/components/LocationSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <LocationSection />
      </main>
      <Footer />
    </div>
  );
}
