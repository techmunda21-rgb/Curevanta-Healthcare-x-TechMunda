# Play Store Release Checklist — Curevanta

**Gate:** Founder approval required before production submission.  
**Bundle IDs:** Proposed `com.curevanta.*` — confirm before production.

## Pre-submit

- [ ] Production AAB built via EAS `production` profile
- [ ] Current Google Play target API / 64-bit requirements verified (do not assume stale docs)
- [ ] Privacy policy URL live
- [ ] Support URL / email live
- [ ] Permission rationale strings reviewed (location, notifications, camera)
- [ ] Data safety form completed accurately
- [ ] Store listing: short + full description, icon, feature graphic, screenshots
- [ ] Reviewer test account (non-PHI) prepared
- [ ] Crash reporting enabled for release
- [ ] No secrets in binary / logs
- [ ] Release notes written

## Apps

| App | Package (proposed) | Ready |
|-----|--------------------|-------|
| Patient | `com.curevanta.patient` | ☐ |
| Doctor | `com.curevanta.doctor` | ☐ |
| Career | `com.curevanta.career` | ☐ |

Dev/preview packages currently use `.dev` suffix — do not submit those to production.
