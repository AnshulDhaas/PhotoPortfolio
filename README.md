# Anshul Photography Gallery (Static Site)

## What’s inside
- `index.html` – homepage + master gallery
- `styles.css` – styling (supports light/dark themes)
- `app.js` – gallery data, filters, and lightbox
- `assets/` – your images

## Run locally
Option A (Python):
```bash
cd .
python -m http.server 8000
```
Then open `http://localhost:8000`.

Option B (VS Code):
Use the “Live Server” extension.

## Deploy
### Netlify
1. Drag-and-drop the **site folder** (or the zip) into Netlify “Deploys”
2. No build command needed (it's static)

### GitHub Pages
1. Create a repo and upload all files
2. Settings → Pages → deploy from `main` branch root
