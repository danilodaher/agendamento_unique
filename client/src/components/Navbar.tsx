import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        <Link href="/">
          <a className="text-2xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent hover-elevate active-elevate-2" data-testid="link-home">
            Unique
          </a>
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          <Link href="/sobre">
            <a className="text-foreground hover:text-primary transition-colors" data-testid="link-about">
              Sobre
            </a>
          </Link>
          <Link href="/contato">
            <a className="text-foreground hover:text-primary transition-colors" data-testid="link-contact">
              Contato
            </a>
          </Link>
        </div>
        
        <Link href="/agendar">
          <Button className="bg-gradient-to-r from-[#667eea] to-[#764ba2] font-semibold uppercase tracking-wider" data-testid="button-book">
            Agendar
          </Button>
        </Link>
      </div>
    </nav>
  );
}
