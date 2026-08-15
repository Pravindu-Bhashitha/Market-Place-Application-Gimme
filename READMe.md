# Gimme Marketplace — Technical Assessment (GIM-008)

A small full-stack marketplace app: browse listings, view listing details, create new listings, and (as a stretch goal) authenticate with JWT so only logged-in users can create or delete listings.

- **Frontend**: React + Vite + TypeScript, React-Bootstrap, React Router, Axios
- **Backend**: Node.js + Express + TypeScript, layered as Route → Controller → Service → Repository
- **Persistence**: SQLite (`better-sqlite3`)
- **Auth**: JWT (register/login), bcrypt-hashed passwords, protected `POST`/`DELETE` listing routes
- **Tests**: Jest + Supertest covering the listings and auth APIs

## Setup

Requires Node 18+.

### 1. Backend

```bash
cd Backend
npm install
```

Create `Backend/.env`:

```
PORT=3000
JWT_SECRET=iU8Sov5yjonaPF2OC5J7Ly7GGDGcZ58Uyf4aDNO0DO2 
JWT_EXPIRES_IN=7d
```

Seed the database, then start the API:

```bash
npm run seed     # creates dummy data/marketplace.db and loads ~30 sample listings
npm run dev      # starts the API on http://localhost:3000
```

To reset data at any time: delete `Backend/data/marketplace.db` and re-run `npm run seed`.

### 2. Frontend

```bash
cd Frontend
npm install
```

Create `Frontend/.env`:

```
VITE_API_BASE_URL=http://localhost:3000/api
```

```bash
npm run dev       # starts the Vite dev server on http://localhost:5173
```

### 3. Running tests

```bash
cd Backend
npm test
```

Tests run against an in-memory SQLite database (`NODE_ENV=test` switches `db.ts` to `:memory:`), so they never touch real seeded data and run fully isolated from the dev server.

## API documentation

Base URL: `/api`. All error responses share a consistent shape:

```json
{ "error": { "statusCode": 404, "message": "Human-readable message", "description": "Optional extra detail" } }
```

### Listings

#### `GET /api/listings`

Paginated, filterable, sortable list. Public — no auth required.

| Query param | Type   | Notes                                       |
|-------------|--------|----------------------------------------------|
| `search`    | string | Case-insensitive match against title/description |
| `category`  | string | Exact match against category                 |
| `minPrice`  | number | Inclusive lower bound                         |
| `maxPrice`  | number | Inclusive upper bound                         |
| `sortBy`    | string | `price` \| `date` (default `date`)             |
| `sortOrder` | string | `asc` \| `desc` (default `desc`)               |
| `page`      | number | 1-indexed, default `1`                        |
| `pageSize`  | number | default `12`, max `50`                        |

Response — `200`:

```json
{
  "data": [ { "id": 1, "title": "...", "price": 199.99, "...": "..." } ],
  "pagination": { "page": 1, "pageSize": 12, "total": 30, "totalPages": 3 }
}
```

#### `GET /api/listings/:id`

Returns the listing directly, plus up to 4 `similarListings` from the same category. Public.

- `200` → the listing object (unwrapped, no `data` envelope):
  ```json
  { "id": 1, "title": "...", "...": "...", "similarListings": [ { "id": 2, "...": "..." } ] }
  ```
- `400` → non-numeric/invalid id
- `404` → listing not found

#### `POST /api/listings` — **requires authentication**

Header: `Authorization: Bearer <token>`

Body:

```json
{
  "title": "string, required, 3-100 chars",
  "category": "string, required, one of the seeded categories",
  "price": "number, required, > 0",
  "condition": "'new' | 'like-new' | 'good' | 'fair', required",
  "description": "string, required, 10-2000 chars",
  "imageUrl": "string, optional, must be a valid URL if provided"
}
```

- `201` → the created listing object (unwrapped)
- `400` → validation failed, `error.description` lists all problems found
- `401` → missing/invalid/expired token

#### `DELETE /api/listings/:id` — **requires authentication**

Header: `Authorization: Bearer <token>`

- `204` → deleted successfully, no body
- `401` → missing/invalid/expired token
- `404` → listing not found

### Auth

#### `POST /api/auth/register`

