import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const bookings = sqliteTable("bookings", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  bookingNumber: text("booking_number").notNull().unique(),
  serviceType: text("service_type").notNull(),
  date: text("date").notNull(),
  timeSlots: text("time_slots").notNull(), // JSON array stored as text
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone").notNull(),
  observations: text("observations"),
  totalAmount: integer("total_amount").notNull(),
  status: text("status").notNull().default("confirmed"),
  cancelToken: text("cancel_token").notNull(),
  cancelled: integer("cancelled", { mode: "boolean" }).notNull().default(false),
  cancelledAt: integer("cancelled_at", { mode: "timestamp" }),
  cancelReason: text("cancel_reason"),
  googleCalendarEventId: text("google_calendar_event_id"), // IDs dos eventos separados por vírgula
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

const baseInsertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  bookingNumber: true,
  cancelToken: true,
  createdAt: true,
  cancelledAt: true,
});

// Override timeSlots to accept array instead of string
export const insertBookingSchema = baseInsertBookingSchema.extend({
  timeSlots: z.array(z.string()),
});

export type InsertBooking = z.infer<typeof insertBookingSchema>;

// Booking type with timeSlots as array (converted from JSON string in database)
export type Booking = Omit<typeof bookings.$inferSelect, "timeSlots"> & {
  timeSlots: string[];
};

export const users = sqliteTable("users", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
