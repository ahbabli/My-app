# Ahmed Albabli Portfolio App

The project is split into two independent apps:

- `app-backend`: Laravel API backend
- `app-frontend`: React + Tailwind CSS frontend

Run the backend:

```bash
cd app-backend
php artisan migrate --seed
php artisan serve
```

Run the frontend:

```bash
cd app-frontend
npm install
npm run dev
```

The frontend reads profile data from `VITE_API_URL`, defaulting to `http://127.0.0.1:8000`.

Admin access:

```text
URL: http://127.0.0.1:5173/admin
Default password: admin123
```

Change the admin password/token in `app-backend/.env`:

```text
ADMIN_PASSWORD=your-password
ADMIN_TOKEN=your-long-random-token
```

## Supabase Postgres

This app should use Supabase as the Laravel database, not directly from React.
Keep the database password private and never commit it.

Your Supabase project:

```text
Project URL: https://yzuwayekcsszgztymrew.supabase.co
Project ref: yzuwayekcsszgztymrew
Database host: db.yzuwayekcsszgztymrew.supabase.co
Database name: postgres
Database user: postgres
```

For local Laravel, put this in `app-backend/.env`:

```text
DB_CONNECTION=pgsql
DB_URL=postgresql://postgres.yzuwayekcsszgztymrew:YOUR-PASSWORD@aws-0-eu-west-1.pooler.supabase.com:5432/postgres
DB_SSLMODE=require
```

Then run:

```bash
cd app-backend
php artisan config:clear
php artisan migrate --seed
```

For production, set the same `DB_CONNECTION`, `DB_URL`, and `DB_SSLMODE`
variables on the backend host. The frontend only needs:

```text
VITE_API_URL=https://your-backend-url
```

Supabase CLI is optional for this Laravel app. If you want to link the repo to
the Supabase project for CLI workflows:

```bash
supabase login
supabase init
supabase link --project-ref yzuwayekcsszgztymrew
```

Project API endpoints:

```text
GET    /api/projects
GET    /api/projects/{slug}
POST   /api/admin/login
PUT    /api/profile          protected admin route
POST   /api/projects         protected admin route
PUT    /api/projects/{slug}  protected admin route
PATCH  /api/projects/{slug}  protected admin route
DELETE /api/projects/{slug}  protected admin route
```

Required fields when creating a project: `title`, `category`, `excerpt`, `year`, and `tags`.
