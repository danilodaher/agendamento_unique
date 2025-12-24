import { Resend } from "resend";
import type { Booking } from "@shared/schema";

// Inicializar Resend com API key (pode ser undefined em desenvolvimento)
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

// Template de email de confirmação
const createConfirmationEmailTemplate = (booking: Booking) => {
  const timeSlotsText = booking.timeSlots.join(", ");
  const cancelUrl = `${
    process.env.BASE_URL || "http://localhost:8080"
  }/cancelar/${booking.cancelToken}`;

  return {
    subject: `Confirmação de Reserva - ${booking.bookingNumber}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1d4ed8 0%, #60a5fa 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
            .detail-label { font-weight: bold; color: #666; }
            .detail-value { color: #333; }
            .booking-number { font-size: 24px; font-weight: bold; color: #1d4ed8; margin: 20px 0; }
            .button { display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #1d4ed8 0%, #60a5fa 100%); color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Reserva Confirmada!</h1>
              <p>Sua reserva foi confirmada com sucesso</p>
            </div>
            <div class="content">
              <div class="booking-number">Nº ${booking.bookingNumber}</div>
              
              <div class="booking-details">
                <div class="detail-row">
                  <span class="detail-label">Tipo de Serviço:</span>
                  <span class="detail-value">${booking.serviceType}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Data:</span>
                  <span class="detail-value">${booking.date}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Horários:</span>
                  <span class="detail-value">${timeSlotsText}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Valor Total:</span>
                  <span class="detail-value">R$ ${booking.totalAmount.toFixed(
                    2
                  )}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Nome:</span>
                  <span class="detail-value">${booking.customerName}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Telefone:</span>
                  <span class="detail-value">${booking.customerPhone}</span>
                </div>
                ${
                  booking.observations
                    ? `
                <div class="detail-row">
                  <span class="detail-label">Observações:</span>
                  <span class="detail-value">${booking.observations}</span>
                </div>
                `
                    : ""
                }
              </div>
              
              <p>Para cancelar sua reserva, clique no link abaixo:</p>
              <a href="${cancelUrl}" class="button">Cancelar Reserva</a>
              
              <div class="footer">
                <p>Este é um email automático, por favor não responda.</p>
                <p>Em caso de dúvidas, entre em contato conosco.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
Confirmação de Reserva - ${booking.bookingNumber}

Sua reserva foi confirmada com sucesso!

Detalhes da Reserva:
- Número: ${booking.bookingNumber}
- Tipo: ${booking.serviceType}
- Data: ${booking.date}
- Horários: ${timeSlotsText}
- Valor Total: R$ ${booking.totalAmount.toFixed(2)}
- Nome: ${booking.customerName}
- Telefone: ${booking.customerPhone}
${booking.observations ? `- Observações: ${booking.observations}` : ""}

Para cancelar sua reserva, acesse: ${cancelUrl}

Este é um email automático, por favor não responda.
    `.trim(),
  };
};

// Função para enviar email de confirmação usando Resend
export async function sendConfirmationEmail(booking: Booking): Promise<void> {
  try {
    // Se não houver API key configurada, apenas loga (modo desenvolvimento)
    if (!process.env.RESEND_API_KEY) {
      console.log(
        "📧 Email não enviado (RESEND_API_KEY não configurada). Modo desenvolvimento."
      );
      console.log("📧 Email que seria enviado:", {
        to: booking.customerEmail,
        subject: `Confirmação de Reserva - ${booking.bookingNumber}`,
      });
      return;
    }

    const emailContent = createConfirmationEmailTemplate(booking);
    const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

    if (!resend) {
      throw new Error(
        "Resend não inicializado - RESEND_API_KEY não configurada"
      );
    }

    const { data, error } = await resend.emails.send({
      from: `Unique Reservas <${fromEmail}>`,
      to: booking.customerEmail,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text,
    });

    if (error) {
      throw error;
    }

    console.log("✅ Email de confirmação enviado via Resend:", data?.id);
  } catch (error) {
    // Não falhar a criação do booking se o email falhar
    console.error("❌ Erro ao enviar email de confirmação:", error);
  }
}

