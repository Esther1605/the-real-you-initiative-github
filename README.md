# The Real You Initiative — Website Code

This is the complete code for **The Real You Initiative** website, ready to open in **Visual Studio Code (VS Code)** and publish on **GitHub**.

It contains:

| File / folder | What it is |
|---|---|
| `index.html` | The whole website (all pages: Home, About Us, Programmes, Community, Events & Activities, Resources, Contact Us, plus Privacy and Terms). All images are embedded in this one file, so it works on its own. |
| `config.js` | One setting: where form submissions should go (see Part 4). |
| `form-to-database.js` | Sends form submissions to your database when a backend address is set in `config.js`. If the address is empty, it does nothing and the site uses its default email delivery. |
| `backend/` | A small Node.js + Express server with an **SQLite database**. It receives form submissions from the website, saves them, and gives you an Admin page to read them. |
| `backend/server.js` | The server code. The database file `submissions.db` is created automatically the first time it runs. |
| `.gitignore` | Lists files that must NOT be uploaded to GitHub (the database file, your secret key, `node_modules`). |

> **One honest thing to know before you start:** GitHub Pages can host the *website* (HTML/CSS/JavaScript) for free, but it **cannot run a server or a database**. So the setup works in two parts:
>
> 1. **Website → GitHub Pages** (Part 3).
> 2. **Database backend → a free server host such as Render** (Part 5), then you paste its address into `config.js` (Part 4).
>
> If you skip Part 5, the site still works — forms keep using the current email delivery (FormSubmit to therealyou0806@gmail.com).

---

## Part 1 — Open the project in VS Code

