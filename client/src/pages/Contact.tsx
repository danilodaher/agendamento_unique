import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useState } from "react";

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contact form submitted:', { name, email, message });
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-[#1d4ed8] to-[#60a5fa] bg-clip-text text-transparent">
              Entre em Contato
            </h1>
            <p className="text-xl text-muted-foreground">
              Estamos aqui para ajudar com qualquer dúvida
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <Card>
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-6">Envie uma Mensagem</h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <Label htmlFor="contact-name">Nome</Label>
                      <Input
                        id="contact-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Seu nome"
                        data-testid="input-contact-name"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="contact-email">Email</Label>
                      <Input
                        id="contact-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="seu@email.com"
                        data-testid="input-contact-email"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="contact-message">Mensagem</Label>
                      <Textarea
                        id="contact-message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Como podemos ajudar?"
                        rows={6}
                        data-testid="input-contact-message"
                      />
                    </div>
                    
                    <Button 
                      type="submit"
                      className="w-full bg-gradient-to-r from-[#1d4ed8] to-[#60a5fa]"
                      data-testid="button-send-message"
                    >
                      Enviar Mensagem
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6 flex items-start gap-4">
                  <MapPin className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Endereço</h3>
                    <p className="text-muted-foreground">
                      R. Severino Alves Cardoso, 655 - Goiás<br />
                      Araguari - MG, 38442-188
                    </p>
                    <a
                      href="https://www.google.com/maps/search/?api=1&query=R.+Severino+Alves+Cardoso,+655+-+Goi%C3%A1s,+Araguari+-+MG,+38442-188,+Brasil"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline text-sm mt-2 inline-block"
                    >
                      Ver no Google Maps →
                    </a>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 flex items-start gap-4">
                  <Phone className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Telefone</h3>
                    <a
                      href="tel:+5534993235000"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      (34) 99323-5000
                    </a>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 flex items-start gap-4">
                  <Mail className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <a
                      href="mailto:uniquearaguari@gmail.com"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      uniquearaguari@gmail.com
                    </a>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 flex items-start gap-4">
                  <Clock className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Horário de Atendimento</h3>
                    <p className="text-muted-foreground">
                      Segunda a Sexta: 8h às 22h<br />
                      Sábados e Domingos: 8h às 20h
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
