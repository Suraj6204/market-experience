# Experiences Marketplace API

Node.js + Express + TypeScript + SQLite backend with Auth + RBAC.

---

## Setup
```bash
git clone <repo-url>
cd experiences-marketplace
npm install
cp .env.example .env   # fill in JWT_SECRET
npm run dev
```

## Environment Variables

| Variable       | Description                        | Default              |
|----------------|------------------------------------|----------------------|
| `PORT`         | Server port                        | `3000`               |
| `DATABASE_URL` | SQLite file path                   | `./database.sqlite`  |
| `JWT_SECRET`   | Secret for signing JWTs (required) | —                    |

## DB Setup

Schema is auto-applied on startup via `src/db/schema.ts`. No migrations needed for SQLite.

### Indexes Added

| Index                                         | Reason                                                        |
|-----------------------------------------------|---------------------------------------------------------------|
| `experiences(location, start_time)`           | Speeds up `GET /experiences` filtering by location + time     |
| `bookings(user_id, experience_id)`            | Speeds up duplicate booking checks per user per experience    |

---

## How to Run
```bash
npm run dev      # development with hot reload
npm run build    # compile TypeScript
npm start        # run compiled output
```

---

## Example curl Requests

### Signup
```bash
curl -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"host@test.com","password":"secret123","role":"host"}'
```

### Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"host@test.com","password":"secret123"}'
```

### Create Experience (host/admin)
```bash
curl -X POST http://localhost:3000/experiences \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Sunset Trek","description":"A beautiful hike","location":"Manali","price":1500,"start_time":"2025-06-01T06:00:00.000Z"}'
```

### Publish Experience (owner or admin)
```bash
curl -X PATCH http://localhost:3000/experiences/<ID>/publish \
  -H "Authorization: Bearer <TOKEN>"
```

### Block Experience (admin only)
```bash
curl -X PATCH http://localhost:3000/experiences/<ID>/block \
  -H "Authorization: Bearer <ADMIN_TOKEN>"
```

### List Published Experiences (public)
```bash
curl "http://localhost:3000/experiences?location=Manali&sort=asc&page=1&limit=10"
```

### Book Experience (user only)
```bash
curl -X POST http://localhost:3000/experiences/<ID>/book \
  -H "Authorization: Bearer <USER_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"seats":2}'
```

---

## RBAC Rules Implemented

- `admin` role **cannot** be self-assigned at signup — only `user` or `host` allowed
- `POST /experiences` — restricted to **host** and **admin** only
- `PATCH /experiences/:id/publish` — restricted to the **owner host** or **admin**
- `PATCH /experiences/:id/block` — restricted to **admin** only
- `POST /experiences/:id/book` — restricted to **user** and **admin**; hosts cannot book their own experiences
- `GET /experiences` — **public**, no auth required; returns only `published` experiences
- All protected routes return `401` if no/invalid JWT and `403` if insufficient role

## AI Usage

Used Claude (Anthropic) to scaffold boilerplate, middleware patterns, and README structure. All business logic, RBAC rules, and DB schema decisions were reviewed and adjusted manually.
