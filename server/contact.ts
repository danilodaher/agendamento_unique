import { Resend } from "resend";

interface ContactPayload {
  name: string;
  email: string;
  message: string;
}

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function sendContactEmail({ name, email, message }: ContactPayload) {
  if (!process.env.RESEND_API_KEY) {
    console.log("📧 Contato não enviado (RESEND_API_KEY ausente). Modo desenvolvimento.");
    console.log({ name, email, message });
    return;
  }

  if (!resend) {
    throw new Error("Resend não inicializado - RESEND_API_KEY não configurada");
  }

  const ownerEmail = process.env.OWNER_EMAIL || "uniquearaguari@gmail.com";
  const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; color: white; padding: 24px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 24px; border-radius: 0 0 10px 10px; }
          .divider { border-top: 1px solid #e5e7eb; margin: 20px 0; }
          .label { font-weight: bold; color: #1f2937; }
          .value { margin: 4px 0 16px; color: #374151; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📨 Novo contato recebido</h1>
            <p>Uma nova mensagem foi enviada pelo site.</p>
          </div>
          <div class="content">
            <div class="label">Nome</div>
            <div class="value">${name}</div>

            <div class="label">Email</div>
            <div class="value">${email}</div>

            <div class="label">Mensagem</div>
            <div class="value">${message.replace(/\n/g, "<br/>")}</div>

            <div class="divider"></div>
            <p style="font-size: 12px; color: #6b7280;">Este email foi enviado automaticamente pelo formulário de contato da Unique.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  await resend.emails.send({
    from: `Unique Reservas <${fromEmail}>`,
    to: ownerEmail,
    replyTo: email,
    subject: `📨 Novo contato - ${name}`,
    html,
    text: `Nome: ${name}\nEmail: ${email}\nMensagem:\n${message}`,
  });
}