Body: `{ "email": "string", "password": "string, min 8 chars" }`

- `201` → `{ "token": "...", "user": { "id": 1, "email": "..." } }`
- `400` → validation failed (bad email format, weak password)
- `409` → an account with this email already exists

#### `POST /api/auth/login`

Body: `{ "email": "string", "password": "string" }`

- `200` → `{ "token": "...", "user": { "id": 1, "email": "..." } }`
- `401` → invalid email or password (deliberately the same message for both cases, to avoid leaking which emails are registered)

## Decisions & trade-offs

- **SQLite over a JSON file**: gives real filtering/sorting/pagination via SQL instead of loading the whole dataset into memory on every request, at almost no extra setup cost (`better-sqlite3`, no separate server process) & much familiar with sql-lite. 
- **No ORM**: the schema is two small tables (`listings`, `users`), so raw parameterized SQL in the repository layer is easier to read and audit than adding ORM like Prisma for this scope.
- **Layered backend (Route → Controller → Service → Repository)**: chosen for clear separation of concerns — controllers only translate HTTP ⇄ data, services hold business rules (pagination defaults, "similar items" logic, duplicate-email checks), repositories only run SQL. Makes each layer independently testable and easy to reason about.
- **Response shape**: single-resource endpoints (`GET /listings/:id`, `POST /listings`, auth endpoints) return the resource directly with no `{ data: ... }` wrapper; only the list endpoint (`GET /listings`) wraps its results, since it also needs to carry `pagination` metadata alongside the array. This was a deliberate simplification after initially wrapping everything — fewer levels of nesting on the client, and the wrapper is reserved for cases where there's genuinely more than one thing to return.
- **State management (frontend)**: no external state library (Redux, Zustand, etc.) — auth state is global but kept minimal via React's built-in Context API (AuthContext), while page-specific data (the listings grid, filters, pagination) stays local to each page via a small custom hook (useListings) built on useState/useEffect. This keeps the one genuinely cross-cutting piece of state (who's logged in) globally accessible without introducing a heavier dependency for data that's naturally page-scoped.
- **Styling**: React-Bootstrap, to move quickly with accessible, responsive components (grid, forms, modals, navbar) without hand-rolling CSS for this scope.
- **Search debounce**: the search input is debounced (350ms) before it flows into the API query, so typing doesn't fire a request per keystroke; category/price/sort filters stay immediate since they're discrete selections, not typed input.
- **Image loading**: listing images are lazy-loaded (`loading="lazy"`) and requested from Unsplash at a constrained width, to keep the grid responsive rather than downloading full-resolution images for 180px thumbnails.
- **Auth storage**: the JWT and user info are persisted to `localStorage` on the client for simplicity. This is a known trade-off — `localStorage` is readable by any script on the page, so it's vulnerable to XSS in a way an httpOnly cookie wouldn't be. Would switch to an httpOnly cookie + refresh-token or In Memory token flow for production.
- **Password confirmation**: `confirmPassword` is validated client-side only (a UX safety net against typos) and never sent to the API — the backend only ever receives one `password` field, which is all it needs.
- **Login error messages**: deliberately generic ("Invalid email or password") whether the email doesn't exist or the password is wrong, to avoid letting an attacker enumerate registered emails.
- **Lazy-loaded routes**: pages are code-split with `React.lazy`/`Suspense`. The performance improvement is there.
- **Tests**: Jest/Supertest cover the listings API (list/filter/search/pagination, get-by-id with similar items, protected create/delete, validation) and the auth API (register, duplicate email, weak password, login success/failure). Tests run against an isolated in-memory SQLite instance via `NODE_ENV=test`, so they never touch seeded/dev data. Frontend component tests were left out of scope — the brief's stretch goal specifically calls out API tests, and the assessment explicitly rewards not gold-plating.

## Scripts reference

**Backend** (`Backend/package.json`)
- `npm run dev` — ts-node-dev with reload
- `npm run build` / `npm start` — compile then run
- `npm run seed` — (re)seed the database
- `npm test` — Jest/Supertest suite

**Frontend** (`Frontend/package.json`)
- `npm run dev` — Vite dev server
- `npm run build` — type-check + production build
- `npm run preview` — preview the production build