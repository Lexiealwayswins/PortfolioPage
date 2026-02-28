# Full-Stack Portfolio & Personal Page

Modern, responsive personal portfolio website showcasing full stack development and creative work.

Built with a clean, performant tech stack and includes contact form, visitor tracking, admin analytics, and AI chatbot assistance.

Live Demo: [https://portfolio-page-two-ruddy.vercel.app/](https://portfolio-page-two-ruddy.vercel.app/)  

## Features

- Responsive design (mobile-first, dark/light mode)
- Smooth animations with Framer Motion
- Visitor tracking (IP, device, browser, path, session duration)
- Admin dashboard endpoints for visitor analytics (total, new, top pages, device/browser stats)
- AI-powered chatbot (WizBot) powered by Google Gemini
- Secure JWT-based admin authentication
- PostgreSQL database with Prisma ORM
- Serverless backend deployment (Vercel Functions)

## Tech Stack

### Frontend
- React + TypeScript
- Vite (build tool)
- Tailwind CSS
- Framer Motion (animations)
- React Router

### Backend
- Node.js + Express
- Prisma ORM (PostgreSQL)
- JWT authentication

### Database
- PostgreSQL (Neon Serverless / Vercel Postgres recommended)

### Deployment
- Vercel (frontend + serverless API)
- Neon.tech (PostgreSQL)

## Project Structure

```
.
├── public/                 # Static assets
├── src/                    # Frontend source
│   ├── components/
│   ├── pages/
│   ├── constants/
│   ├── types/
│   └── main.tsx
├── api/                    # Backend (Serverless Functions for Vercel)
│   ├── src/
│   │   ├── index.ts        # Express app entry
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── models/
│   ├── prisma/
│   └── package.json
├── vercel.json             # Vercel configuration
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── .env.example
```

## Getting Started (Local Development)

### Prerequisites
- Node.js 18+
- pnpm / npm / yarn
- PostgreSQL (local or Neon)
- Docker (optional – for local PostgreSQL)

### 1. Clone the repository

```bash
git clone https://github.com/Lexiealwayswins/PortfolioPage.git
cd Portfolio
```

### 2. Install dependencies

Frontend (root):
```bash
pnpm install
# or npm install
```

Backend (api folder):
```bash
cd api
pnpm install
cd ..
```

### 3. Set up environment variables

Copy `.env.example` to `.env` in root and in `/api` if needed.

```bash
cp .env.example .env
```

Fill in:

```env
# Frontend (Vite)
VITE_API_URL=http://localhost:5000
VITE_TURNSTILE_SITE_KEY=your_turnstile_site_key
VITE_GEMINI_API_KEY=your_gemini_api_key

# Backend (in api/.env or root .env)
DATABASE_URL="postgresql://postgres:password@localhost:5432/portfolio_db?schema=public"
JWT_SECRET=your_long_random_secret_here
PORT=5000
```

For Neon PostgreSQL: use the full connection string from Neon dashboard.

### 4. Set up database (PostgreSQL)

**Option A: Local PostgreSQL with Docker**

```bash
docker compose up -d
```

**Option B: Use Neon (recommended for production-like dev)**

Create free project at https://neon.tech → copy connection string → put in `DATABASE_URL`

### 5. Run Prisma migrations

```bash
cd api
npx prisma generate
npx prisma migrate dev --name init
cd ..
```

(Optional) Open Prisma Studio:
```bash
npx prisma studio
```

### 6. Start development servers

Frontend:
```bash
pnpm dev
# Runs on http://localhost:5173
```

Backend (optional – if you want to run separately):
```bash
cd api
pnpm dev   # or node --watch src/index.ts
```

For full Vercel-like experience, just run frontend – API calls will proxy through Vite if configured.

## Deployment (Vercel – Single Project)

1. Push to GitHub
2. Go to Vercel Dashboard → New Project → Import GitHub repo
3. Settings:
   - Framework Preset: Vite
   - Root Directory: leave empty
   - Build Command: leave empty
   - Output Directory: dist
4. Add Environment Variables:
   - `DATABASE_URL` = Neon / Vercel Postgres connection string
   - `JWT_SECRET` = your secret
   - `VITE_API_URL` = https://your-vercel-domain.vercel.app/api
   - Turnstile & Gemini keys if needed
5. Deploy

Vercel will automatically:
- Build frontend with Vite
- Deploy backend code in `/api` as Serverless Functions

## Security Notes

- Never commit `.env` files
- Use strong `JWT_SECRET`
- Validate & sanitize all user input
- Rate-limit contact form & visitor tracking endpoints in production

## License

MIT License

Feel free to fork, modify, and use for your own portfolio.