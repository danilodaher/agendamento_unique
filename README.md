# Unique - Booking System

Web system for scheduling sports courts, events, and parties. Built with React, TypeScript, and Node.js.

## Features

### Bookings
- Service type selection (Court, Event, Party)
- Date and available time slot selection
- Automatic price calculation
- Customer information form
- Booking confirmation and cancellation

### Management
- SQLite database for data persistence
- Email notifications for customers and owner
- Google Calendar integration
- Automatic blocking of occupied time slots
- Real-time availability management

## Technologies

**Frontend**
- React 18
- TypeScript
- Tailwind CSS
- Radix UI
- TanStack Query
- Wouter

**Backend**
- Node.js
- Express
- TypeScript
- Drizzle ORM
- SQLite
- Resend API
- Google Calendar API

## Installation

```bash
npm install
npm run db:push
npm run dev
```

## Configuration

Create a `.env` file in the root directory:

```env
RESEND_API_KEY=your_resend_key
RESEND_FROM_EMAIL=contact@yourdomain.com
OWNER_EMAIL=uniquearaguari@gmail.com

GOOGLE_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_CALENDAR_ID=primary

VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key

BASE_URL=http://localhost:5001
PORT=5001
```

## Scripts

- `npm run dev` - Development server
- `npm run build` - Production build
- `npm start` - Production server
- `npm run check` - TypeScript check
- `npm run db:push` - Database migrations

## Structure

```
├── client/          # React frontend
├── server/          # Express backend
├── shared/          # Shared schemas
└── database.sqlite  # SQLite database
```

## License

MIT
