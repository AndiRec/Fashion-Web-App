# Aria Fashion — Struga Boutique

An e-commerce site for Aria Fashion, a boutique in Struga. The project is split into two decoupled apps:

- **`FashionWeb/`** — Laravel 12 JSON API (products, cart, wishlist, checkout, orders, addresses, auth via Laravel Sanctum).
- **`frontend/`** — React 19 + TypeScript SPA (Vite, React Router, TanStack Query, Tailwind CSS v4) that talks to the API over HTTP.

## Getting started

### 1. Backend (Laravel API)

```bash
cd FashionWeb
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed   # creates admin@example.com / password123 + demo products
php artisan storage:link     # so product images are served at /storage/...
composer run dev             # serves the API on http://localhost:8000
```

### 2. Frontend (React SPA)

```bash
cd frontend
npm install
cp .env.example .env         # VITE_API_URL should point at the Laravel API
npm run dev                  # serves the site on http://localhost:5173
```

Open http://localhost:5173. The admin user seeded above (`admin@example.com` / `password123`) can manage products and orders at `/admin/products` and `/admin/orders`.

## Notes

- Auth is token-based (Laravel Sanctum personal access tokens) — the SPA stores the token in `localStorage` and sends it as `Authorization: Bearer <token>`, so the two apps can be deployed on entirely different domains. CORS is configured via the `FRONTEND_URL`/`FRONTEND_URLS` env vars in `FashionWeb/.env`.
- Password reset emails link to the SPA's `/reset-password` page (configured via `FRONTEND_URL` in the backend `.env`); in local dev, `MAIL_MAILER=log` writes emails to `storage/logs/laravel.log` instead of sending them.
- The old Blade/Bootstrap/jQuery template (`resources/views`, `public/assets`) has been fully replaced by the API + React app.
