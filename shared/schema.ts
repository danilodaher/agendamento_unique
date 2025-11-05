import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const bookings = pgTable("bookings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  bookingNumber: text("booking_number").notNull().unique(),
  serviceType: text("service_type").notNull(),
  date: text("date").notNull(),
  timeSlots: text("time_slots").array().notNull(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone").notNull(),
  observations: text("observations"),
  totalAmount: integer("total_amount").notNull(),
  status: text("status").notNull().default("confirmed"),
  cancelToken: text("cancel_token").notNull(),
  cancelled: boolean("cancelled").notNull().default(false),
  cancelledAt: timestamp("cancelled_at"),
  cancelReason: text("cancel_reason"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  bookingNumber: true,
  cancelToken: true,
  createdAt: true,
  cancelledAt: true,
});

export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookings.$inferSelect;

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
