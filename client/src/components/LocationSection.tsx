import { MapPin, Phone, Mail, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const reviewLink =
  "https://www.google.com/maps/place/Unique+Araguari/@-18.6594626,-48.2072234,17z/data=!3m1!4b1!4m8!3m7!1s0x94aef476d72eab8b:0x8a37f1df59fe2f0d!8m2!3d-18.6594626!4d-48.2050347!9m1!1b1!16s%2Fg%2F11f7z6x7qv?entry=ttu";

export default function LocationSection() {
  const address =
    "R. Severino Alves Cardoso, 655 - Goiás, Araguari - MG, 38442-188, Brasil";
  const encodedAddress = encodeURIComponent(address);
  const googleMapsUrl = `https://www.google.com/maps/embed/v1/place?key=${
    import.meta.env.VITE_GOOGLE_MAPS_API_KEY ||
    "AIzaSyBFw0Qbyq9zTFTd-tUY6d_s6ng4bUUgEzg"
  }&q=${encodedAddress}`;
  const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;

  return (
    <section id="location" className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#1d4ed8] to-[#60a5fa] bg-clip-text text-transparent">
            Nossa Localização
          </h2>
          <p className="text-xl text-muted-foreground">Venha nos visitar</p>
        </div>

        <div className="grid md:grid-cols-[3fr,2fr] gap-8">
          <Card>
            <CardContent className="p-0">
              <div className="w-full h-[400px] rounded-lg overflow-hidden">
                <iframe
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={googleMapsUrl}
                  title="Localização Unique"
                />
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-base font-semibold mb-1">Endereço</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {address}
                    </p>
                    <a
                      href={googleMapsLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline text-sm"
                    >
                      Abrir no Google Maps →
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <Phone className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-base font-semibold mb-1">Telefone</h3>
                    <a
                      href="tel:+5534999999999"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      (34)99323-5000
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <Mail className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-base font-semibold mb-1">Email</h3>
                    <a
                      href="mailto:uniquearaguari@gmail.com"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      uniquearaguari@gmail.com
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <Star className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <div className="space-y-3">
                    <h3 className="text-base font-semibold">
                      Avalie sua experiência
                    </h3>
                    <a
                      href={reviewLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-[#1d4ed8] to-[#60a5fa] px-6 py-2 text-sm font-semibold text-white hover:opacity-90 transition-colors"
                    >
                      Avaliar no Google Maps
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
