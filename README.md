# Ahmed Albabli Portfolio App

The deployed portfolio is a React-only static app:

- `app-frontend`: React + Tailwind CSS portfolio

Run the frontend:

```bash
cd app-frontend
npm install
npm run dev
```

Build for production:

```bash
cd app-frontend
npm run build
```

Deploy on Vercel or Netlify:

```text
Root directory: app-frontend
Build command: npm run build
Output directory: dist
```

The app uses local React data plus browser `localStorage`. It does not need
Render, Laravel hosting, Supabase, or `VITE_API_URL`.

Admin access:

```text
URL: http://127.0.0.1:5173/admin
Default password: admin123
```

Change the admin password in `app-frontend/.env` before deploying:

```text
VITE_ADMIN_PASSWORD=your-password
```

The admin dashboard saves edits to the current browser only. For a static
portfolio this is enough for previewing and local editing. To make permanent
public content changes, update the data in `app-frontend/src/data/profile.js`
and redeploy.
