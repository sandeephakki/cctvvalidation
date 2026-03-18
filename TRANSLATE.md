# HakkiEye Translation Guide

Thank you for helping make HakkiEye available in your language!

## How to contribute a translation

1. Open `src/i18n/strings.js`
2. Find the section for your language (e.g. `kn:` for Kannada)
3. Replace every English value with your translation
4. Remove the `// TODO` comment at the top of your language block
5. Submit a pull request

## Rules

- Never change the **key names** (e.g. `btn_continue`, `check1_title`) — only change the values
- Keep `{placeholders}` like `{appName}`, `{months}`, `{quotedMP}` exactly as-is — they get replaced at runtime
- Do not translate `appName` (it's always "HakkiEye")
- Keep `appTagline` in English on the language selection screen only
- Use plain, everyday language — zero jargon. Imagine explaining to your parents.

## Language codes

| Code | Language  | Script     |
|------|-----------|------------|
| en   | English   | Latin      |
| kn   | Kannada   | Kannada    |
| hi   | Hindi     | Devanagari |
| mr   | Marathi   | Devanagari |
| ta   | Tamil     | Tamil      |
| te   | Telugu    | Telugu     |
| gu   | Gujarati  | Gujarati   |
| pa   | Punjabi   | Gurmukhi   |
| bn   | Bengali   | Bengali    |

## Testing your translation

```bash
npm run dev
```

Open the app, select your language on Screen 1, and walk through the full flow.
Check that all buttons, instructions, and report text appear correctly.

## Questions?

Open a GitHub issue or email contact@hakki.app
