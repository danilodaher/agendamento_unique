# Design Guidelines: Unique Booking Platform

## Design Approach

**Selected Approach:** Reference-based hybrid drawing from Airbnb's booking flow UX, Calendly's scheduling clarity, and Stripe's form validation patterns, with a bold, modern sports facility aesthetic.

**Key Principles:**
- Progressive disclosure through clear 4-step wizard
- High-contrast availability indicators for instant comprehension
- Trust-building through transparency (pricing, policies, confirmations)
- Mobile-first responsive design with touch-friendly targets

---

## Typography

**Font Stack:**
- **Primary:** 'Inter' (Google Fonts) - headings, UI elements, buttons
- **Secondary:** 'Inter' - body text, forms, descriptions

**Hierarchy:**
- Hero headline: 56px/64px, font-weight 800, tight letter-spacing (-0.02em)
- Page titles: 40px/48px, font-weight 700
- Section headers: 32px/40px, font-weight 600
- Card titles: 20px/28px, font-weight 600
- Body text: 16px/24px, font-weight 400
- Captions/labels: 14px/20px, font-weight 500
- Button text: 16px/24px, font-weight 600, uppercase tracking (0.05em)

---

## Layout System

**Spacing Scale:** Tailwind units of 2, 4, 6, 8, 12, 16, 20, 24
- Component padding: p-6 to p-8
- Section spacing: py-16 to py-24 (desktop), py-12 (mobile)
- Card gaps: gap-6 to gap-8
- Form field spacing: space-y-6

**Container Strategy:**
- Homepage: Full-width hero (w-full), content sections max-w-7xl mx-auto px-6
- Booking wizard: max-w-5xl mx-auto with progress indicator
- Forms: max-w-2xl centered with side summary panel on desktop
- Confirmation page: max-w-4xl centered

---

## Component Library

### Navigation
Fixed top navigation with white background, subtle shadow, logo left, menu center (Sobre, Contato), "AGENDAR" CTA button right with purple gradient background

### Hero Section (Homepage)
Full-viewport hero (min-h-screen) with large hero image showing vibrant sports facility, centered content overlay with white text, headline + subheadline + primary CTA button ("AGENDAR AGORA"), subtle scroll indicator at bottom

### Service Type Cards (Step 1)
Three equal-width cards in horizontal grid, each with icon, title, short description, default state: white background with gray border, selected state: purple gradient background (#667eea to #764ba2) with white text, scale transform on hover

### Date Picker (Step 1)
Inline calendar component below selected card, disabled past dates in muted gray, available dates with hover state, selected date with purple background, today highlighted with purple border

### Time Slot Grid (Step 2)
Responsive grid (grid-cols-2 md:grid-cols-3 lg:grid-cols-4), each slot as card showing time range, available slots: green background (#10b981) with white text, occupied slots: red background (#ef4444) with white text and disabled state, selected slots: purple border (4px) with checkmark icon

### Form Fields (Step 3)
Stacked form layout with floating labels, default border gray-300, focus state: purple border with shadow, valid state: green left border (4px), invalid state: red left border (4px) with error message below, phone field with auto-formatting mask display

### Summary Panel (Steps 2-3)
Sticky sidebar (desktop) or bottom sheet (mobile), white card with shadow, itemized list showing: service type with icon, selected date, time slots list, price breakdown, total in large bold text, dividers between sections

### Progress Indicator
4-step horizontal stepper at top of booking wizard, completed steps: purple with checkmark, current step: purple with pulse animation, future steps: gray outline, connecting lines between steps

### Confirmation Card (Step 4)
Large centered card with success icon (green checkmark circle), booking number in monospace font (UNQ-XXXXX), all details in organized sections with icons, action buttons grid: "Add to Google Calendar", "Add to Apple Calendar", "Add to Outlook", "Cancelar Reserva" (red outline), "Voltar ao Início" (purple)

### Toast Notifications
Fixed bottom-right position, colored left border (success: green, error: red, info: blue), auto-dismiss after 5 seconds, slide-in animation

### Modal Dialogs
Centered overlay with backdrop blur, white card with rounded corners (16px), close X button top-right, conflict modal shows alternative time slots as clickable cards

### Cancellation Page
Hero section with warning color scheme, booking details card, policy notice with 2-hour rule, reason textarea (optional but visible), red confirmation button, confirmation dialog before final action

---

## Images

**Hero Image (Homepage):**
Wide-angle photograph of modern sports facility with vibrant court lighting, people playing in background (slightly blurred), warm and inviting atmosphere, aspect ratio 16:9, positioned as background with dark overlay (opacity 40%) for text readability

**Service Type Cards:**
Icon-based illustrations (no photos) - use Heroicons CDN:
- Quadra: Court/squares icon in purple
- Evento: Calendar-days icon in purple  
- Festa: Gift/celebration icon in purple

**Confirmation Page:**
Success illustration or celebratory graphic at top of card (abstract geometric shapes in purple gradient)

**About/Contact Pages:**
Additional facility photos showcasing different areas, team photos if applicable, placed within content sections using grid layouts

---

## Interaction Patterns

**Button States:**
Primary buttons with purple gradient, white text, hover: slight scale (1.02) with deeper shadow, disabled: gray background with reduced opacity
Secondary buttons with white background, purple border, purple text

**Loading States:**
Spinner overlay with purple accent color for API calls, skeleton loaders for time slot grid while fetching availability

**Validation Feedback:**
Real-time validation on blur, success/error states with color-coded borders and icons, inline error messages below fields

**Responsive Behavior:**
- Desktop (lg): Side-by-side layouts, sticky summary panel
- Tablet (md): Stacked with maintained spacing, collapsible summary
- Mobile (base): Single column, bottom sheet for summary, larger touch targets (min 48px height)