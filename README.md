# ALTAR — Automated Launch Tracker and Reporting

Created by [iampal](https://github.com/iampal).

ALTAR is a local-first launch and social-growth command center for creators and indie hackers. It brings campaign metrics, public launch counters, reporting, notifications, and launch tasks into one browser workspace.

## Run it

Open `index.html` in a modern browser. No build step or package installation is needed. A local static server or HTTPS site is recommended for browser clipboard, API, and webhook features. Your workspace is stored in this browser’s `localStorage`; it does not sync between devices. Use **Export** to download a JSON workspace backup.

## Features

- Track manual metrics for social, community, Product Hunt, newsletter, and developer channels; compare impressions, clicks, signups, and conversion.
- Build UTM links and record referral-source outcomes.
- Top-line clicks/signups use referral-source totals when any are recorded; channel metrics remain visible separately so the same visits are not added twice.
- Fetch public GitHub stars, forks, and open issues.
- Fetch one Hacker News story’s public score, comments, and title from the official HN Firebase API by pasting its URL or item ID.
- Keep Product Hunt and Reddit post metrics manually, alongside HN and GitHub counters.
- Export an executive-style Markdown launch report or print the report and choose **Save as PDF** in your browser’s print dialog.
- Connect Discord, Slack, or Telegram webhooks for a test message, star/score alerts, and a configurable milestone threshold. When connected, ALTAR polls GitHub/HN every five minutes while the tab stays open; this is periodic polling, not a server-side push subscription.
- Choose dark/light mode and Cyberpunk Purple, Neon Emerald, or Minimal Monolith accent palettes.
- Prepare platform-specific copy starters and an AI-ready prompt without shipping an AI key.
- Manage a launch countdown, checklist, milestone card, and JSON backup.

## API and integration boundaries

**Hacker News:** ALTAR uses the official public Firebase item endpoint to read a specific story/poll’s score and descendant/comment count. HN describes its API as public and near-real-time. The connection uses no account token. It fetches the selected item rather than discovering every repost automatically.

**Product Hunt:** Counters are manual. Product Hunt’s official API documentation requires an access token and says the API must not be used for commercial purposes unless you contact Product Hunt first. Do not add a live integration for a commercial ALTAR deployment until Product Hunt grants permission and the app has secure token handling.

**Reddit and social analytics:** Reddit counters and other social-account analytics remain manual in this static version. Live analytics require platform-specific OAuth, approved permissions, and secure server-side token storage.

**GitHub:** Public repository totals are fetched from GitHub’s unauthenticated REST API; they are not private profile or traffic analytics. GitHub/HN notification monitoring polls at five-minute intervals only after a webhook is configured and while this browser tab is open. Keep the tab open; a static browser app cannot guarantee background or server-side alerts.

**Webhooks:** Discord and Slack incoming webhook URLs, plus Telegram bot tokens, are secrets. ALTAR holds them only in JavaScript memory for the current tab; it clears the visible fields after connecting and never writes them to `localStorage`, export files, or Git. Reloading or disconnecting clears the app’s connection. Direct browser requests can be blocked by provider CORS/network policies, and a browser-only app is not a secure relay. Check the destination before retrying a test if delivery status is uncertain. For a public multi-user service, use a server-side relay with per-user encrypted secrets and rate limits. Never commit webhook URLs or tokens.

**Reports and themes:** Markdown reports are downloaded locally. PDF output uses the browser’s print dialog; choose **Save as PDF**. Theme selections are saved in local browser storage with the rest of the workspace.

## Privacy

ALTAR has no account system or server-side workspace storage. It references Google Fonts for typography. External data requests happen when the user asks to fetch GitHub/HN metrics or explicitly configures webhook monitoring. Do not store passwords, OAuth credentials, API keys, or webhook secrets in this public frontend.

## References

- [Official Hacker News API](https://github.com/HackerNews/API)
- [Product Hunt API terms and authentication](https://api.producthunt.com/v2/docs)
- [GitHub REST API: repositories](https://docs.github.com/en/rest/repos/repos)
- [Discord webhook resource](https://docs.discord.com/developers/resources/webhook)
- [Slack incoming webhooks](https://docs.slack.dev/messaging/sending-messages-using-incoming-webhooks)
- [Telegram Bot API: sendMessage](https://core.telegram.org/bots/api#sendmessage)

## License

MIT. See [LICENSE](LICENSE).
