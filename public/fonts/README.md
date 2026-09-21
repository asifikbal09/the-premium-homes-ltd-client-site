# Custom Fonts Directory

This folder is configured to host local font files for the project.

# Custom Fonts Directory

This folder is configured to host local font files for the project.

## K Victor Trial Setup

Place your **K Victor Trial** (or Victor Serif) font files directly into this folder (`public/fonts/`):

- `KVictorTrial-Regular.woff2` (or `.woff`, `.otf`, `.ttf`)
- `KVictorTrial-Medium.woff2` (or `.woff`, `.otf`, `.ttf`)
- `KVictorTrial-SemiBold.woff2` (or `.woff`, `.otf`, `.ttf`)
- `KVictorTrial-Bold.woff2` (or `.woff`, `.otf`, `.ttf`)
- `KVictorTrial-Italic.woff2` (or `.woff`, `.otf`, `.ttf`)

Alternative naming conventions like `K-Victor-Trial-Regular.*` or `K Victor Trial Regular.*` are also supported.

The `@font-face` definitions in `app/globals.css` are pre-configured to:

1. Detect if "K Victor Trial" is installed locally on your system (`local("K Victor Trial")`, etc.).
2. Automatically load the webfont files from `/fonts/` as soon as they are placed in this folder.
3. Fall back gracefully to editorial serif typefaces (`Playfair Display`, Didot, Georgia, serif).
