# Curevanta Flutter — 3 sub-apps, separate logins

One binary with three isolated portals:

| Portal | Login path | Demo email | Password |
|--------|------------|------------|----------|
| **Patient** | `/patient/login` | `patient@curevanta.app` | `Patient@2026` |
| **Doctor** | `/doctor/login` | `doctor@curevanta.app` | `Doctor@2026` |
| **Ops / Founder** | `/ops/login` | `founder@techmunda.com` | `Founder@2026` |

Hub (`/`) lets you pick a portal. Sessions are role-locked — a Patient login cannot open Doctor/Ops routes (and vice versa). Sign out returns to the hub.

## Run

```bash
cd mobile
flutter pub get
flutter run
```

Chrome: `flutter run -d chrome`  
Windows: `flutter run -d windows`

If you see **There is not enough space on the disk** (errno 112), C: is full. Use:

```bat
mobile\run_chrome.bat
```

That script puts `TMP`/`TEMP`/`PUB_CACHE` on **D:** so Flutter compile cache does not fill C:.

## Architecture

```
lib/
  app/           # theme, router, root app
  core/auth/     # role models + AuthService (SharedPreferences session)
  core/widgets/  # shared UI
  features/
    hub/         # portal picker
    patient/     # patient login + shell + screens
    doctor/      # doctor login + home
    ops/         # ops login + control tower lite
```

Stack: Flutter 3 · go_router · provider · google_fonts · shared_preferences
