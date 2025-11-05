# Unique Booking Platform

## Overview

Unique is a sports facility booking platform that enables users to reserve courts, events, and party spaces. The application provides a streamlined 4-step wizard interface for making reservations, with instant confirmation and calendar integration. Built as a full-stack TypeScript application, it combines a React frontend with an Express backend, designed for rapid deployment and easy management of bookings.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build Tool**
- React 18+ with TypeScript for type safety
- Vite as the build tool and development server, providing fast HMR and optimized production builds
- Wouter for lightweight client-side routing (6 main routes: Home, Booking, Confirmation, Cancel, About, Contact)

**UI Component System**
- shadcn/ui components built on Radix UI primitives for accessible, composable interface elements
- Tailwind CSS for utility-first styling with custom design tokens
- Class Variance Authority (CVA) for managing component variants
- "New York" style variant from shadcn/ui configuration

**State Management**
- TanStack Query (React Query) for server state management and data fetching
- React hooks for local component state
- Form state managed through React Hook Form with Zod validation

**Design System**
- Custom color palette using CSS variables for theming
- Inter font family for all typography
- Gradient accent colors (purple/blue gradient: #667eea to #764ba2)
- Mobile-first responsive design with touch-friendly targets
- Progressive disclosure through a 4-step booking wizard

**Key User Flows**
1. **Service Selection**: Users choose between Quadra (court), Evento (event), or Festa (party)
2. **Date & Time Selection**: Calendar picker followed by time slot grid showing availability
3. **Customer Information**: Form capture with validation (name, email, phone, observations)
4. **Confirmation**: Displays booking number with calendar export options (iCal, Google Calendar, Apple Calendar)

### Backend Architecture

**Server Framework**
- Express.js with TypeScript for the HTTP server
- Custom middleware for request logging and JSON parsing with raw body capture
- Vite integration in development mode for HMR

**API Design**
- RESTful API endpoints under `/api` prefix
- Key endpoints:
  - `GET /api/availability` - Fetch available time slots for a given date and service type
  - `POST /api/bookings` - Create new booking
  - `GET /api/bookings/number/:bookingNumber` - Retrieve booking by number
  - `GET /api/bookings/cancel/:token` - Get booking for cancellation
  - `POST /api/bookings/cancel/:token` - Cancel booking with reason

**Business Logic**
- Time slots are predefined (08:00 - 21:00 in 1-hour increments)
- Availability calculated by checking existing bookings for each slot
- Different booking modes: Quadra allows multiple slots, Evento/Festa allow single slot only
- Booking numbers generated with "UNQ-" prefix
- Cancellation tokens for secure booking cancellation

### Data Storage Solutions

**Database**
- PostgreSQL database (via Neon serverless driver @neondatabase/serverless)
- Connection managed through DATABASE_URL environment variable
- Drizzle ORM for type-safe database queries and migrations

**Schema Design**
- `bookings` table:
  - UUID primary key
  - Unique booking number for customer reference
  - Service type (quadra/evento/festa)
  - Date and time slots (array)
  - Customer information (name, email, phone)
  - Total amount and status
  - Cancellation support (cancel token, cancelled flag, reason, timestamp)
  - Timestamps for record creation

- `users` table:
  - UUID primary key
  - Username and password (for future admin functionality)

**Development Fallback**
- In-memory storage implementation (MemStorage class) for development/testing
- Implements same IStorage interface as database-backed storage

### Authentication and Authorization

**Current State**
- No authentication required for public booking flows
- User schema exists but not actively used in current implementation
- Booking security handled through:
  - Unique booking numbers for retrieval
  - Secret cancellation tokens for booking modifications

**Design for Future**
- User table prepared for admin authentication
- Session management scaffolded (connect-pg-simple for PostgreSQL session store)

### External Dependencies

**Third-Party UI Libraries**
- Radix UI primitives (@radix-ui/*): 20+ component packages for accessible UI building blocks
- Embla Carousel for image carousels
- cmdk for command palette components
- Lucide React for icon system
- react-icons for additional brand icons (Google Calendar, Apple)

**Form & Validation**
- React Hook Form (@hookform/resolvers) for form state management
- Zod for runtime type validation and schema definition
- drizzle-zod for generating Zod schemas from database schema

**Date Handling**
- date-fns for date manipulation and formatting
- react-day-picker for calendar UI component

**Styling & Utilities**
- Tailwind CSS with PostCSS for processing
- clsx and tailwind-merge (via cn utility) for conditional class handling
- class-variance-authority for variant-based styling

**Database & ORM**
- Drizzle ORM (drizzle-orm) for database operations
- @neondatabase/serverless for PostgreSQL connection
- drizzle-kit for migrations and schema management

**Development Tools**
- Replit-specific plugins (@replit/vite-plugin-*) for development experience
  - Runtime error modal overlay
  - Cartographer for code navigation
  - Dev banner for environment awareness

**Build & Runtime**
- esbuild for server-side bundling
- tsx for TypeScript execution in development
- Vite for frontend bundling and development server