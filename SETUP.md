# Chess Quest — Setup (one time, ~5 minutes)

A free, installable web app (PWA): daily 30-minute chess quest, 1,000+ real puzzles in 4 adaptive levels,
lessons, endgame lab, stars + prize vault, progress charts. Progress syncs to a private Google Sheet.

## 1. Open the app
GitHub Pages URL: **https://ramanasiyer-source.github.io/chess-quest/**

* **iPhone / iPad:** open in Safari → Share → **Add to Home Screen**
* **Android:** open in Chrome → ⋮ → **Install app**
* **Computer:** just bookmark it (Chrome: install icon in the address bar)

## 2. Turn on cloud sync (Google Sheet) — once
1. Open the sheet **“Anish Chess Quest - Training Log”** in Google Drive.
2. **Extensions → Apps Script**. Delete the sample code and paste all of `google_apps_script.js`. **Save**.
3. **Deploy → New deployment → Web app** → Execute as **Me**, Who has access **Anyone** → **Deploy**.
   Approve the permission prompt (Advanced → Go to project → Allow).
4. Copy the **Web app URL** (ends in `/exec`).
5. In the app: **Settings → Cloud sync** → paste the URL → **Save settings**.
6. Still in Settings tap **“Copy setup link for other devices”**. Open that link once on each phone / iPad /
   laptop: it pre-fills the sheet URL, name and Lichess username. (The link contains the sync URL, so
   send it only to family.)

The sheet gets three tabs: `Daily_Summary` (one row per day), `Stars_Ledger`, and `State` (used for syncing; don't edit).

## 3. Parent setup (Settings tab)
* Set a **parent PIN** (needed to approve redemptions / edit prices / give bonus stars).
* Edit the **Prize Vault** rewards and star prices (defaults: 100⭐ = 30 min bonus watch/gaming time, 250⭐ = $5).
* Set the current over-the-board rating (for the “Road to 1000” bar).

## How it works
* **Daily quest = 3 × 10 min:** Tactics puzzles → Lesson/endgame drill → Play one game on Lichess + blunder review.
* **Stars:** +10 quest, +2 first-try puzzle (+1 retry, ×2 in ⚡ Challenge mode), +5 endgame mate, +3 game review, +20 streak bonus at 3/7 days, +50 level-up.
* **Adaptive:** 8 of the last 10 puzzles solved first-try → next level. Challenge mode serves next-level puzzles for double stars.
* **Anti-rush coaching:** a wrong answer within 4 seconds triggers a “slow down — Checks, Captures, Threats” message and is counted in Progress.

## Notes
* Puzzles are from the Lichess open database (CC0). Rebuild with `zstd -dc lichess_db_puzzle.csv.zst | node tools/build_puzzles.js`.
* The app never needs a Lichess password — only the public username.
* Anyone with the sync URL can write to the sheet; keep it within the family.
