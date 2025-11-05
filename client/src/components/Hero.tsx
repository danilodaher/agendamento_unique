import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import heroImage from "@assets/generated_images/Sports_facility_hero_background_f365318a.png";

export default function Hero() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
      
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 tracking-tight leading-tight">
          Reserve Sua Quadra,<br />Evento ou Festa
        </h1>
        <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-2xl mx-auto">
          Agendamento rápido e fácil. Confirmação instantânea. Sua experiência perfeita começa aqui.
        </p>
        <Link href="/agendar">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white font-semibold uppercase tracking-wider text-lg px-12 py-6 h-auto"
            data-testid="button-hero-book"
          >
            Agendar Agora
          </Button>
        </Link>
      </div>
      
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-8 h-8 text-white/60" />
      </div>
    </div>
  );
}
