# Keala Portal

Private internal portal for accessing the CRM and Research Database platforms.

## Stack
- **Next.js 14** (App Router)
- **NextAuth.js** for authentication (JWT sessions)
- **bcryptjs** for password hashing
- **Tailwind CSS** for styling
- Deployable on **Vercel** (recommended)

---

## Local Setup

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env.local
# Edit .env.local and fill in NEXTAUTH_SECRET (required)

# 3. Run the dev server
npm run dev
# Open http://localhost:3000
```

### Generate a NEXTAUTH_SECRET
```bash
openssl rand -base64 32
```

---

## Default Login (Phase 1)

```
Email:    admin@keala.io
Password: keala2024
```

**Change this before deploying.** To generate a new password hash:
```bash
node -e "const b=require('bcryptjs'); console.log(b.hashSync('yournewpassword', 12))"
```
Then update the `passwordHash` in `app/api/auth/[...nextauth]/route.ts`.

---

## Connecting Your Platforms

Update the URLs in `.env.local`:

```
CRM_URL=https://crm.keala.io
RESEARCH_URL=https://research.keala.io
```

Also set public env vars in `next.config.js` if using client-side references:
```js
env: {
  NEXT_PUBLIC_CRM_URL: process.env.CRM_URL,
  NEXT_PUBLIC_RESEARCH_URL: process.env.RESEARCH_URL,
}
```

---

## Deploy to Vercel

```bash
npm i -g vercel
vercel
```

Set these environment variables in the Vercel dashboard:
- `NEXTAUTH_SECRET` — your generated secret
- `NEXTAUTH_URL` — your production domain (e.g. `https://keala.io`)
- `CRM_URL` — your CRM platform URL
- `RESEARCH_URL` — your research platform URL

---

## Phase 2 Notes

Current limitations to address in Phase 2:
- Users are stored in memory (resets on server restart) — migrate to a database
- Single hardcoded admin user — add proper user management
- No email verification on signup
- Consider adding OAuth (Google Workspace SSO) for team-wide access
