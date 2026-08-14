# Engagement V2 setup

## 1. Supabase
Create a free Supabase project, open SQL Editor, and run `supabase/schema.sql`.

Create one Auth user for the couple (email + password). This account is used only at `/admin`.

## 2. Vercel environment variables
In Vercel → Project → Settings → Environment Variables, add:

- `VITE_SUPABASE_URL` = Supabase Project URL
- `VITE_SUPABASE_ANON_KEY` = Supabase anon/public key

Redeploy after saving.

## 3. Admin
Open:

`https://YOUR-DOMAIN.vercel.app/admin`

Sign in with the Supabase Auth user.

From the Admin page you can:
- Add/delete Story photos directly from your mobile Gallery.
- Upload the exact circular frame image from your mobile Gallery once.

After the frame is uploaded, every visitor uses the same frame automatically.

## 4. Guest Camera flow
The Camera section does NOT show a Gallery picker. It requests the visitor's mobile camera, captures the photo, places it inside the admin-provided frame, lets the visitor download it, and uploads the framed result to the public Memory Wall.

## 5. Wishes
Wishes are stored in Supabase and are public. Every visitor loads the shared wishes from the database, so they are no longer device-local.

## 6. YouTube music
The Open Invitation action mounts the supplied YouTube embed with autoplay. Some browsers/phones can still block autoplay with sound; the music button lets the visitor toggle the embedded player. This is a browser restriction, not a Vercel issue.
