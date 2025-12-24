import type { OpenAPIV3_1 } from "openapi-types";

const localServerUrl = "http://localhost:8080";
const productionServerUrl = "https://agendamentounique.onrender.com";

export const openApiDocument = {
  openapi: "3.0.3",
  info: {
    title: "Unique Booking API",
    version: "1.0.0",
    description:
      "API used by the Unique scheduling platform to manage availability, bookings, cancellations and contact messages.",
  },
  servers: [
    { url: localServerUrl, description: "Local development" },
    { url: productionServerUrl, description: "Production" },
  ],
  tags: [
    { name: "Availability", description: "Consult available time slots." },
    { name: "Bookings", description: "Create and manage reservations." },
    { name: "Contact", description: "Messages sent through the contact form." },
  ],
  components: {
    schemas: {
      AvailabilitySlot: {
        type: "object",
        required: ["time", "available"],
        properties: {
          time: {
            type: "string",
            description: "Start time in HH:mm format",
            example: "19:00",
          },
          available: {
            type: "boolean",
            description: "Indicates whether the slot is available for booking.",
            example: true,
          },
        },
      },
      AvailabilityResponse: {
        type: "object",
        required: ["slots"],
        properties: {
          slots: {
            type: "array",
            items: { $ref: "#/components/schemas/AvailabilitySlot" },
          },
        },
      },
      Booking: {
        type: "object",
        required: [
          "id",
          "bookingNumber",
          "serviceType",
          "date",
          "timeSlots",
          "customerName",
          "customerEmail",
          "customerPhone",
          "totalAmount",
          "status",
          "cancelToken",
          "cancelled",
          "createdAt",
        ],
        properties: {
          id: { type: "string", format: "uuid" },
          bookingNumber: {
            type: "string",
            description: "Human-readable booking identifier.",
            example: "UNQ-12345",
          },
          serviceType: {
            type: "string",
            description: "Service selected by the customer (e.g. quadra, festa, evento).",
            example: "quadra",
          },
          date: {
            type: "string",
            format: "date",
            description: "Reservation date in YYYY-MM-DD format.",
            example: "2025-11-13",
          },
          timeSlots: {
            type: "array",
            items: { type: "string", pattern: "^\\d{2}:\\d{2}$" },
            description: "List of selected start times.",
            example: ["18:00", "19:00"],
          },
          customerName: { type: "string" },
          customerEmail: { type: "string", format: "email" },
          customerPhone: { type: "string" },
          observations: { type: "string", nullable: true },
          totalAmount: {
            type: "integer",
            description: "Total amount in Brazilian Real (cents).",
            example: 150,
          },
          status: {
            type: "string",
            description: "Current status of the booking.",
            enum: ["confirmed", "cancelled"],
            example: "confirmed",
          },
          cancelToken: {
            type: "string",
            description: "Token used for authenticated cancellation operations.",
            example: "f1c8bc7c-bf49-4b4d-bf6f-9f0a637a71d2",
          },
          cancelled: { type: "boolean" },
          cancelReason: { type: "string", nullable: true },
          cancelledAt: { type: "string", format: "date-time", nullable: true },
          googleCalendarEventId: {
            type: "string",
            nullable: true,
            description: "Identifier of the Google Calendar event when available.",
          },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      CreateBookingRequest: {
        type: "object",
        required: [
          "serviceType",
          "date",
          "timeSlots",
          "customerName",
          "customerEmail",
          "customerPhone",
          "totalAmount",
        ],
        properties: {
          serviceType: { type: "string" },
          date: { type: "string", format: "date" },
          timeSlots: {
            type: "array",
            minItems: 1,
            items: { type: "string", pattern: "^\\d{2}:\\d{2}$" },
          },
          customerName: { type: "string" },
          customerEmail: { type: "string", format: "email" },
          customerPhone: { type: "string" },
          observations: { type: "string" },
          totalAmount: {
            type: "integer",
            description: "Total amount in Brazilian Real (cents).",
            example: 100,
          },
          status: {
            type: "string",
            enum: ["confirmed", "cancelled"],
            description: "Optional status override. Defaults to confirmed.",
          },
          cancelled: {
            type: "boolean",
            description: "Optional flag to mark the booking as cancelled on creation.",
          },
        },
      },
      CancelBookingRequest: {
        type: "object",
        properties: {
          reason: {
            type: "string",
            description: "Optional reason provided by the customer when cancelling.",
            example: "Unable to attend.",
          },
        },
      },
      ContactRequest: {
        type: "object",
        required: ["name", "email", "message"],
        properties: {
          name: { type: "string" },
          email: { type: "string", format: "email" },
          message: { type: "string" },
        },
      },
      ContactResponse: {
        type: "object",
        properties: {
          success: {
            type: "boolean",
            example: true,
          },
        },
      },
      ErrorResponse: {
        type: "object",
        properties: {
          error: { type: "string" },
          message: { type: "string" },
          details: {
            type: "object",
            description: "Optional validation details returned by the API.",
          },
        },
      },
    },
  },
  paths: {
    "/api/availability": {
      get: {
        tags: ["Availability"],
        summary: "List available slots for a given day and service type.",
        parameters: [
          {
            name: "date",
            in: "query",
            required: true,
            schema: { type: "string", format: "date" },
            description: "Date to check availability for (YYYY-MM-DD).",
          },
          {
            name: "serviceType",
            in: "query",
            required: true,
            schema: { type: "string" },
            description: "Service type to evaluate (quadra, festa, evento).",
          },
        ],
        responses: {
          "200": {
            description: "Availability returned successfully.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AvailabilityResponse" },
              },
            },
          },
          "400": {
            description: "Missing required parameters.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "500": {
            description: "Failed to retrieve availability.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/bookings": {
      post: {
        tags: ["Bookings"],
        summary: "Create a new booking.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateBookingRequest" },
            },
          },
        },
        responses: {
          "201": {
            description: "Booking created successfully.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Booking" },
              },
            },
          },
          "400": {
            description: "Validation failed for the provided payload.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "409": {
            description: "One or more of the requested slots are no longer available.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: { type: "string" },
                    message: { type: "string" },
                    unavailableSlots: {
                      type: "array",
                      items: { type: "string" },
                    },
                    availableSlots: {
                      type: "array",
                      items: { type: "string" },
                    },
                  },
                },
              },
            },
          },
          "500": {
            description: "Unexpected error while creating the booking.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/contact": {
      post: {
        tags: ["Contact"],
        summary: "Send a contact message to the venue owner.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ContactRequest" },
            },
          },
        },
        responses: {
          "200": {
            description: "Message successfully delivered.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ContactResponse" },
              },
            },
          },
          "400": {
            description: "Missing required fields.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "500": {
            description: "Unexpected error sending the message.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/bookings/number/{bookingNumber}": {
      get: {
        tags: ["Bookings"],
        summary: "Retrieve a booking by its public booking number.",
        parameters: [
          {
            name: "bookingNumber",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Booking number returned during confirmation (e.g. UNQ-12345).",
          },
        ],
        responses: {
          "200": {
            description: "Booking found.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Booking" },
              },
            },
          },
          "404": {
            description: "Booking not found.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "500": {
            description: "Unexpected error fetching the booking.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/api/bookings/cancel/{token}": {
      get: {
        tags: ["Bookings"],
        summary: "Fetch booking details using the cancellation token.",
        parameters: [
          {
            name: "token",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
            description: "Cancellation token sent in the confirmation email.",
          },
        ],
        responses: {
          "200": {
            description: "Booking data returned successfully.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Booking" },
              },
            },
          },
          "403": {
            description: "Cancellation no longer allowed for the booking.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "404": {
            description: "Token invalid or booking already cancelled.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "500": {
            description: "Unexpected error fetching the booking.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
      post: {
        tags: ["Bookings"],
        summary: "Cancel an existing booking using the cancellation token.",
        parameters: [
          {
            name: "token",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        requestBody: {
          required: false,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CancelBookingRequest" },
            },
          },
        },
        responses: {
          "200": {
            description: "Booking cancelled successfully.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Booking" },
              },
            },
          },
          "403": {
            description: "Cancellation not allowed (less than two hours in advance).",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "404": {
            description: "Token invalid or booking already cancelled.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
          "500": {
            description: "Unexpected error while cancelling.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
  },
} satisfies OpenAPIV3_1.Document;

export type OpenApiDocument = typeof openApiDocument;
