import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBookingSchema } from "@shared/schema";
import { randomUUID } from "crypto";
import { sendConfirmationEmail, sendOwnerNotificationEmail } from "./email";
import { createCalendarEvent, deleteCalendarEvents } from "./google-calendar";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/availability", async (req, res) => {
    try {
      const { date, serviceType } = req.query;

      if (!date || !serviceType) {
        return res
          .status(400)
          .json({ error: "Date and serviceType are required" });
      }

      // Horários de início apenas (sem intervalos)
      const allSlots = [
        "08:00",
        "09:00",
        "10:00",
        "11:00",
        "13:00",
        "14:00",
        "15:00",
        "16:00",
        "17:00",
        "18:00",
        "19:00",
        "20:00",
        "21:00",
        "22:00",
        "23:00",
      ];

      const occupiedSlotsSet = new Set<string>();

      // Verificar disponibilidade usando horários de início
      for (const slot of allSlots) {
        const bookings = await storage.getBookingsByDateAndSlot(
          date as string,
          slot
        );
        if (bookings.length > 0) {
          occupiedSlotsSet.add(slot);
        }
      }

      // Mapear disponibilidade
      const availability = allSlots.map((slot) => ({
        time: slot,
        available: !occupiedSlotsSet.has(slot),
      }));

      res.json({ slots: availability });
    } catch (error) {
      console.error("Error fetching availability:", error);
      res.status(500).json({ error: "Failed to fetch availability" });
    }
  });

  app.post("/api/bookings", async (req, res) => {
    try {
      const validatedData = insertBookingSchema.parse(req.body);

      // Verificar disponibilidade usando horários de início (sem intervalos)
      for (const slot of validatedData.timeSlots) {
        const existingBookings = await storage.getBookingsByDateAndSlot(
          validatedData.date,
          slot
        );
        if (existingBookings.length > 0) {
          const availableSlots = await storage.getAvailableSlots(
            validatedData.date,
            validatedData.serviceType
          );
          return res.status(409).json({
            error: "Conflito de horário",
            message:
              "Um ou mais horários selecionados não estão mais disponíveis",
            unavailableSlots: [slot],
            availableSlots: availableSlots.slice(0, 3),
          });
        }
      }

      const bookingNumber = `UNQ-${Math.floor(10000 + Math.random() * 90000)}`;
      const cancelToken = randomUUID();

      // Criar evento no Google Calendar primeiro
      const tempBooking = {
        ...validatedData,
        bookingNumber,
        cancelToken,
        id: "",
        createdAt: new Date(),
        cancelled: false,
        status: "confirmed" as const,
        cancelledAt: null,
        cancelReason: null,
        googleCalendarEventId: null,
      };

      const calendarEventId = await createCalendarEvent(tempBooking as any);

      const booking = await storage.createBooking({
        ...validatedData,
        bookingNumber,
        cancelToken,
        googleCalendarEventId: calendarEventId,
      });

      // Enviar emails (não bloqueia a resposta se falhar)
      sendConfirmationEmail(booking).catch((error) => {
        console.error(
          "Erro ao enviar email para cliente (não crítico):",
          error
        );
      });

      sendOwnerNotificationEmail(booking).catch((error) => {
        console.error("Erro ao enviar email para dono (não crítico):", error);
      });

      res.status(201).json(booking);
    } catch (error) {
      console.error("Error creating booking:", error);
      if (error instanceof Error && "issues" in error) {
        return res
          .status(400)
          .json({ error: "Invalid booking data", details: error });
      }
      res.status(500).json({ error: "Failed to create booking" });
    }
  });

  app.get("/api/bookings/number/:bookingNumber", async (req, res) => {
    try {
      const { bookingNumber } = req.params;
      const booking = await storage.getBookingByNumber(bookingNumber);

      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }

      res.json(booking);
    } catch (error) {
      console.error("Error fetching booking:", error);
      res.status(500).json({ error: "Failed to fetch booking" });
    }
  });

  app.get("/api/bookings/cancel/:token", async (req, res) => {
    try {
      const { token } = req.params;
      const booking = await storage.getBookingByCancelToken(token);

      if (!booking) {
        return res
          .status(404)
          .json({ error: "Booking not found or already cancelled" });
      }

      const bookingDateTime = new Date(
        `${booking.date} ${booking.timeSlots[0]}`
      );
      const now = new Date();
      const hoursDiff =
        (bookingDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

      if (hoursDiff < 2) {
        return res.status(403).json({
          error: "Cancellation not allowed",
          message:
            "Cancelamentos devem ser feitos com pelo menos 2 horas de antecedência",
        });
      }

      res.json(booking);
    } catch (error) {
      console.error("Error fetching booking for cancellation:", error);
      res.status(500).json({ error: "Failed to fetch booking" });
    }
  });

  app.post("/api/bookings/cancel/:token", async (req, res) => {
    try {
      const { token } = req.params;
      const { reason } = req.body;

      const booking = await storage.getBookingByCancelToken(token);

      if (!booking) {
        return res
          .status(404)
          .json({ error: "Booking not found or already cancelled" });
      }

      const bookingDateTime = new Date(
        `${booking.date} ${booking.timeSlots[0]}`
      );
      const now = new Date();
      const hoursDiff =
        (bookingDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

      if (hoursDiff < 2) {
        return res.status(403).json({
          error: "Cancellation not allowed",
          message:
            "Cancelamentos devem ser feitos com pelo menos 2 horas de antecedência",
        });
      }

      const cancelledBooking = await storage.cancelBooking(booking.id, reason);

      // Deletar eventos do Google Calendar
      if (cancelledBooking.googleCalendarEventId) {
        await deleteCalendarEvents(
          cancelledBooking.googleCalendarEventId
        ).catch((error) => {
          console.error(
            "Erro ao deletar eventos do Google Calendar (não crítico):",
            error
          );
        });
      }

      res.json(cancelledBooking);
    } catch (error) {
      console.error("Error cancelling booking:", error);
      res.status(500).json({ error: "Failed to cancel booking" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
