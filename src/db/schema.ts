export const schema = `
  CREATE TABLE IF NOT EXISTS users (
    id          TEXT PRIMARY KEY,
    email       TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role        TEXT NOT NULL DEFAULT 'user'
                  CHECK(role IN ('admin', 'host', 'user')),
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS experiences (
    id          TEXT PRIMARY KEY,
    title       TEXT NOT NULL,
    description TEXT NOT NULL,
    location    TEXT NOT NULL,
    price       INTEGER NOT NULL CHECK(price >= 0),
    start_time  DATETIME NOT NULL,
    created_by  TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status      TEXT NOT NULL DEFAULT 'draft'
                  CHECK(status IN ('draft', 'published', 'blocked')),
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS bookings (
    id            TEXT PRIMARY KEY,
    experience_id TEXT NOT NULL REFERENCES experiences(id) ON DELETE CASCADE,
    user_id       TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    seats         INTEGER NOT NULL CHECK(seats >= 1),
    status        TEXT NOT NULL DEFAULT 'confirmed'
                    CHECK(status IN ('confirmed', 'cancelled')),
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, experience_id)
  );

  -- Index 1: Speeds up filtering by location and sorting/filtering by start_time in GET /experiences
  CREATE INDEX IF NOT EXISTS idx_experiences_location_start_time
    ON experiences(location, start_time);

  -- Index 2: Speeds up duplicate booking checks and user booking lookups
  CREATE INDEX IF NOT EXISTS idx_bookings_user_experience
    ON bookings(user_id, experience_id);
`;