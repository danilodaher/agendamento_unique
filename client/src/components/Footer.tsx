import { MapPin, Phone, Instagram } from "lucide-react";
import { Link } from "wouter";
import logoImage from "@assets/generated_images/logo.jpeg";

const instagramUrl = "https://www.instagram.com/uniquearaguari/";
const phoneNumber = "(34) 99323-5000";
const phoneLink = "https://wa.me/5534993235000";
const addressText =
  "R. Severino Alves Cardoso, 655 - Goiás, Araguari - MG, 38442-188";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col gap-6 text-sm text-muted-foreground">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
          <div className="flex items-center gap-3">
            <Link href="/">
              <img
                src={logoImage}
                alt="Unique Logo"
                className="h-10 w-auto cursor-pointer"
              />
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-sm text-foreground">
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-primary transition-colors"
            >
              <Instagram className="h-4 w-4" />
              @uniquearaguari
            </a>
            <a
              href={phoneLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-primary transition-colors"
            >
              <Phone className="h-4 w-4" />
              {phoneNumber}
            </a>
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {addressText}
            </span>
          </div>
        </div>

        <div className="text-center text-xs text-muted-foreground/80">
          Copyright © 2025 Unique. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

