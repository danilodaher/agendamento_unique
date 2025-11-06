import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        <Link href="/" data-testid="link-home">
          <span className="text-2xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent cursor-pointer">
            Unique
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
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
            className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white font-semibold uppercase tracking-wider hover:opacity-90"
            data-testid="button-book"
          >
            Agendar
          </Button>
        </Link>
      </div>
    </nav>
  );
}
