import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import heroImage from "@assets/generated_images/quadra.jpeg";

export default function Hero() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <img
        src={heroImage}
        alt="Quadra Unique"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ objectPosition: "center 40%" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 tracking-tight leading-tight">
          Faça sua reserva
        </h1>
        <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-2xl mx-auto">
          Agendamento rápido e fácil. Confirmação instantânea. Sua experiência
          perfeita começa aqui.
        </p>
        <Link href="/agendar" data-testid="button-hero-book">
          <Button
            size="lg"
            className="bg-gradient-to-r from-[#1d4ed8] to-[#60a5fa] text-white font-semibold uppercase tracking-wider text-lg px-12 py-6 h-auto"
          >
            Agendar Agora
          </Button>
        </Link>
      </div>

      <a
        href="#location"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-white/60 hover:text-white transition-colors"
        aria-label="Ir para a seção de localização"
      >
        <ChevronDown className="w-8 h-8" />
      </a>
    </div>
  );
}
