import { Link, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import logoImage from "@assets/generated_images/logo.jpeg";

export default function Navbar() {
  const [isHome] = useRoute("/");

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        <Link href="/" data-testid="link-home">
          {isHome ? (
            <span className="text-2xl font-bold bg-gradient-to-r from-[#1d4ed8] to-[#60a5fa] bg-clip-text text-transparent cursor-pointer">
              Unique
            </span>
          ) : (
            <img
              src={logoImage}
              alt="Unique Logo"
              className="h-10 w-auto cursor-pointer"
            />
          )}
        </Link>

        <div className="flex items-center gap-6 text-sm sm:text-base">
          <Link href="/sobre" data-testid="link-about">
            <span className="text-white hover:text-white/80 transition-colors cursor-pointer">
              Sobre
            </span>
          </Link>
          <Link href="/contato" data-testid="link-contact">
            <span className="text-white hover:text-white/80 transition-colors cursor-pointer">
              Contato
            </span>
          </Link>
        </div>

        <Link href="/agendar">
          <Button
            className="bg-gradient-to-r from-[#1d4ed8] to-[#60a5fa] text-white font-semibold uppercase tracking-wider hover:opacity-90"
            data-testid="button-book"
          >
            Agendar
          </Button>
        </Link>
      </div>
    </nav>
  );
}
