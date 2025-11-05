import { type User, type InsertUser, type Booking, type InsertBooking } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createBooking(booking: InsertBooking): Promise<Booking>;
  getBooking(id: string): Promise<Booking | undefined>;
  getBookingByNumber(bookingNumber: string): Promise<Booking | undefined>;
  getBookingByCancelToken(token: string): Promise<Booking | undefined>;
  cancelBooking(id: string, reason?: string): Promise<Booking>;
  getBookingsByDateAndSlot(date: string, timeSlot: string): Promise<Booking[]>;
  getAvailableSlots(date: string, serviceType: string): Promise<string[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private bookings: Map<string, Booking>;

  constructor() {
    this.users = new Map();
    this.bookings = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createBooking(insertBooking: InsertBooking & { bookingNumber: string, cancelToken: string }): Promise<Booking> {
    const id = randomUUID();
    const booking: Booking = {
      ...insertBooking,
      id,
      bookingNumber: insertBooking.bookingNumber,
      cancelToken: insertBooking.cancelToken,
      status: insertBooking.status || "confirmed",
      observations: insertBooking.observations || null,
      cancelled: insertBooking.cancelled || false,
      cancelReason: null,
      createdAt: new Date(),
      cancelledAt: null,
    };
    this.bookings.set(id, booking);
    return booking;
  }

  async getBooking(id: string): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }

  async getBookingByNumber(bookingNumber: string): Promise<Booking | undefined> {
    return Array.from(this.bookings.values()).find(
      (booking) => booking.bookingNumber === bookingNumber
    );
  }

  async getBookingByCancelToken(token: string): Promise<Booking | undefined> {
    return Array.from(this.bookings.values()).find(
      (booking) => booking.cancelToken === token && !booking.cancelled
    );
  }

  async cancelBooking(id: string, reason?: string): Promise<Booking> {
    const booking = this.bookings.get(id);
    if (!booking) {
      throw new Error("Booking not found");
    }
    
    const updatedBooking: Booking = {
      ...booking,
      cancelled: true,
      cancelledAt: new Date(),
      cancelReason: reason || null,
      status: "cancelled",
    };
    
    this.bookings.set(id, updatedBooking);
    return updatedBooking;
  }

  async getBookingsByDateAndSlot(date: string, timeSlot: string): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(
      (booking) => 
        !booking.cancelled && 
        booking.date === date && 
        booking.timeSlots.includes(timeSlot)
    );
  }

  async getAvailableSlots(date: string, serviceType: string): Promise<string[]> {
    const allSlots = [
      '08:00 - 09:00',
      '09:00 - 10:00',
      '10:00 - 11:00',
      '11:00 - 12:00',
      '13:00 - 14:00',
      '14:00 - 15:00',
      '15:00 - 16:00',
      '16:00 - 17:00',
      '17:00 - 18:00',
      '18:00 - 19:00',
      '19:00 - 20:00',
      '20:00 - 21:00',
    ];

    const occupiedSlots = new Set<string>();
    
    const bookingsOnDate = Array.from(this.bookings.values()).filter(
      (booking) => !booking.cancelled && booking.date === date
    );

    bookingsOnDate.forEach(booking => {
      booking.timeSlots.forEach(slot => occupiedSlots.add(slot));
    });

    return allSlots.map(slot => ({
      time: slot,
      available: !occupiedSlots.has(slot)
    })).filter(slot => slot.available).map(slot => slot.time);
  }
}

export const storage = new MemStorage();
