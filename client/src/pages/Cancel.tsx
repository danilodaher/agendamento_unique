import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";

export default function Cancel() {
  const [match, params] = useRoute("/cancelar/:token");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [reason, setReason] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  
  const { data: booking, isLoading, error } = useQuery({
    queryKey: ['/api/bookings/cancel', params?.token],
    queryFn: async () => {
      const response = await fetch(`/api/bookings/cancel/${params?.token}`);
      if (!response.ok) {
        const error = await response.json();
        throw error;
      }
      return response.json();
    },
    enabled: !!params?.token,
  });
  
  const cancelMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/bookings/cancel/${params?.token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw error;
      }
      
      return await response.json();
    },
    onSuccess: () => {
      setCancelled(true);
      toast({
        title: "Reserva cancelada",
        description: "Um email de confirmação foi enviado para você.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao cancelar",
        description: error.message || "Tente novamente mais tarde",
        variant: "destructive",
      });
    },
  });
  
  if (!match) {
    setLocation('/');
    return null;
  }
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 pt-24 flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }
  
  if (error) {
    const errorData = error as any;
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-2xl mx-auto px-6 pt-24 pb-12">
          <Card className="border-destructive">
            <CardHeader>
              <div className="flex items-center gap-3">
                <XCircle className="w-8 h-8 text-destructive" />
                <CardTitle className="text-2xl">Cancelamento Não Permitido</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                {errorData.message || "Link inválido ou reserva já cancelada."}
              </p>
              {errorData.error === "Cancellation not allowed" && (
                <p className="text-sm">
                  Para cancelamentos de última hora, entre em contato conosco diretamente.
                </p>
              )}
              <Button onClick={() => setLocation('/')} className="w-full">
                Voltar ao Início
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (cancelled) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-2xl mx-auto px-6 pt-24 pb-12">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
                <CardTitle className="text-2xl">Cancelamento Confirmado</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Sua reserva <strong>{booking?.bookingNumber}</strong> foi cancelada com sucesso.
              </p>
              <p className="text-sm text-muted-foreground">
                Um email de confirmação foi enviado para {booking?.customerEmail}.
              </p>
              <Button onClick={() => setLocation('/')} className="w-full bg-gradient-to-r from-[#1d4ed8] to-[#60a5fa]">
                Voltar ao Início
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-2xl mx-auto px-6 pt-24 pb-12">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-orange-500" />
              <CardTitle className="text-2xl">Cancelar Reserva</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted p-4 rounded-md space-y-2">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-muted-foreground">Número:</div>
                <div className="font-semibold">{booking?.bookingNumber}</div>
                
                <div className="text-muted-foreground">Tipo:</div>
                <div className="font-semibold">{booking?.serviceType}</div>
                
                <div className="text-muted-foreground">Data:</div>
                <div className="font-semibold">{booking?.date}</div>
                
                <div className="text-muted-foreground">Horários:</div>
                <div className="font-semibold">{booking?.timeSlots.length} horário(s)</div>
              </div>
            </div>
            
            <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-md">
              <p className="text-sm font-semibold text-destructive mb-2">⚠️ Atenção: Esta ação é irreversível</p>
              <p className="text-sm text-muted-foreground">
                Ao cancelar esta reserva, você não poderá mais acessá-la e o horário ficará disponível para outros clientes.
              </p>
            </div>
            
            <div>
              <Label htmlFor="cancel-reason">Motivo do cancelamento (opcional)</Label>
              <Textarea
                id="cancel-reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Conte-nos por que você está cancelando..."
                rows={4}
                data-testid="input-cancel-reason"
              />
            </div>
            
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => setLocation('/')}
                className="flex-1"
                data-testid="button-back"
              >
                Voltar
              </Button>
              <Button
                variant="destructive"
                onClick={() => setShowConfirmDialog(true)}
                className="flex-1"
                data-testid="button-cancel-confirm"
              >
                Confirmar Cancelamento
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza absoluta?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Sua reserva será permanentemente cancelada
              e o horário ficará disponível para outros clientes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Não, manter reserva</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => cancelMutation.mutate()}
              className="bg-destructive hover:bg-destructive/90"
              disabled={cancelMutation.isPending}
            >
              {cancelMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Cancelando...
                </>
              ) : (
                'Sim, cancelar reserva'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Footer />
    </div>
  );
}
