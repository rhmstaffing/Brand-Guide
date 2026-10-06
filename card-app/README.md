# RHM Cards

Digital business cards for RHM Staffing Solutions. Works on iPhone, Android and desktop from one codebase (website + installable app), with Salesforce sync, document scanning, wallet passes and company dashboards.

## What it does

**For every recruiter and AE**
- A branded digital card at `cards.rhmstaffing.net/c/<name>` with call, text, email, booking link, LinkedIn and custom links.
- A QR code made automatically by the [QR Code Monkey API](https://www.qrcode-monkey.com/qr-code-api-with-logo/) with the `edge-cut` body and the RHM mark in the middle. Remade automatically if their link changes.
- "Save my contact" (vCard) for the person they meet.
- "Share your info" form on the card. Whatever someone shares goes straight into Salesforce under the recruiter or AE, and they get an email about it.
- Add the QR to Apple Wallet or Google Wallet (Android).
- Share by text, email, the phone's share sheet, NFC tag, email signature, or a Teams/Zoom background.
- Scan business cards, resumes, sign-in sheets or handwritten notes with the camera. Printed text and handwriting are read, fields are filled in, and anything the scan wasn't sure about is highlighted. The person edits it next to the original photo. Before sending to Salesforce they get two warnings: "Did you review and fix any mistakes?" (No sends them back to the form) and "Are you sure?". The server also refuses a send without both answers.
- Personal dashboard: card opens, QR scans, link clicks, which links were clicked, unique visitors, contacts saved, by day.

**For everyone**
- Company dashboard with office by office numbers and leaderboards for who is saving the most contacts and who is giving their info away the most (card opens, QR scans, contact saves, wallet adds, NFC taps, shares sent). 7 day, 30 day, 90 day and 1 year views.

**For admins** (anyone in `ADMIN_EMAILS`)
- See every account, every contact, every card event and an audit log of logins and changes.
- Sign someone out of one device or every device. Takes effect on their next tap.
- Archive: first saves a ZIP of everything in the account (contacts as an Excel-ready CSV and full JSON, scanned photos, card activity, account log, devices, profile, QR code). Then it signs them out everywhere, blocks login, and takes their public card offline. Admins download the ZIP from the person's admin page any time. Contacts can also be moved to someone else. Restore any time.
- Make an export of any account without locking it.
- Manage offices, roles, and add people before their first login. Export all contacts to CSV.

**Microsoft 365 / Entra ID**: when connected, a new hire's card is made automatically on their start date, and when someone is turned off or deleted in Microsoft 365 their account is archived within minutes. See "Microsoft Entra ID" below.

**Login**: only `@rhmstaffing.net` emails. No passwords. They enter their email and get a 6 digit code (expires in 10 minutes, 5 tries, 5 codes per 15 minutes). Accounts are created on first login.

## Running it

Needs Node 20+ and Postgres.

```bash
cd card-app
cp .env.example .env     # fill it in, see below
npm install
npx prisma migrate deploy
npm run db:seed          # adds a "Corporate" office, add the rest in Admin
npm run build && npm start
```

For local dev without email set up, login codes print in the terminal.

Hosting: anything that runs Next.js and Postgres works (Vercel + Neon/Supabase, Azure App Service + Azure Database for PostgreSQL, Render, Railway). Point `cards.rhmstaffing.net` at it and set `APP_URL` to match. **Set `APP_URL` before people print their QR codes**, since the QR holds that address.

## Settings (.env)

Everything is listed in `.env.example`. The admin page shows which ones are connected.

### Email (login codes)
Use a Microsoft 365 or Google Workspace mailbox like `no-reply@rhmstaffing.net` with SMTP turned on.

### Salesforce
1. In Salesforce Setup, create an **External Client App** (or Connected App) with OAuth turned on.
2. Turn on **Client Credentials Flow**, give it the `api` scope, and pick a "Run As" integration user that can create Leads (and Contacts if you use them).
3. Put the Consumer Key and Secret in `SF_CLIENT_ID` and `SF_CLIENT_SECRET`, and your My Domain URL in `SF_LOGIN_URL`.
4. Records are created as **Leads** by default with Lead Source "Digital Business Card". Set `SF_OBJECT_CANDIDATE=Contact` or `SF_OBJECT_CLIENT=Contact` to send job seekers or clients somewhere else.
5. The record owner is set to the Salesforce user with the same email as the recruiter or AE. If none is found, the integration user owns it.
6. Duplicate rules set to "alert" are allowed through. Rules set to "block" will show the error on the contact so the person can fix it and retry.

### Scanning (text and handwriting)
Add an `ANTHROPIC_API_KEY` from console.anthropic.com. Photos go to Claude, which returns the full transcription plus the contact fields. Photos are shrunk on the phone before upload. Only the first page thumbnail is stored.

### QR Code Monkey
Works without a key on their free API. If you hit limits, get a RapidAPI key for QR Code Monkey and put it in `QR_MONKEY_RAPIDAPI_KEY`. If the API is down, a plain navy QR is used and the branded one is retried automatically. QR codes are stored, so the API is only called when someone's link changes.

### Apple Wallet
1. In the Apple Developer account, create a **Pass Type ID** (for example `pass.net.rhmstaffing.cards`) and its certificate.
2. Export the certificate and key as PEM, download the Apple WWDR G4 certificate, and base64 each one (`base64 -w0 file.pem`) into the `APPLE_*` settings.

### Google Wallet (Android)
1. Sign up for the Google Wallet API in the Google Pay & Wallet Console and note the Issuer ID.
2. Create a Google Cloud service account, give it access to the issuer, download its JSON key.
3. Put the issuer ID, the service account email, and the base64 of its `private_key` into the `GOOGLE_WALLET_*` settings.

### Microsoft Entra ID (Azure AD)

This is what makes cards appear for new hires and get archived at termination with nobody touching the app.

**What happens**
| In Microsoft 365 / Entra | In RHM Cards |
|---|---|
| New user, account on, Employee hire date today or earlier (or blank) | Card made with name, title, mobile, office phone and office filled in. QR made. Welcome email sent. |
| New user with a hire date in the future | Account waits as "Starts <date>". Can't sign in yet. Turns on that morning and the welcome email goes out. |
| Name, title, phone or office changes | Copied to the card, unless the person already changed that field themselves. |
| Account turned off (Block sign in) | Account archived: ZIP saved, signed out everywhere, locked out, card offline. Admins get an email with a download link. |
| User deleted | Same as turned off. |
| Account turned back on (rehire) | Account restored with all their old contacts. Accounts an admin archived by hand stay archived. |

Guests, accounts that aren't `@rhmstaffing.net`, and disabled accounts like conference rooms are skipped.

**Setup (about 15 minutes, needs a Microsoft 365 admin)**
1. Go to entra.microsoft.com, then App registrations, then New registration. Name it "RHM Cards". Single tenant. No redirect URL.
2. In the app, open API permissions, then Add a permission, Microsoft Graph, **Application permissions**. Add `User.Read.All`. If you'll use a group, also add `GroupMember.Read.All`. Click **Grant admin consent**.
3. Open Certificates & secrets and make a new client secret. Copy the value.
4. Put the Directory (tenant) ID, Application (client) ID and secret into `ENTRA_TENANT_ID`, `ENTRA_CLIENT_ID`, `ENTRA_CLIENT_SECRET`.
5. Recommended: make a security group (for example "RHM Cards users") with recruiters, AEs and anyone else who should get a card, and put its Object ID in `ENTRA_GROUP_ID`. Without it, every `@rhmstaffing.net` member account gets a card. Removing someone from the group does not archive them. Only turning off or deleting their account does.
6. Set `ENTRA_WEBHOOK_SECRET` and `CRON_SECRET` to two different long random strings.
7. Schedule `GET https://cards.rhmstaffing.net/api/cron/entra` with the header `Authorization: Bearer <CRON_SECRET>` every 15 to 30 minutes. On Vercel this is already set up in `vercel.json` (every 30 minutes needs a Pro plan; Hobby only allows once a day). On Azure, use a Logic App with a Recurrence trigger and an HTTP action, or an Azure Function timer.
8. In Admin, click **Sync now**. The first sync imports everyone and links people who already signed in.
9. HR should fill in **Employee hire date** in Entra (user, Properties, Job information) so cards turn on on day one.

The scheduled call also renews the live update subscription, so terminations show up within a few minutes instead of waiting for the next scheduled run. The Admin page shows when the last sync ran and what it did.

## Phone apps

- **Right away, no app store**: open the site on a phone and choose "Add to Home Screen" (iPhone) or "Install app" (Android/Chrome). It opens full screen like an app. Desktop Chrome and Edge can install it too.
- **App Store and Google Play**: the `capacitor.config.ts` wraps the live site in native apps.
  ```bash
  APP_URL=https://cards.rhmstaffing.net npx cap add ios      # needs a Mac with Xcode
  APP_URL=https://cards.rhmstaffing.net npx cap add android  # needs Android Studio
  npx cap open ios   # or: npx cap open android
  ```
  Add a camera permission message in iOS (`NSCameraUsageDescription` in `ios/App/App/Info.plist`, for example "Used to scan business cards and documents") and `android.permission.CAMERA` in the Android manifest. Because the apps load the live site, updates ship without an app store review.

## How things are counted

| Event | When |
|---|---|
| Card open | Someone opens the card link (not the owner, not link preview bots) |
| QR scan | Card opened from the QR code, wallet pass or video background |
| NFC tap | Card opened from an NFC tag written by the app |
| Link click | Someone taps call, text, email, LinkedIn, website or a custom link |
| Contact save | Someone downloads the vCard |
| Info shared back | Someone fills out the share form on the card |
| Share sent | The owner sends their card by text, email or the share sheet |

## Code map

- `src/app/c/[slug]` public card, `src/app/r/[slug]` click tracking redirect (only to the card's own links)
- `src/app/(app)` signed-in pages: dashboard, card, share, contacts, scan, team, admin
- `src/lib/auth.ts` sessions (checked on every request so remote sign out is instant)
- `src/lib/entra.ts` Microsoft Entra ID sync, `src/lib/archive.ts` archive ZIPs
- `src/app/api/integrations/entra/notify` live updates from Microsoft, `src/app/api/cron/entra` scheduled sync
- `src/lib/qr.ts` QR Code Monkey, `src/lib/salesforce.ts`, `src/lib/ocr.ts`, `src/lib/wallet.ts`
- `prisma/schema.prisma` database