You need: a computer, [VS Code](https://code.visualstudio.com) installed, and the project folder (unzip the ZIP you received first).

1. Unzip the downloaded file. You will get a folder called `the-real-you-initiative-github`.
2. Open **VS Code**.
3. In VS Code, click **File → Open Folder…** (on Mac: **File → Open…**).
4. Find and select the `the-real-you-initiative-github` folder, then click **Select Folder / Open**.
5. If VS Code asks "Do you trust the authors of the files in this folder?", click **Yes, I trust the authors**.
6. On the left side (Explorer panel) you should now see: `index.html`, `config.js`, `form-to-database.js`, `README.md`, and the `backend` folder. 🎉 The project is open.

### Preview the website

1. In VS Code, open the **Extensions** panel (the blocks icon on the far-left bar, or press `Ctrl+Shift+X`).
2. Search for **Live Server** (by Ritwick Dey) and click **Install**.
3. In the Explorer, right-click `index.html` and choose **Open with Live Server**.
4. Your browser opens the website at an address like `http://127.0.0.1:5500/index.html`. This is a private preview on your own computer — nobody else can see it yet.

*(Shortcut alternative: you can also just double-click `index.html` in your file manager to open it in a browser.)*

---

## Part 2 — Run the database on your own computer (test it locally)

You need [Node.js](https://nodejs.org) installed (choose the **LTS** version, 22 or newer). To check, open VS Code's terminal (**Terminal → New Terminal**, or `` Ctrl+` ``) and run `node -v`.

The backend uses **only features built into Node.js itself** (including its built-in SQLite database), so there are **no packages to install** — it runs immediately.

1. In the VS Code terminal, go into the backend folder:
   ```bash
   cd backend
   ```
2. Create your settings file. Copy `.env.example` and rename the copy to `.env`:
   - Windows (PowerShell): `copy .env.example .env`
   - Mac/Linux: `cp .env.example .env`
3. Open the new `.env` file and change the `ADMIN_KEY` line to a long secret password that only you know, e.g.:
   ```
   ADMIN_KEY=my-own-long-secret-2026
   ```
   Save the file (`Ctrl+S`). **Never share this key and never upload the `.env` file** (the `.gitignore` already protects it).
4. Start the backend:
   ```bash
   npm start
   ```
   (That simply runs `node server.js` — either command works.)
   You should see: `TRY backend running at http://localhost:4000`.
   Leave this terminal running.
5. Open the Admin page in your browser: **http://localhost:4000/admin**
   Type your ADMIN_KEY and click **View submissions**. It will say "No submissions yet" — that is correct for now.

### Connect the website to your local database and test

1. In VS Code, open `config.js` and set:
   ```js
   window.TRY_BACKEND_URL = "http://localhost:4000";
   ```
   Save the file.
2. Go back to the website preview (Live Server tab) and refresh the page.
3. Fill and submit the **Join** form (or any form) with test details.
4. You should see a green confirmation: *"Thank you! Your response has been received and saved…"*
5. Go to the Admin page (http://localhost:4000/admin), enter your key, click **View submissions** — your test entry is there, saved in the database. 🎉

To stop the backend later, click its terminal and press `Ctrl+C`.

---

## Part 3 — Put the project on GitHub and publish the website

You need a free account at [github.com](https://github.com).

### Step A — Create the repository on GitHub

1. Log in to GitHub, click the **+** at the top right → **New repository**.
2. Repository name: `the-real-you-initiative` (or any name you like).
3. Choose **Public** (needed for free GitHub Pages).
4. Do **NOT** tick "Add a README file" — the project already has one.
5. Click **Create repository**. GitHub shows an empty repo with some commands — keep that page open.

### Step B — Upload the code from VS Code (easiest way, no commands)

1. In VS Code, click the **Source Control** icon on the far-left bar (it looks like a branch/fork).
2. Click **Publish to GitHub** (if asked, sign in to GitHub and allow VS Code).
3. Choose **Publish to GitHub → Public repository**.
4. VS Code uploads all the files. When it finishes, click **Open on GitHub** to see your code online.

**Alternative (terminal way):** in VS Code's terminal, from the project folder (not inside `backend`), run:

```bash
git init
git add .
git commit -m "The Real You Initiative website"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/the-real-you-initiative.git
git push -u origin main
```

Replace `YOUR-USERNAME` with your GitHub username. (This needs Git installed from https://git-scm.com.)

> The `.gitignore` file makes sure your database file, your `.env` secret, and `node_modules` are **not** uploaded. Check on GitHub that you do NOT see `backend/.env` or `backend/submissions.db` — you shouldn't.

### Step C — Turn on GitHub Pages (this makes the website live)

1. On your repository page on GitHub, click **Settings** (top menu of the repo).
2. In the left menu, click **Pages**.
3. Under "Build and deployment → Source", choose **Deploy from a branch**.
4. Under "Branch", choose **main** and folder **/ (root)**, then click **Save**.
5. Wait 1–2 minutes, then refresh the Pages settings page. GitHub shows your live address:
   **https://YOUR-USERNAME.github.io/the-real-you-initiative/**
6. Open it — that is your website, live on the internet, with **no AI name and no install adverts**. 🎉

At this point the live site works fully, and its forms use the email delivery (FormSubmit). To switch the live forms to your **database**, do Part 4 and Part 5.

---

## Part 4 — How the website decides where forms go

Open `config.js`. There is exactly one setting:

```js
window.TRY_BACKEND_URL = "";
```

- **Empty (`""`)** → forms go by email (FormSubmit → therealyou0806@gmail.com). This is the default and needs no server.
- **Filled in** (e.g. `"https://try-backend.onrender.com"`) → every form (Join, Show Interest, Contact, Newsletter) saves into your database instead, and you read submissions in the backend Admin page.

Every time you change `config.js`, save it and push the change to GitHub (VS Code: Source Control panel → type a short message → **Commit** → **Sync Changes**). GitHub Pages updates within a minute or two.

---

## Part 5 — Put the database backend online (free, using Render)

GitHub cannot run the database server, so we host just the `backend` folder on Render's free tier. You need a free account at [render.com](https://render.com) (you can sign up with your GitHub account).

1. Log in to Render → click **New +** → **Web Service**.
2. Choose **Build and deploy from a Git repository** → connect/select your `the-real-you-initiative` repository.
3. Fill in:
   - **Name:** `try-backend` (this becomes part of your backend address)
   - **Root Directory:** `backend`
   - **Runtime:** Node
   - **Build Command:** leave the default (`npm install`) — the backend has no dependencies to install, so this finishes almost instantly
   - **Start Command:** `npm start`
   - **Instance Type:** Free
4. Add an **Environment Variable**: click **Add Environment Variable**, set **Key** = `ADMIN_KEY`, **Value** = the same long secret password you chose for `.env`. (Do not put the `.env` file itself on Render.)
5. Click **Create Web Service**. Wait for the first deployment to finish (a few minutes). At the top of the page Render shows your backend address, like:
   **https://try-backend.onrender.com**
6. Test it: open `https://try-backend.onrender.com/health` in a browser — you should see `{"ok":true,...}`. And `https://try-backend.onrender.com/admin` opens your Admin page.
7. **Connect the website:** in VS Code open `config.js` and set:
   ```js
   window.TRY_BACKEND_URL = "https://try-backend.onrender.com";
   ```
   (Use YOUR address from step 5, with no `/` at the end.) Save, commit and sync to GitHub (Part 4 explains how).
8. Wait a minute for GitHub Pages to update, open your live website, and submit a test form. Then check the Admin page — the submission is in your database. 🎉

**Notes about Render's free tier:** the free service sleeps after about 15 minutes without visitors, so the *first* form submission after a quiet period can take up to ~1 minute while it wakes up. Later submissions are fast. Also, on the free tier the SQLite file can be reset when the service restarts — for a permanent, growing database, the next step up is a free hosted database (e.g. Supabase or Turso); the backend code is small, so ask your developer (or Amani) when you're ready for that step.

---

## Part 6 — Making changes later

1. Open the folder in VS Code (Part 1).
2. Edit the files you need (`index.html` for the website content, `backend/server.js` for the backend).
3. Preview with Live Server.
4. In the **Source Control** panel: type a short message describing the change → **Commit** → **Sync Changes**.
5. GitHub Pages republishes the website automatically within a minute or two. If you changed the backend, Render also redeploys automatically.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| `npm` or `node` is "not recognized" | Install Node.js LTS from https://nodejs.org, then close and reopen VS Code. |
| "Port 4000 already in use" | Another copy of the backend is already running. Close its terminal, or change `PORT` in `backend/.env` to e.g. 4001 and use that port in `config.js` too. |
| Admin page says "Wrong admin key" | The key must match `ADMIN_KEY` exactly — check for extra spaces. On Render, check the environment variable value. |
| Form shows the red "could not be saved" message | The backend is not reachable: check `TRY_BACKEND_URL` in `config.js` (no trailing `/`), open `BACKEND-ADDRESS/health` in a browser to confirm the backend is awake, and remember Render's free tier needs up to a minute to wake. |
| GitHub Pages shows 404 | Wait 2 minutes and refresh; confirm in Settings → Pages that branch is **main** and folder is **/ (root)**; confirm `index.html` is at the top level of the repo (not inside another folder). |
| My changes are not showing on the live site | Make sure you committed **and** synced/pushed in VS Code, then hard-refresh the page (`Ctrl+Shift+R`). |

---

*The Real You Initiative — "Raising a Generation That Matters."*

---

## Part 7 — Turn the website into an app (and the Play Store)

The project already includes everything needed for an **installable app**:

- `manifest.webmanifest` — the app's name, colours and icons.
- `icons/` — app icons made from the official TRY logo (192px, 512px, and a Play-Store-ready maskable icon).
- `sw.js` — a service worker, so the site also opens when a visitor is offline.

### Step 1 — Let people install it from the browser (free, no store)

Once the website is live on GitHub Pages (Part 3):

1. Open the live site on an Android phone in **Chrome**.
2. Tap the **⋮** menu → **Install app** (or "Add to Home screen").
3. The Real You Initiative now sits on the phone's home screen with its own icon and opens full-screen like a normal app. 🎉

On iPhone: open the site in **Safari** → **Share** → **Add to Home Screen**.

### Step 2 — Publish on the Google Play Store (optional)

Play Store apps made from a website use Google's official **Trusted Web Activity (TWA)** technology, usually generated with the free **Bubblewrap** tool. You will need:

- The website live on an HTTPS address (your GitHub Pages address works).
- A **Google Play Console** developer account — Google charges a one-time **$25** registration fee.
- Node.js installed (you already have it).

Steps:

1. Install Bubblewrap:
   ```bash
   npm install -g @bubblewrap/cli
   ```
2. Generate the Android project from your live app manifest:
   ```bash
   bubblewrap init --manifest=https://YOUR-USERNAME.github.io/the-real-you-initiative/manifest.webmanifest
   ```
   Answer its questions (app name: *The Real You Initiative*, package id suggestion: `com.therealyouinitiative.app`). It also installs the Android/JDK tools it needs the first time.
3. Bubblewrap prints a **digital asset link** fingerprint. It creates a file you must host on your website at `.well-known/assetlinks.json`:
   - In this project, create a folder named `.well-known` and put the `assetlinks.json` file Bubblewrap gives you inside it.
   - Commit and sync to GitHub, wait for Pages to update, then open `https://YOUR-USERNAME.github.io/the-real-you-initiative/.well-known/assetlinks.json` in a browser to confirm it loads. (This file is what proves to Android that the app and the website belong to you, so the app opens full-screen with no browser bar.)
4. Build the signed app bundle:
   ```bash
   bubblewrap build
   ```
   This produces an `.aab` file (and a signing key — **keep the key file and its password safe forever**; you need the same key for every future update).
5. Go to **Google Play Console** → **Create app** → name it *The Real You Initiative*, upload the `.aab` under **Testing → Internal testing** first, test it on your own phone, then promote it to **Production**.
6. For the store listing you will need: a short and full description (adapt the website's About text — do not invent claims), the 512px icon (already in `icons/icon-512.png`), at least 2 screenshots of the site/app, and a **privacy policy URL** — your website already has a Privacy page, use its address: `https://YOUR-USERNAME.github.io/the-real-you-initiative/` and link to the Privacy section from your listing notes if asked. Google reviews new apps, which can take a few days.

> Tip: do Step 1 first and use the installable app for a while. Go to the Play Store (Step 2) when you are ready for public discovery — the app itself is identical; only the distribution changes.
