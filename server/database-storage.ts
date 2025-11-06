import { eq, and } from "drizzle-orm";
import { db } from "./db";
import { bookings, users } from "@shared/schema";
import type { IStorage } from "./storage";
import type { User, InsertUser, Booking, InsertBooking } from "@shared/schema";
import { randomUUID } from "crypto";

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const newUser = { ...insertUser, id };
    await db.insert(users).values(newUser);
    return newUser;
  }

  async createBooking(insertBooking: InsertBooking & { bookingNumber: string; cancelToken: string; googleCalendarEventId?: string | null }): Promise<Booking> {
    const id = randomUUID();
    
    // Convert timeSlots array to JSON string for SQLite
    const timeSlotsJson = JSON.stringify(insertBooking.timeSlots);
    
    const newBooking = {
      id,
      bookingNumber: insertBooking.bookingNumber,
      cancelToken: insertBooking.cancelToken,
      serviceType: insertBooking.serviceType,
      date: insertBooking.date,
      timeSlots: timeSlotsJson,
      customerName: insertBooking.customerName,
      customerEmail: insertBooking.customerEmail,
      customerPhone: insertBooking.customerPhone,
      observations: insertBooking.observations || null,
      totalAmount: insertBooking.totalAmount,
      status: insertBooking.status || "confirmed",
      cancelled: insertBooking.cancelled || false,
      cancelReason: null,
      cancelledAt: null,
      googleCalendarEventId: insertBooking.googleCalendarEventId || null,
      createdAt: new Date(),
    };

    await db.insert(bookings).values(newBooking);
    
    // Return with timeSlots as array
    return {
      ...newBooking,
      timeSlots: insertBooking.timeSlots,
    } as Booking;
  }

  async getBooking(id: string): Promise<Booking | undefined> {
    const result = await db.select().from(bookings).where(eq(bookings.id, id)).limit(1);
    if (!result[0]) return undefined;
    
    // Convert timeSlots JSON string back to array
    const booking = result[0];
    return {
      ...booking,
      timeSlots: JSON.parse(booking.timeSlots),
      googleCalendarEventId: booking.googleCalendarEventId || undefined,
    } as Booking;
  }

  async getBookingByNumber(bookingNumber: string): Promise<Booking | undefined> {
    const result = await db
      .select()
      .from(bookings)
      .where(eq(bookings.bookingNumber, bookingNumber))
      .limit(1);
    
    if (!result[0]) return undefined;
    
    return {
      ...result[0],
      timeSlots: JSON.parse(result[0].timeSlots),
    } as Booking;
  }

  async getBookingByCancelToken(token: string): Promise<Booking | undefined> {
    const result = await db
      .select()
      .from(bookings)
      .where(
        and(
          eq(bookings.cancelToken, token),
          eq(bookings.cancelled, false)
        )
      )
      .limit(1);
    
    if (!result[0]) return undefined;
    
    return {
      ...result[0],
      timeSlots: JSON.parse(result[0].timeSlots),
    } as Booking;
  }

  async cancelBooking(id: string, reason?: string): Promise<Booking> {
    const booking = await this.getBooking(id);
    if (!booking) {
      throw new Error("Booking not found");
    }

    await db
      .update(bookings)
      .set({
        cancelled: true,
        cancelledAt: new Date(),
        cancelReason: reason || null,
        status: "cancelled",
      })
      .where(eq(bookings.id, id));

    return {
      ...booking,
      cancelled: true,
      cancelledAt: new Date(),
      cancelReason: reason || null,
      status: "cancelled",
    };
  }

  async getBookingsByDateAndSlot(date: string, timeSlot: string): Promise<Booking[]> {
    const allBookings = await db
      .select()
      .from(bookings)
      .where(
        and(
          eq(bookings.date, date),
          eq(bookings.cancelled, false)
        )
      );

    // Filter bookings that include the timeSlot
    return allBookings
      .map((booking) => ({
        ...booking,
        timeSlots: JSON.parse(booking.timeSlots),
      }))
      .filter((booking) => booking.timeSlots.includes(timeSlot)) as Booking[];
  }

  async getAvailableSlots(date: string, serviceType: string): Promise<string[]> {
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

    const bookingsOnDate = await db
      .select()
      .from(bookings)
      .where(
        and(
          eq(bookings.date, date),
          eq(bookings.cancelled, false)
        )
      );

    const occupiedSlots = new Set<string>();
    bookingsOnDate.forEach((booking) => {
      const timeSlots = JSON.parse(booking.timeSlots);
      timeSlots.forEach((slot: string) => occupiedSlots.add(slot));
    });

    return allSlots.filter((slot) => !occupiedSlots.has(slot));
  }
}

