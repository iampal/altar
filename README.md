# ALTAR — Automated Launch Tracker and Reporting

Created by [iampal](https://github.com/iampal).

ALTAR is a local-first launch and social-growth command center for creators and indie hackers. Track multiple channels in one place, build UTM links, record referral clicks and signups, prepare platform-specific launch copy, manage a launch checklist, and export shareable milestone cards.

## Run it

Open `index.html` in a modern browser. No build step, account, server, or package installation is needed. For clipboard and browser features, a local static server is recommended, but the core dashboard can be opened directly as a file.

## Current features

- Multi-channel manual metrics for social, community, Product Hunt, newsletter, and developer platforms.
- Roll-up of impressions, link clicks, signups, and click-to-signup conversion.
- UTM URL builder and referral-source reporting.
- Platform-specific first-draft copy plus an AI-ready prompt to paste into your preferred AI assistant.
- Editable launch countdown and execution checklist.
- Canvas-based milestone graphic with PNG download and an X share link.
- Public GitHub repository stars, forks, and open issues via GitHub’s unauthenticated REST API.
- Local workspace persistence and JSON export.

## Data and integrations

Your ALTAR workspace is stored in this browser’s `localStorage`; it does not sync across browsers or devices. Use **Export** to create a JSON backup. Do not use browser storage as a secure vault.

Social platforms such as X, Instagram, YouTube, LinkedIn, Reddit, and TikTok require platform-specific OAuth applications, permissions, and secure token handling for live analytics. This static starter does not connect those accounts or collect passwords. Enter numbers from each platform’s own analytics manually.

Product Hunt metrics are also manual in this starter. Its API requires access tokens and its official documentation says the API must not be used commercially without contacting Product Hunt. This repository does not store or request a Product Hunt token.

The Copy Studio drafts a post and an AI-ready prompt locally; it does not call an AI provider. No AI key is bundled in the public source. A production AI integration should proxy requests through a protected backend.

GitHub’s public repository endpoint provides public repo totals (stars, forks, open issues). It does not provide private account analytics or traffic data.

## Privacy

ALTAR has no analytics, external application scripts, account system, or server-side storage. The only live data request is an explicit public GitHub repository fetch initiated by the user. Google Fonts is referenced for typography; the dashboard itself remains usable with system fonts if fonts are unavailable.

## License

MIT. See [LICENSE](LICENSE).
