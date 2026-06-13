# Big Lads World Tour '26

A single page site for the lads trip to Amsterdam. Hero with 3D Amsterdam crosses, a live countdown and weather, a browsable list of spots with info and favourites, a four day planner, a coffeeshop strain guide, and a few in jokes. Built in plain HTML, CSS and JavaScript with native ES modules, so it needs no build and drops straight onto static hosting.

## Quick start

```
npm install      # only needed for the local dev server
npm run dev       # live reloading dev server (Vite)
```

Or skip npm entirely and open `index.html` through any static file server.

## Deploy

Upload `index.html` and the `assets` folder to Hostinger as they are. There is no build step. If you want an optimised bundle instead, run `npm run build` and deploy the `dist` folder.

## Editing the spots

All the data is in `assets/js/data.js`. Add a place by adding one object to the `PLACES` array. The shape and the rules are documented in `CLAUDE.md`, or use the `/add-place` command in Claude Code.

## House rule

No hyphens or em dashes in any copy on the site. Reword instead. Existing price ranges from Google that use an en dash, like "€10–20", are the one exception and stay as they are.

## Structure

```
index.html            markup and the script tags
assets/styles.css     all styles, tokens in :root
assets/js/data.js     the spots and config
assets/js/app.js      all behaviour
CLAUDE.md             full project context for Claude Code
.claude/commands/     project slash commands
```

## Stack

Vanilla JS, Three.js, GSAP with ScrollTrigger and Lenis from a CDN, Open-Meteo for live weather, and localStorage for favourites and the planner. No backend.
