# Sashka's Birthday — Setup Guide

## Prerequisites
- Node.js 20+
- A [Supabase](https://supabase.com) account (free tier is fine)
- A [Vercel](https://vercel.com) account for deployment

---

## 1. Supabase Setup

### Create project
1. Go to [supabase.com](https://supabase.com) → New project
2. Pick a name (e.g. `birthday`) and a strong database password

### Run the schema
1. In your Supabase dashboard → **SQL Editor** → New query
2. Paste the contents of `supabase/schema.sql` and click **Run**

### Create storage bucket
1. Go to **Storage** → **New bucket**
2. Name: `gift-images`
3. Toggle **Public bucket** ON
4. Click **Save**

### Get your keys
Go to **Project Settings → API**:
- `URL` → `NEXT_PUBLIC_SUPABASE_URL`
- `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (keep secret!)

---

## 2. Local Development

```bash
cd birthday
cp .env.example .env.local
# fill in your keys in .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

Admin panel: [http://localhost:3000/admin](http://localhost:3000/admin)

---

## 3. Environment Variables

Create `.env.local` with:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
ADMIN_PASSWORD=choose-a-strong-password
```

> **IMPORTANT**: Never commit `.env.local` to git. It's already in `.gitignore`.

---

## 4. Deploy to Vercel

### Option A — Vercel CLI
```bash
npm i -g vercel
vercel
# follow prompts
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add ADMIN_PASSWORD
vercel --prod
```

### Option B — Vercel Dashboard
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → Import project → select repo
3. Add all 4 environment variables in the dashboard
4. Click **Deploy**

---

## 5. Admin Panel

Visit `yoursite.com/admin` and log in with the password you set in `ADMIN_PASSWORD`.

From there you can:
- **Add gifts** with name, description, price, photo URL or file upload, store link
- **Edit / delete** any gift
- **Reset reservations** if someone made a mistake
- **See who reserved** each gift (guests can't see this)
- **Set the meme of the day** image URL

---

## 6. Customization

| What | Where |
|------|-------|
| Event date & time | `components/CountdownTimer.tsx` line 5 |
| Add the venue address | `components/EventInfo.tsx` — update the `TBA` card |
| Birthday title / hero text | `components/HeroSection.tsx` |
| Page title & meta | `app/layout.tsx` |
| Default meme | `components/MemeSection.tsx` line 5 |

---

## 7. How the reservation system works

- Guests see **Available** or **Reserved** badges
- Guests **cannot** see who reserved a gift
- Admin **can** see who reserved each gift
- Reservations are stored in Supabase with optimistic locking (race condition safe)
- Admin can reset any reservation if needed
