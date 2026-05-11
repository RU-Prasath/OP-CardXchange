# Skyrise Build & Interiors — Full Stack Website

Premium MERN stack website for Skyrise Build & Interiors.

## Quick Start

### 1. Backend Setup

```bash
cd backend
npm install
```

Edit `.env` with your actual credentials:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key_here
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM=noreply@skyrisebuild.com
ADMIN_EMAIL=admin@skyrisebuild.com
CLIENT_URL=http://localhost:5173
```

Seed the database (creates admin account + default services):
```bash
npm run seed
```

Start backend:
```bash
npm run dev
```

Backend runs on: http://localhost:5000

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: http://localhost:5173

## Default Admin Credentials

After running `npm run seed`:
- **Email:** admin@skyrisebuild.com  
- **Password:** Admin@123  
- **Admin Panel:** http://localhost:5173/admin

## Project Structure

```
skyrise/
├── backend/
│   ├── src/
│   │   ├── config/       # DB & email config
│   │   ├── controllers/  # Route controllers
│   │   ├── middleware/   # Auth, upload, error handling
│   │   ├── models/       # Mongoose schemas
│   │   ├── routes/       # Express routes
│   │   └── utils/        # Email utilities, seed
│   ├── uploads/          # Local image storage
│   │   ├── projects/
│   │   ├── services/
│   │   ├── gallery/
│   │   ├── team/
│   │   ├── hero/
│   │   └── testimonials/
│   └── server.js
│
└── frontend/
    └── src/
        ├── admin/        # Admin panel
        ├── components/   # Reusable UI components
        ├── pages/        # Public pages
        ├── services/     # API layer
        ├── store/        # Auth store
        ├── hooks/        # Custom hooks
        └── utils/        # Helper functions
```

## Public Pages

| Route | Page |
|-------|------|
| `/` | Home |
| `/about` | About Us |
| `/services` | Services |
| `/works` | Our Works |
| `/contact` | Contact |

## Admin Pages

| Route | Module |
|-------|--------|
| `/admin` | Dashboard |
| `/admin/leads` | Lead Management |
| `/admin/enquiries` | Contact Enquiries |
| `/admin/projects` | Projects CMS |
| `/admin/services` | Services CMS |
| `/admin/testimonials` | Testimonials |
| `/admin/team` | Team Members |
| `/admin/gallery` | Media Gallery |
| `/admin/settings` | Site Settings |

## API Endpoints

### Public
- `GET /api/services` — List services
- `GET /api/projects?category=completed` — List projects
- `GET /api/testimonials` — List testimonials
- `GET /api/settings` — Site settings
- `POST /api/contact` — Submit contact form
- `POST /api/leads` — Submit lead (popup)

### Admin (Protected — Bearer token)
- `POST /api/admin/login` — Login
- `GET /api/admin/dashboard` — Stats
- `CRUD /api/projects` — Manage projects
- `CRUD /api/services` — Manage services
- `CRUD /api/testimonials` — Manage testimonials
- `CRUD /api/team` — Manage team
- `CRUD /api/gallery` — Manage gallery
- `GET /api/leads/export` — Export leads CSV

## Tech Stack

**Frontend:** React + Vite + Tailwind CSS + Framer Motion + TanStack Query

**Backend:** Node.js + Express + MongoDB + Mongoose + JWT + Nodemailer + Multer

**Storage:** Local filesystem (`backend/uploads/`)
