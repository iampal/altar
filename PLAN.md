# ALTAR implementation scope

## Product direction

ALTAR (Automated Launch Tracker and Reporting) is a local-first dashboard that combines launch execution, social-channel metrics, campaign attribution, content preparation, and milestone sharing for creators and indie hackers.

## Current implementation

The static app uses plain HTML, CSS, and JavaScript. `index.html` contains page structure, `styles.css` provides responsive dark dashboard styling, and `app.js` owns state, view rendering, browser storage, and interactions. No server or external account is required to run the core experience.

- Channel analytics and source conversion: user-entered metrics stored locally.
- UTM generation: browser-native URL parsing/parameter construction.
- Copy studio: platform-specific starter drafts and explicit copyable prompts for an external AI tool; not an AI service integration.
- Launch commander: local deadline countdown and checklist.
- Milestone card: browser canvas render, PNG download, and X share intent.
- GitHub: explicit fetch of public repository totals from the GitHub REST API.
- Product Hunt/social accounts: manual metrics; OAuth-backed access is not included.

## Integration and privacy constraints

Never commit provider credentials or place long-lived tokens in public frontend code or localStorage. Real social analytics need separately registered OAuth clients, approved scopes, and secure backend token handling. Product Hunt's official API terms state commercial use requires prior contact; keep that provider manual until terms and authorization are settled. The repository is public; sample data and app copy must remain generic.

## Feature additions (2026-11-13)

The Connections page now fetches one public Hacker News item’s score/comments, records Product Hunt and Reddit counters manually, and provides Markdown plus print-to-PDF reports. Appearance controls offer light/dark mode and three accent palettes. Discord, Slack, and Telegram alert delivery is implemented directly from the browser, but credentials remain in memory only and may encounter provider CORS policies. Optional GitHub/HN polling runs every five minutes only while the page is open; this is not a server-side or guaranteed real-time monitor.

Product Hunt stays manual until commercial-use permission is obtained. A production multi-user webhook service should use a protected backend relay and encrypted per-user credentials rather than exposing secrets in frontend code.
