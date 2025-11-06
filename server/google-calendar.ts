import { google } from "googleapis";
import type { Booking } from "@shared/schema";

// Inicializar Google Calendar API
const getCalendarClient = () => {
  if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
    return null;
  }

  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_CLIENT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/calendar"],
  });

  return google.calendar({ version: "v3", auth });
};

// Criar evento no Google Calendar
export async function createCalendarEvent(booking: Booking): Promise<string | null> {
  try {
    const calendar = getCalendarClient();
    if (!calendar) {
      console.log("📅 Google Calendar não configurado. Modo desenvolvimento.");
      return null;
    }

    const calendarId = process.env.GOOGLE_CALENDAR_ID || "primary";
    
    // Converter data ISO para Date object
    const eventDate = new Date(booking.date + "T00:00:00");
    
    // Criar eventos para cada horário
    const eventIds: string[] = [];
    
    for (const timeSlot of booking.timeSlots) {
      const [hours, minutes] = timeSlot.split(":");
      const startDateTime = new Date(eventDate);
      startDateTime.setHours(parseInt(hours), parseInt(minutes), 0);
      
      const endDateTime = new Date(startDateTime);
      endDateTime.setHours(parseInt(hours) + 1, parseInt(minutes), 0);
      
      const event = {
        summary: `${booking.serviceType} - ${booking.customerName}`,
        description: `Reserva ${booking.bookingNumber}\n\nCliente: ${booking.customerName}\nTelefone: ${booking.customerPhone}\nEmail: ${booking.customerEmail}\nValor: R$ ${booking.totalAmount.toFixed(2)}${booking.observations ? `\n\nObservações: ${booking.observations}` : ""}`,
        start: {
          dateTime: startDateTime.toISOString(),
          timeZone: "America/Sao_Paulo",
        },
        end: {
          dateTime: endDateTime.toISOString(),
          timeZone: "America/Sao_Paulo",
        },
        location: "Unique - Complexo Esportivo",
        colorId: booking.serviceType.toLowerCase() === "quadra" ? "1" : booking.serviceType.toLowerCase() === "festa" ? "10" : "5",
      };

      const response = await calendar.events.insert({
        calendarId,
        requestBody: event,
      });

      if (response.data.id) {
        eventIds.push(response.data.id);
        console.log(`✅ Evento criado no Google Calendar: ${response.data.id}`);
      }
    }

    // Retornar IDs separados por vírgula para armazenar no banco
    return eventIds.join(",");
  } catch (error) {
    console.error("❌ Erro ao criar evento no Google Calendar:", error);
    return null;
  }
}

// Deletar eventos do Google Calendar
export async function deleteCalendarEvents(eventIds: string | null): Promise<void> {
  try {
    if (!eventIds) {
      return;
    }

    const calendar = getCalendarClient();
    if (!calendar) {
      console.log("📅 Google Calendar não configurado. Modo desenvolvimento.");
      return;
    }

    const calendarId = process.env.GOOGLE_CALENDAR_ID || "primary";
    const ids = eventIds.split(",");

    for (const eventId of ids) {
      try {
        await calendar.events.delete({
          calendarId,
          eventId: eventId.trim(),
        });
        console.log(`✅ Evento deletado do Google Calendar: ${eventId}`);
      } catch (error: any) {
        // Ignorar erro se evento já não existir
        if (error.code !== 404) {
          console.error(`❌ Erro ao deletar evento ${eventId}:`, error);
        }
      }
    }
  } catch (error) {
    console.error("❌ Erro ao deletar eventos do Google Calendar:", error);
  }
}

