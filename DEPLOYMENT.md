# SamCar Rental V2 Deployment Runbook

This project is deployed with GitHub + Vercel and uses a hosted PostgreSQL
database.

## What you need

Install locally:

```txt
Git for Windows
Node.js LTS with npm
```

Optional tools:

```txt
Vercel CLI
GitHub CLI
```

Accounts and services:

```txt
GitHub account
Vercel account connected to GitHub
Hosted PostgreSQL database (recommended: Neon)
```

## Important repo facts

```txt
This repo uses Next.js 16
This repo uses Prisma 7 with prisma.config.ts
This repo currently has no prisma/migrations folder
First deployment should use prisma db push, not prisma migrate deploy
The build needs DATABASE_URL because public car pages query Prisma at build time
```

## 1. Create the hosted database

Create one hosted PostgreSQL database and copy the connection string.

Recommended connection string format:

```txt
postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require
```

Use the same database URL for:

```txt
Local setup
Vercel Production
Vercel Preview
```

## 2. Create local environment variables

Copy `.env.example` to `.env`.

Required now:

```env
DATABASE_URL=""
AUTH_SECRET=""
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

Recommended now:

```env
ADMIN_SESSION_COOKIE="samcar_admin_session"
ADMIN_SESSION_MAX_AGE_SECONDS="604800"
```

Optional until those features are live:

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

## 3. Prepare the database from your local machine

Run these commands from the project root:

```bash
npm install
npm run db:generate
npm run db:push
npm run db:seed
npm run build
```

Expected result:

```txt
db:push creates the tables in the hosted database
db:seed inserts demo cars, bookings, and admin/staff accounts
build generates Prisma Client, then succeeds after DATABASE_URL points to that same database
```

## 4. Push the project to GitHub

This repository URL is already reserved:

```txt
https://github.com/vistajunell/samcar-rental-v2.git
```

Initialize and push:

```bash
git init -b main
git add .
git commit -m "Initial deploy-ready SamCar Rental V2"
git remote add origin https://github.com/vistajunell/samcar-rental-v2.git
git push -u origin main
```

Notes:

```txt
.env must never be committed
node_modules and .next are already ignored
the local zip archive is already ignored
```

## 5. Import the repository into Vercel

In Vercel:

```txt
Add New Project
Import Git Repository
Select vistajunell/samcar-rental-v2
Keep the detected Next.js settings
```

Before clicking Deploy, add project environment variables.

## 6. Add Vercel environment variables

Required for the first deployment:

```txt
DATABASE_URL = same hosted Postgres URL used locally
AUTH_SECRET = same or another strong secret
NEXT_PUBLIC_APP_URL = your final Vercel URL
```

Recommended:

```txt
ADMIN_SESSION_COOKIE = samcar_admin_session
ADMIN_SESSION_MAX_AGE_SECONDS = 604800
```

Add them to:

```txt
Production
Preview
```

Do not add placeholder email, SMS, or Cloudinary keys unless you plan to use
those features immediately.

## 7. Deploy from Vercel

Start the first deployment from the Vercel dashboard.

If the first deployment fails:

```txt
Confirm DATABASE_URL exists in Vercel
Confirm the hosted database already has the schema from npm run db:push
Confirm the database was seeded if you expect demo content
Redeploy after fixing the environment
```

## 8. Sign in and replace demo credentials

Seeded demo accounts:

```txt
admin@samcar.example / admin
staff@samcar.example / staff
```

Treat these as temporary credentials only.

## Post-deploy checklist

Verify:

```txt
/ loads
/cars loads and shows seeded cars
/cars/[slug] opens a details page
/book loads and shows the car selector
/admin/login accepts the seeded admin account
A new commit to main creates a Vercel production deployment
No secrets were pushed to GitHub
```

## References

```txt
GitHub existing project push guide:
https://docs.github.com/en/github/importing-your-projects-to-github/adding-an-existing-project-to-github-using-the-command-line

Vercel import guide:
https://vercel.com/docs/getting-started-with-vercel/import

Vercel environment variables:
https://vercel.com/docs/environment-variables

Vercel builds:
https://vercel.com/docs/builds
```
