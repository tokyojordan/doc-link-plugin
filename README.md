# Appian Doc Link Modifier

A Chrome extension that copies Appian documentation URLs with the version number replaced by `latest` — one click, no manual editing.

## What it does

When browsing [docs.appian.com](https://docs.appian.com), version-specific URLs like:

```
https://docs.appian.com/suite/help/26.2/Record_Type_Security.html
```

become:

```
https://docs.appian.com/suite/help/latest/Record_Type_Security.html
```

## Features

- **Popup UI** — click the toolbar icon to see the original and modified URL side by side, then copy with one click
- **Floating button** — a "📋 Appian Doc" button appears in the corner of every Appian docs page for instant copying
- Works only on `docs.appian.com` — no permissions on any other sites

## Installation

### From the Chrome Web Store
Search for **Appian Doc Link Modifier** on the [Chrome Web Store](https://chrome.google.com/webstore).

### Manual install (developer mode)
1. Clone or download this repo
2. Go to `chrome://extensions/`
3. Enable **Developer mode** (top right)
4. Click **Load unpacked** and select this folder

## Files

| File | Purpose |
|------|---------|
| `manifest.json` | Extension configuration (Manifest V3) |
| `popup.html` / `popup.js` | Toolbar popup UI |
| `content.js` | Floating button injected into docs pages |
| `background.js` | Service worker |
| `icon*.png` | Extension icons |

## Privacy

No data is collected or transmitted. The extension only reads the URL of the current tab when you are on `docs.appian.com`. See [PRIVACY_POLICY.md](PRIVACY_POLICY.md) for details.

## License

MIT
