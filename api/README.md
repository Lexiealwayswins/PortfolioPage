
# Portfolio Backend API

This is the backend server for the EliTechWiz portfolio website. It handles:

- Visitor tracking (IP, device, browser, OS, session, page views)
- Contact form submissions with status management
- Admin authentication & role-based access control (main admin + regular admins)
- JWT-based authentication
- PostgreSQL database with Prisma ORM (MongoDB fallback supported but not recommended)

Current database: **PostgreSQL** (recommended)

## Tech Stack

- Node.js + Express
- Prisma ORM (PostgreSQL)
- JWT for authentication
- bcrypt for password hashing
- Docker (for local PostgreSQL)

## Prerequisites

- Node.js ≥ 18
- npm / yarn / pnpm
- Docker Desktop (recommended for PostgreSQL)
- PostgreSQL (via Docker or local install)

## Quick Setup (Recommended: Docker + PostgreSQL)

### 1. Start PostgreSQL with Docker

Create `docker-compose.yml` in the backend root:

```yaml
version: '3.9'

services:
  postgres:
    image: postgres:16-alpine
    container_name: your_container_name
    restart: always
    environment:
      POSTGRES_USER: your_username
      POSTGRES_PASSWORD: your_password
      POSTGRES_DB: your_db_name
    ports:
      - "your_port:5432"                            
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
```

Start it:

```bash
docker compose up -d
```

### 2. Install dependencies & run Prisma migrations

```bash
cd server                  # or wherever your backend is
npm install                # or yarn / pnpm install

# Generate Prisma Client
npx prisma generate

# Create tables & apply initial migration
npx prisma migrate dev --name init
```

(Optional) Open Prisma Studio to view data:

```bash
npx prisma studio
# → http://localhost:5555
```

### 3. Start the server

```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/login`
  - Body: `{ "email": "admin@example.com", "password": "yourpass" }`
  - Response: `{ token, user: { id, email, role } }`
  - Used to log in as admin and get a JWT token

### Contact Form
- `POST /api/contact/submit`
  - Body: `{ name, email, phone?, subject, message, turnstileToken }`
  - Public endpoint (no token required)
  - Saves message to `contact_messages` table and records IP + User-Agent

### Visitor Tracking & Analytics
- `POST /api/visitors/track`
  - Body: `{ path?, referer?, sessionId?, duration? }`
  - Public endpoint
  - Records visitor info to `visitors` table
- `GET /api/visitors/analytics?period=7d`
  - Requires JWT (Header: `Authorization: Bearer <token>`)
  - Returns stats (total visitors, new visitors, top pages, device/browser breakdown, etc.)
- `GET /api/visitors/recent?limit=50`
  - Requires JWT
  - Returns list of recent visitors

## How to Create the First Admin Account

You must manually create the first admin in the database:

1. Run Prisma Studio:
   ```bash
   npx prisma studio
   ```

2. Open http://localhost:5555 in your browser
3. Go to the `Admin` model → Create new record

   Example values:
   - email: admin@example.com
   - password: (bcrypt hashed password — see below)
   - name: Admin User
   - role: admin (or "main" if you plan to add role distinction later)
   - isActive: true

4. To generate a bcrypt hashed password (run this once in Node console or a temp script):

   ```js
   const bcrypt = require('bcryptjs');
   console.log(bcrypt.hashSync('your_password', 10));
   ```

   Copy the output hash and paste it into the `password` field in Prisma Studio.

Now you can log in with that email/password via `/api/auth/login`.

## Security Notes
- Admin passwords are stored as bcrypt hashes
- JWT uses HS256 signing — change `JWT_SECRET` to a strong random value in production
- Use HTTPS in production
- Consider adding rate limiting and better error handling later