// Template de email para o dono da quadra (controle)
const createOwnerEmailTemplate = (booking: Booking) => {
  const timeSlotsText = booking.timeSlots.join(", ");
  const formattedDate = new Date(booking.date + "T00:00:00").toLocaleDateString(
    "pt-BR",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }
  );

  return {
    subject: `[CONTROLE] Nova Reserva - ${booking.bookingNumber}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1d4ed8 0%, #60a5fa 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
            .detail-label { font-weight: bold; color: #666; }
            .detail-value { color: #333; }
            .booking-number { font-size: 24px; font-weight: bold; color: #1d4ed8; margin: 20px 0; }
            .info-box { background: #e0f2fe; border-left: 4px solid #1d4ed8; padding: 15px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📋 Nova Reserva Recebida</h1>
              <p>Uma nova reserva foi confirmada no sistema</p>
            </div>
            <div class="content">
              <div class="booking-number">Nº ${booking.bookingNumber}</div>
              
              <div class="info-box">
                <strong>⚠️ Este é um email de controle interno</strong>
                <p style="margin: 5px 0 0 0; font-size: 14px;">Use estas informações para gerenciar a reserva.</p>
              </div>
              
              <div class="booking-details">
                <div class="detail-row">
                  <span class="detail-label">Tipo de Serviço:</span>
                  <span class="detail-value"><strong>${
                    booking.serviceType
                  }</strong></span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Data:</span>
                  <span class="detail-value">${formattedDate}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Horários:</span>
                  <span class="detail-value"><strong>${timeSlotsText}</strong></span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Valor Total:</span>
                  <span class="detail-value"><strong>R$ ${booking.totalAmount.toFixed(
                    2
                  )}</strong></span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Status:</span>
                  <span class="detail-value">${
                    booking.status === "confirmed"
                      ? "✅ Confirmado"
                      : booking.status
                  }</span>
                </div>
              </div>
              
              <div class="booking-details">
                <h3 style="margin-top: 0; color: #1d4ed8;">Dados do Cliente</h3>
                <div class="detail-row">
                  <span class="detail-label">Nome:</span>
                  <span class="detail-value">${booking.customerName}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Telefone:</span>
                  <span class="detail-value"><a href="tel:${
                    booking.customerPhone
                  }">${booking.customerPhone}</a></span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Email:</span>
                  <span class="detail-value"><a href="mailto:${
                    booking.customerEmail
                  }">${booking.customerEmail}</a></span>
                </div>
                ${
                  booking.observations
                    ? `
                <div class="detail-row">
                  <span class="detail-label">Observações:</span>
                  <span class="detail-value">${booking.observations}</span>
                </div>
                `
                    : ""
                }
              </div>
              
              <div class="footer">
                <p>Este é um email automático do sistema de reservas Unique.</p>
                <p>Data de criação: ${new Date(
                  booking.createdAt
                ).toLocaleString("pt-BR")}</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
[CONTROLE] Nova Reserva - ${booking.bookingNumber}

Uma nova reserva foi confirmada no sistema.

Detalhes da Reserva:
- Número: ${booking.bookingNumber}
- Tipo: ${booking.serviceType}
- Data: ${formattedDate}
- Horários: ${timeSlotsText}
- Valor Total: R$ ${booking.totalAmount.toFixed(2)}
- Status: ${booking.status}

Dados do Cliente:
- Nome: ${booking.customerName}
- Telefone: ${booking.customerPhone}
- Email: ${booking.customerEmail}
${booking.observations ? `- Observações: ${booking.observations}` : ""}

Data de criação: ${new Date(booking.createdAt).toLocaleString("pt-BR")}
    `.trim(),
  };
};

// Função para enviar email de controle para o dono
export async function sendOwnerNotificationEmail(
  booking: Booking
): Promise<void> {
  try {
    const ownerEmail = process.env.OWNER_EMAIL || "uniquearaguari@gmail.com";

    if (!process.env.RESEND_API_KEY) {
      console.log(
        "📧 Email para dono não enviado (RESEND_API_KEY não configurada). Modo desenvolvimento."
      );
      console.log("📧 Email que seria enviado para:", ownerEmail);
      return;
    }

    const emailContent = createOwnerEmailTemplate(booking);
    const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

    if (!resend) {
      throw new Error(
        "Resend não inicializado - RESEND_API_KEY não configurada"
      );
    }

    const { data, error } = await resend.emails.send({
      from: `Unique Sistema <${fromEmail}>`,
      to: ownerEmail,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text,
    });

    if (error) {
      throw error;
    }

    console.log("✅ Email de controle enviado para o dono:", data?.id);
  } catch (error) {
    console.error("❌ Erro ao enviar email de controle:", error);
  }
}
