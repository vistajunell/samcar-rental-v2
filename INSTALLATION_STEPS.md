# INSTALLATION_STEPS.md - SamCar Rental V2 Setup

## 1. Install local requirements

Required:

```txt
Git for Windows
Node.js LTS with npm
```

Optional:

```txt
Vercel CLI
GitHub CLI
```

## 2. Install project dependencies

From the project root:

```bash
npm install
```

The required package set is already defined in `package.json`.

## 3. Create local environment variables

Copy `.env.example` to `.env`.

Required for local development:

```env
DATABASE_URL=""
AUTH_SECRET=""
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

Recommended:

```env
ADMIN_SESSION_COOKIE="samcar_admin_session"
ADMIN_SESSION_MAX_AGE_SECONDS="604800"
```

Optional until those integrations are used:

```env
RESEND_API_KEY=""
RESEND_FROM_EMAIL=""
SMS_PROVIDER="semaphore"
SEMAPHORE_API_KEY=""
SEMAPHORE_SENDER_NAME="SAMCAR"
TWILIO_ACCOUNT_SID=""
TWILIO_AUTH_TOKEN=""
TWILIO_FROM_NUMBER=""
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
CLOUDINARY_UPLOAD_PRESET_PRIVATE="samcar_private"
CLOUDINARY_UPLOAD_PRESET_PUBLIC="samcar_public"
```

Generate `AUTH_SECRET` with:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

## 4. Prepare Prisma

This project uses Prisma 7 with `prisma.config.ts`.

Use the hosted PostgreSQL database from your `.env` file and run:

```bash
npm run db:push
npm run db:seed
```

Notes:

```txt
This repo currently has no prisma/migrations folder
Use db:push for the first environment setup
Use db:seed to load demo cars, bookings, and admin accounts
npm run build also runs prisma generate before next build
```

## 5. Validate the production build locally

Run:

```bash
npm run build
```

Important:

```txt
The build needs DATABASE_URL to be set
Public car pages query Prisma during build
```

## 6. Run the development server

Run:

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```

## 7. Deploy

For the production deployment flow, use [DEPLOYMENT.md](./DEPLOYMENT.md).

## 8. Safety rules

Do not:

```txt
Use the old production database
Overwrite the old Vercel project
Expose customer documents publicly
Commit .env or secrets to GitHub
Hardcode API keys
```
