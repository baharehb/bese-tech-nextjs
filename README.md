# BeSe Tech Website

Production-ready Next.js App Router source for the BeSe Tech landing page.

## Run locally

Requirements: Node.js 20.9 or newer and npm.

```bash
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

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
5. Select **Deploy**.

No environment variables or platform-specific configuration are required.
