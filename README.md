# Cadence

A personal fitness tracker — workouts, runs, and daily activity, with a calendar-first home page, weekly goal rings, stats, and dark mode. Runs entirely in the browser; your data is stored locally on your device.

**Move with rhythm. Every day.**

-----

## What’s in here

|File                          |Purpose                                                                                                    |
|------------------------------|-----------------------------------------------------------------------------------------------------------|
|`index.html`                  |The entire app — React is loaded from a CDN and the code is compiled in-browser, so there is no build step.|
|`manifest.json`               |Makes it installable as a home-screen web app.                                                             |
|`apple-touch-icon.png`        |Home-screen icon for iOS.                                                                                  |
|`icon-192.png`, `icon-512.png`|Icons for Android / PWA.                                                                                   |

-----

## Put it online with GitHub Pages (free)

You’ll get a real web address you can open on your phone and add to your home screen.

### 1. Create the repository

1. Go to **github.com** and sign in (create a free account if needed).
1. Click **New repository** (the green button, or the **+** top-right → *New repository*).
1. Name it `cadence` (or anything you like). Leave it **Public**. Click **Create repository**.

### 2. Upload these files

1. On the new repo page, click **uploading an existing file** (the link in the “Quick setup” box).
1. Drag in **all the files from this folder** — `index.html`, `manifest.json`, and the three icon `.png` files.
1. Scroll down and click **Commit changes**.

### 3. Turn on GitHub Pages

1. In the repo, click **Settings** (top menu).
1. In the left sidebar, click **Pages**.
1. Under **Branch**, choose **main** and **/ (root)**, then click **Save**.
1. Wait about a minute, then refresh. GitHub shows your live URL near the top — something like:
   `https://YOURNAME.github.io/cadence/`

### 4. Add it to your iPhone home screen

1. Open that URL in **Safari** on your iPhone.
1. Tap the **Share** button → **Add to Home Screen**.
1. Tap **Add**. The Cadence icon appears on your home screen and launches fullscreen, like a native app.

(On Android: open the URL in Chrome → menu → **Add to Home screen** / **Install app**.)

-----

## Updating the app later

This is a snapshot. If you change the app (for example, in a new Claude session), export a fresh `index.html` and re-upload it to the repo: open the repo, click `index.html`, click the **pencil** to edit — or just **Add file → Upload files** and replace it. GitHub Pages updates within a minute.

-----

## Notes

- **Your data** (sessions, custom workouts, body weight, dark-mode preference) is saved in your browser’s local storage on each device. It does **not** sync between devices, and clearing your browser data will remove it. Use the **Backup** button on the Stats page to export your logged sessions as text.
- **Internet** is needed the first time you open it (to fetch React from the CDN). After that most browsers cache it, but an occasional connection keeps it reliable.
- The app is a single self-contained file — no tracking, no accounts, no server.