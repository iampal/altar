# Launch & Growth Dashboard

A lightweight, responsive dashboard for keeping a small product launch and content workflow organized. It runs as a standalone HTML page: no framework, build step, server, account, or third-party dependency required.

## Use it

1. Download or clone this repository.
2. Open `index.html` in a modern browser.
3. Select **Edit dashboard** to change the outlined text. Use **+ Add checklist item** to grow the checklist; each task can also be removed.
4. Tick tasks and write in the notes area as you work.

Edits, checklist state, and notes are saved in the browser's `localStorage` on that device. Nothing is sent to a server, and data does not automatically sync between browsers or devices. Use the browser's print dialog to print or save a PDF.

## Customize

The dashboard ships with generic example launch tasks, reminder rows, and finance/technology content prompts. Replace them with your own details using edit mode. To change layout, colors, starter content, or behavior, edit `index.html` directly.

## Privacy

This is a static client-side application. It has no analytics, external scripts, network requests, or account system. Browser-local data remains in that browser profile. Do not treat `localStorage` as an encrypted vault; anyone using the same browser profile may be able to view it.

## Contributing

Bug reports and small improvements are welcome. Please keep the app dependency-free and preserve its offline-friendly behavior. See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT. See [LICENSE](LICENSE).
