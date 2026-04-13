# 🦏 Kifaru Real Estate & Building Co. Ltd — Full Stack Website

## Project Structure

```
kifaru/
├── kifaru_client/          # Next.js 14 frontend
│   ├── app/
│   │   ├── page.tsx        # Homepage with video hero
│   │   ├── properties/     # Property listing + detail pages
│   │   ├── services/       # Services page
│   │   ├── about/          # About page
│   │   ├── agents/         # Agents page
│   │   ├── contact/        # Contact + booking form
│   │   └── admin/          # Full CMS admin panel
│   ├── components/
│   │   ├── layout/         # Navbar, Footer
│   │   └── ui/             # PropertyCard, BookingForm
│   └── lib/
│       └── api.ts          # All client↔server API calls
│
├── kifaru_server/          # Express.js backend
│   ├── src/
│   │   ├── index.js        # Server entry point
│   │   ├── db.js           # LowDB flat-file database
│   │   ├── middleware/
│   │   │   ├── auth.js     # JWT authentication
│   │   │   └── upload.js   # Multer file uploads
│   │   └── routes/
│   │       ├── auth.js       # POST /api/auth/login
│   │       ├── properties.js # CRUD + filtering
│   │       ├── bookings.js   # Public submit + admin manage
│   │       ├── services.js   # CRUD
│   │       ├── projects.js   # CRUD
│   │       ├── testimonials.js
│   │       ├── floorplans.js
│   │       ├── agents.js     # With photo upload
│   │       └── settings.js   # Homepage settings
│   └── .env
│
├── uploads/                # Uploaded images + video (auto-created)
├── data/                   # db.json flat file (auto-created)
└── README.md
```

---

## Quick Start

### 1. Start the Backend

```bash
cd kifaru_server
npm install
npm run dev
# Server runs at http://localhost:5000
```

### 2. Start the Frontend

```bash
cd kifaru_client
npm install
npm run dev
# App runs at http://localhost:3000
```

---

## Admin Panel

Visit: **http://localhost:3000/admin**

**Default credentials:**
- Username: `admin`
- Password: `kifaru2025`

> Change these in `kifaru_server/.env`

### Admin Features
- 📊 **Overview** — Live dashboard stats + recent bookings
- 📋 **Bookings** — All visitor inquiries, mark as contacted, delete
- 🏗️ **Properties** — Full CRUD with image upload, featured flag, filters
- ⚙️ **Services** — Add/edit/delete service offerings
- 📦 **Projects** — Manage completed/ongoing projects
- ⭐ **Testimonials** — Client reviews management
- 🏠 **Floor Plans** — Property packages with pricing
- 👥 **Agents** — Team management with photo upload
- 🎨 **Homepage** — Live edit hero text, stats bar

---

## API Endpoints

### Public
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Admin login → JWT token |
| GET | `/api/properties` | List properties (filter by type, status, q, featured) |
| GET | `/api/properties/:id` | Single property |
| POST | `/api/bookings` | Submit a booking (public form) |
| GET | `/api/services` | List services |
| GET | `/api/projects` | List projects |
| GET | `/api/testimonials` | List testimonials |
| GET | `/api/floorplans` | List floor plans |
| GET | `/api/agents` | List agents |
| GET | `/api/settings/homepage` | Homepage settings |

### Admin (requires Bearer JWT token)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/bookings` | All bookings |
| PATCH | `/api/bookings/:id` | Update booking status |
| DELETE | `/api/bookings/:id` | Delete booking |
| POST | `/api/properties` | Create property (multipart/form-data) |
| PUT | `/api/properties/:id` | Update property |
| DELETE | `/api/properties/:id` | Delete property |
| POST/PUT/DELETE | `/api/services/:id` | Services CRUD |
| POST/PUT/DELETE | `/api/projects/:id` | Projects CRUD |
| POST/PUT/DELETE | `/api/testimonials/:id` | Testimonials CRUD |
| POST/PUT/DELETE | `/api/floorplans/:id` | Floor plans CRUD |
| POST/PUT/DELETE | `/api/agents/:id` | Agents CRUD (with photo) |
| PUT | `/api/settings/homepage` | Update homepage settings |

---

## Adding the Hero Video

Place your video file at:
```
kifaru/uploads/hero_video.mp4
```

The homepage will automatically load it as the background video.

---

## Environment Variables

### `kifaru_server/.env`
```
PORT=5000
JWT_SECRET=change_this_in_production
ADMIN_USERNAME=admin
ADMIN_PASSWORD=kifaru2025
```

### `kifaru_client/.env.local`
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS |
| Components | Lucide React icons |
| Backend | Node.js, Express.js |
| Database | LowDB (JSON flat file) |
| Auth | JWT (jsonwebtoken + bcryptjs) |
| File Uploads | Multer |
| API Client | Axios |

---

## Production Deployment

1. Change `JWT_SECRET` to a strong random string
2. Change admin password in `.env`
3. Set `NEXT_PUBLIC_API_URL` to your production server URL
4. Run `npm run build` in `kifaru_client/`
5. Use PM2 or similar to keep the server running

---

*Tunajenga kwa gharama nafuu — Kifaru Building Company Limited*
