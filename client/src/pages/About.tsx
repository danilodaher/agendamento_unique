import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, Shield, Sparkles } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
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
                  Sistema intuitivo para agendar quadras, eventos e festas em poucos cliques.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 space-y-3">
                <Clock className="w-10 h-10 text-primary" />
                <h3 className="text-xl font-semibold">Confirmação Instantânea</h3>
                <p className="text-muted-foreground">
                  Receba confirmação imediata com todos os detalhes da sua reserva.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 space-y-3">
                <Shield className="w-10 h-10 text-primary" />
                <h3 className="text-xl font-semibold">100% Seguro</h3>
                <p className="text-muted-foreground">
                  Seus dados protegidos com a melhor tecnologia de segurança.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 space-y-3">
                <Sparkles className="w-10 h-10 text-primary" />
                <h3 className="text-xl font-semibold">Experiência Premium</h3>
                <p className="text-muted-foreground">
                  Instalações modernas e bem cuidadas para sua melhor experiência.
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Nossa História</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  A Unique nasceu com o objetivo de tornar a reserva de espaços esportivos 
                  mais simples e acessível para todos. Combinamos tecnologia de ponta com 
                  atendimento personalizado.
                </p>
                <p>
                  Oferecemos quadras de alta qualidade, espaços para eventos e festas, 
                  sempre com a melhor infraestrutura para garantir momentos inesquecíveis.
                </p>
                <p>
                  Junte-se a milhares de clientes satisfeitos que escolhem a Unique para 
                  suas atividades esportivas e eventos especiais.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
