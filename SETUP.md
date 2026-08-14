# Abanoub & Engy Engagement — V2

## Public invitation link
Use the Vercel project domain root:

`https://YOUR-DOMAIN.vercel.app/`

This is the link you send to guests.

## Private admin link
Use:

`https://YOUR-DOMAIN.vercel.app/admin`

Only the couple's Supabase email/password account should be used here. The admin can manage Story photos, the frame, RSVP records, Wishes, and Guest Memory photos.

## 1. Supabase
Create a free Supabase project. Open **SQL Editor** and run the complete file `supabase/schema.sql`.

Then go to **Authentication → Providers / Anonymous Sign-Ins** and enable **Anonymous Sign-Ins**. Guest camera users use anonymous accounts so each guest can delete only their own Memory Wall photo. Supabase documents that anonymous users use the authenticated database role and expose an `is_anonymous` JWT claim, so the SQL policies explicitly distinguish guests from the permanent admin account.

Create one permanent Auth user for Abanoub/Engy under **Authentication → Users**. Use its email/password only at `/admin`.

## 2. Vercel environment variables
In **Vercel → Project → Settings → Environment Variables**, add:

- `VITE_SUPABASE_URL` = Supabase Project URL
- `VITE_SUPABASE_ANON_KEY` = Supabase publishable/anon key

Do not put a Supabase service-role/secret key in Vercel frontend variables.

Redeploy after saving.

## 3. Upload the exact circular frame
Open `/admin` on the phone, log in, go to **Camera Frame**, and upload the exact frame image supplied by Abanoub & Engy. The website then uses that same frame for every guest.

## 4. Story photos
From `/admin` on the phone, open **Our Story → Add photos from mobile Gallery**. You can add 4–5 photos or more and remove any photo later. All visitors see the same Story gallery.

## 5. Guest camera flow
The public invitation has **Camera only** — no Gallery picker. The guest allows the front/back mobile camera, captures a photo, sees it inside the circular frame, downloads the framed image to their phone, and the framed image is uploaded to the shared Memory Wall.

Every visitor can download every Memory Wall photo. The guest who created a photo can delete their own photo; another guest cannot delete it. The private admin can delete any Memory Wall photo.

## 6. Wishes
Wishes are stored in Supabase and publicly readable. When one guest submits a Wish, it is shared in the database and appears to everyone after loading the invitation. Admin can remove Wishes from `/admin`.

## 7. RSVP
Guests submit name, attendance, and number of guests. Only the permanent admin account can read/delete RSVP records in the database and the Admin dashboard shows the total.

## 8. Music
The Open Invitation action mounts the supplied YouTube embed:
`https://youtu.be/cNGjD0VG4R8`

The browser may still block autoplay with sound on some devices. Because the guest has just tapped **Open Invitation**, many browsers will allow playback, but no website can override a browser's autoplay policy. The music button can toggle playback.
