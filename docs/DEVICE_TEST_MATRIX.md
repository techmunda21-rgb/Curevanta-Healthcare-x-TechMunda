# Device Test Matrix — Curevanta Mobile

**Status:** Template ready · execution begins after Expo builds exist  
**Apps:** Patient · Doctor · Career

## Devices (representative)

| Class | Example targets | Priority |
|-------|-----------------|----------|
| Small Android | ~5.5–6.0" / 360×640–720 dp | P0 |
| Standard Android | Pixel-class 6.1–6.3" | P0 |
| Large Android | 6.7"+ / Samsung-class | P1 |
| Small iPhone | SE-class | P0 |
| Standard iPhone | 14/15/16 | P0 |
| Pro Max-class | 14/15/16 Plus/Pro Max | P1 |

## Checklist per device/app

| Scenario | Patient | Doctor | Career |
|----------|---------|--------|--------|
| Safe areas / notch / Dynamic Island | ☐ | ☐ | ☐ |
| Android system bars | ☐ | ☐ | ☐ |
| Keyboard (login / search / notes) | ☐ | ☐ | ☐ |
| Font scale 100% / 150% / 200% | ☐ | ☐ | ☐ |
| Location permission flows | ☐ | ☐ | ☐ |
| Notifications permission + tap | ☐ | ☐ | ☐ |
| Background → foreground | ☐ | ☐ | ☐ |
| Offline / reconnect | ☐ | ☐ | ☐ |
| Deep link auth gate | ☐ | ☐ | ☐ |
| App restart session restore | ☐ | ☐ | ☐ |
| Camera / document upload (where used) | ☐ | ☐ | ☐ |

## Notes

- Do not mark a screen done until P0 Android + P0 iPhone pass.
- Prefer physical devices for location/background; simulators for layout.
