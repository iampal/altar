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
