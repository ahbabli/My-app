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
