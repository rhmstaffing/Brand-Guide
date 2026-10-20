# RHM Staffing Solutions: marketing website UI kit

Click-through recreation of a marketing site for RHM Staffing Solutions. No existing website code or Figma was provided, so this kit is **composed from the brand assets and copy brief**, not copied from a live site.

Screens (switch via the header nav; last page is remembered):
- **Home**: grain hero, industries grid, 4-step screening, staffing types on glass cards, client / contractor split.
- **For clients**: challenges tabs (retention, conversion, time to fill), services grid, industry tags.
- **For contractors**: benefits grid, filterable job list, apply dialog, success toast.
- **Careers at RHM**: recruiter hiring page in the excited, Gen Z voice.
- **Contact**: hiring / job seeker toggle form.

Files: `index.html` (app shell + router), `Chrome.jsx` (SiteHeader, SiteFooter, Section, Hero), one `*Screen.jsx` per page. All primitives come from the design-system bundle (`window.RHMStaffingDesignSystem_7f6616`).
