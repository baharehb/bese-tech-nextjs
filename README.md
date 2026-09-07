# BeSe Tech Website

Production-ready Next.js App Router source for the BeSe Tech landing page.

## Run locally

Requirements: Node.js 20.9 or newer and npm.

```bash
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

The page works without configuration, but sending the contact form requires a
Resend API key. Copy the example environment file and add your key:

```bash
cp .env.example .env.local
```

```dotenv
RESEND_API_KEY=re_your_resend_api_key
```

Restart the development server after changing `.env.local`. This file is
ignored by Git; never commit a real API key.

To test the production build locally:

```bash
npm run build
npm start
```

## Push to GitHub

Create an empty repository on GitHub, then run these commands from this project folder:

```bash
git init
git add .
git commit -m "Add BeSe Tech website"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

Replace `YOUR-USERNAME` and `YOUR-REPOSITORY` with your GitHub details.

## Deploy on Vercel

1. Sign in to [Vercel](https://vercel.com/).
2. Select **Add New → Project**.
3. Import the GitHub repository containing this project.
4. Keep the detected framework as **Next.js** and leave the default build settings unchanged.
5. In **Settings → Environment Variables**, add `RESEND_API_KEY` for the
   environments where the contact form should work.
6. Select **Deploy**.

## Contact form email setup

The browser submits the form to `app/api/contact/route.ts`. That server-only
route validates and rate-limits the request, then calls Resend. The Resend key
is never sent to the browser.

Before production use:

1. Create a Resend account and add `mail.besetech.ca` as a sending domain.
2. Add the DNS records supplied by Resend to IONOS under the `mail` subdomain.
   Do not remove or replace the existing DNS records for the main domain or the
   IONOS mailbox at `info@besetech.ca`.
3. Wait until Resend marks the domain as verified.
4. Create a Resend API key and save it as `RESEND_API_KEY` in Vercel.
5. Redeploy, submit the form, and confirm the message arrives at
   `info@besetech.ca`. Replying to it will address the visitor automatically.

The sender is `website@mail.besetech.ca`; it is a sending identity and does not
need to be an IONOS inbox. Incoming messages still go to the existing
`info@besetech.ca` mailbox.

The built-in IP throttle is a lightweight, best-effort safeguard. If the public
form begins receiving spam, add a shared rate-limit store or a CAPTCHA service.

## Code structure

- `app/page.tsx` renders the landing page entry component.
- `components/home/` contains one focused component per page section.
- `lib/i18n/translations.ts` contains all English and French page copy.
- `app/api/contact/route.ts` is the public contact endpoint.
- `lib/contact/` contains contact validation, throttling, and email delivery.
