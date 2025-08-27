## Digital Porch — Mini Blogging Platform

Next.js (App Router) + Supabase powered micro‑blogging app. Users can sign up, write posts, and manage profiles with a clean light/dark UI.

### Features
- Auth: email sign up/sign in (Supabase Auth).
- Posts: create, edit, delete. Each post has title, content, and created_at timestamp.
- Lists: Home shows Latest Blogs and Your Blogs; Profile lists your posts.
- Post pages: view at `/posts/[id]`, edit at `/posts/[id]/edit`.
- Tags: simple comma input rendered as #tags.
- Safe delete: confirmation modal + success toasts.
- Settings: display name, gender, DOB, bio, tags, change password, logout.
- Theming: light/dark toggle in Sidebar with persistence.
- Messages page: placeholder popup (“under construction”).

### Tech
- Next.js 15, React 19, TypeScript
- Supabase JS v2 with `@supabase/ssr` (browser/server clients)
- CSS custom properties for theming

## Setup
Prereqs: Node 18+, pnpm.

1) Install deps
```bash
pnpm install
```

2) Env vars: create `.env.local` in the project root
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3) Database (Supabase)
- Create a `posts` table with columns: `id` uuid (default gen), `user_id` uuid, `title` text, `content` text, `created_at` timestamp with time zone default now().
- Optional: `profiles` table for user metadata (display_name, gender, dob, bio, tags) keyed by auth uid.
- Enable RLS with policies to allow owners to read/write their own posts.

Note: The app also sets `created_at` on insert in code to guarantee a timestamp.

## Run
Dev server:
```bash
pnpm dev
```
Open http://localhost:3000

Build (for Vercel/local preview):
```bash
pnpm build
pnpm start
```

## Deploy
Deploy to Vercel. Set the same env vars in your Vercel Project → Settings → Environment Variables.

## Project Structure (high level)
- `src/app` — routes and pages (App Router)
- `src/components` — UI components
- `src/utils/supabase` — browser/server Supabase clients
- `src/styles` — global styles and theme tokens
