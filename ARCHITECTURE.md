# Tumerasafar architecture

## Product structure

`src/app` owns SEO-friendly App Router pages, route handlers, loading/error states and public dashboard surfaces. `src/components` contains interactive UI islands; `src/lib` contains catalogue, database and model adapters. `server/` is a standalone Express deployment option for integrations that require a separate Node API process.

## Data model

- **User**: name, email, passwordHash, role (`customer`, `vendor`, `admin`), profile, status.
- **Vendor**: user reference, business details, service categories, GST/KYC state, approval status.
- **Destination**: title, slug, type, highlights, hero media, SEO metadata.
- **Package**: destination references, itinerary days, price bands, inclusions, exclusions, departures, media, publish status.
- **Enquiry**: traveller information, package/destination reference, travellers, travel window, source, lead status and notes.
- **Booking**: customer/package/vendor references, traveller snapshot, payment state, booking status and vouchers.

## API boundary

The Next route handler at `POST /api/enquiries` validates inputs with Zod and writes via Mongoose. The standalone Express API mirrors this under `/api/enquiries`, adds Helmet, CORS and rate limiting, and is ready for separate deployment. New resource modules should follow `routes → validation → service/model → response` and enforce JWT role middleware for vendor/admin mutations.

## Environment & security

Copy `.env.example` to `.env.local`; never commit production secrets. Use a long `JWT_SECRET`, a least-privilege MongoDB database user and a restricted `WEB_ORIGIN`. Authentication routes should issue short-lived, secure HTTP-only cookies; passwords must be hashed with bcrypt before persistence.
