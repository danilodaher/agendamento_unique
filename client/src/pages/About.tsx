import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, Shield, Sparkles } from "lucide-react";
import quadraNoiteImage from "@assets/generated_images/quadra-noite.jpeg";
import espacoTudoVideo from "@assets/generated_images/espaco-tudo.mp4";

export default function About() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-[#1d4ed8] to-[#60a5fa] bg-clip-text text-transparent">
              Sobre a Unique
            </h1>
            <p className="text-xl text-muted-foreground">
              Transformando a forma como você agenda espaços esportivos
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <Card>
              <CardContent className="p-6 space-y-3">
                <Calendar className="w-10 h-10 text-primary" />
                <h3 className="text-xl font-semibold">Reservas Fáceis</h3>
                <p className="text-muted-foreground">
                  Sistema intuitivo para agendar quadras, eventos e festas em
                  poucos cliques.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 space-y-3">
                <Clock className="w-10 h-10 text-primary" />
                <h3 className="text-xl font-semibold">
                  Confirmação Instantânea
                </h3>
                <p className="text-muted-foreground">
                  Receba confirmação imediata com todos os detalhes da sua
                  reserva.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 space-y-3">
                <Sparkles className="w-10 h-10 text-primary" />
                <h3 className="text-xl font-semibold">Experiência Premium</h3>
                <p className="text-muted-foreground">
                  Instalações modernas e bem cuidadas para sua melhor
                  experiência.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="p-8 space-y-6">
              <h2 className="text-2xl font-bold">Nossa Estrutura</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Oferecemos quadras de alta qualidade, espaços para eventos e
                  festas, sempre com a melhor infraestrutura para garantir
                  momentos inesquecíveis.
                </p>
                <p>
                  Junte-se a milhares de clientes satisfeitos que escolhem a
                  Unique para suas atividades esportivas e eventos especiais.
                </p>
              </div>

              <figure className="rounded-xl overflow-hidden shadow-sm">
                <img
                  src={quadraNoiteImage}
                  alt="Quadra durante a noite"
                  className="w-full h-full object-cover"
                />
                <figcaption className="mt-2 text-sm text-muted-foreground">
                  Quadra iluminada e pronta para jogos noturnos com total
                  segurança.
                </figcaption>
              </figure>

              <div>
                <h3 className="text-xl font-semibold mb-3">Tour pelo espaço</h3>
                <video
                  className="w-full rounded-xl shadow-sm"
                  src={espacoTudoVideo}
                  controls
                  poster={quadraNoiteImage}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
