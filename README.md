# SpeedBazaar V6.5 Live-Ready

This package is a stronger local scaffold with **live-ready integration points** for:
- Razorpay payment order creation and signature verification
- Google Maps reverse geocoding and autocomplete proxy routes
- Cloudinary signed uploads
- SMTP email notifications
- Twilio Verify OTP send/check
- Route middleware protection

## Important honesty
This package is **not magically live by itself**. To make those integrations work in production, you must add real provider keys in `.env.local` and enable those services in your provider dashboards.

## Run locally
```bash
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

## Copy env
Create `.env.local` from `.env.example` and fill in the keys you actually have.

## What is truly working immediately
- local auth and session cookie
- seeded products
- add to cart
- cart quantity updates
- address save
- order creation
- local payment demo mode
- seller/admin stats scaffolds
- route middleware redirect to `/auth`

## What becomes live after adding keys
- Razorpay payment popup and signature verification
- reverse geocoding and place autocomplete with Google Maps
- Cloudinary signed upload flow
- SMTP email sending
- Twilio OTP send/check

## Main live routes
- `POST /api/payments/create-order`
- `POST /api/verify-payment`
- `GET /api/maps/reverse-geocode?lat=..&lng=..`
- `GET /api/maps/place-autocomplete?input=...`
- `POST /api/uploads/sign-cloudinary`
- `POST /api/notifications/email`
- `POST /api/auth/request-otp`
- `POST /api/auth/verify-otp`

## Reality check
I included the code paths, but I did not verify them against your personal Razorpay / Google / Cloudinary / SMTP / Twilio accounts because those credentials are not present here.
