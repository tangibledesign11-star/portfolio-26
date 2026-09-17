# Portfolio 2026

Minimal, blank Astro project foundation for Pushkar's Product Design Portfolio.

## Commands

All commands are run from the project root:

| Command | Action |
| :--- | :--- |
| `npm run dev` | Starts local development server at `http://localhost:4321` |
| `npm run build` | Builds the production site to `./dist/` |
| `npm run preview` | Previews the production build locally |

## Project Structure

```text
/
├── public/                 # Static assets (favicons, etc.)
│   ├── favicon.ico
│   └── favicon.svg
├── src/
│   ├── layouts/
│   │   └── RootLayout.astro # Base HTML shell + <ClientRouter />
│   └── pages/
│       └── index.astro      # Minimal Home page (/)
├── astro.config.mjs         # Astro configuration
├── package.json
└── tsconfig.json            # Strict TypeScript configuration
```
