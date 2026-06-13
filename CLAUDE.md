# CLAUDE.md

Context for Claude Code working in this repo. Read this first, then follow it.

## What this is

A single page website for a lads trip to Amsterdam (the "Big Lads World Tour '26"). It is a fun, high energy microsite: a hero with floating 3D Amsterdam crosses, a live countdown, live weather, a browsable list of saved spots with info and favourites, a four day planner, a coffeeshop strain guide, and a couple of in jokes. The audience is four mates, mostly on phones. The owner, Adam, is a professional web developer, so the bar is production quality, not a toy.

## The one rule that matters most

Never use hyphens or em dashes in any copy, anywhere. No "-" and no "—" in headings, body text, button labels, descriptions, alt text, commit messages, or anything a person reads. Write around it: use a comma, "and", a full stop, or reword. The only exception is existing data already pulled from Google, such as the price ranges like "€10–20" which use an en dash. Leave those as they are. Proper names that genuinely contain a hyphen (for example a product called Ice-o-lator) keep their real spelling.

## Tech

* Plain HTML, CSS and JavaScript. No framework.
* Native ES modules. `assets/js/app.js` is a module that imports the data from `assets/js/data.js`. There is no build step required.
* Libraries load from a CDN as globals: Three.js r128, GSAP 3.12 with ScrollTrigger, and Lenis. The module reads `window.THREE`, `window.gsap` and `Lenis`.
* Weather is live from the Open-Meteo API (open-meteo.com), called from the browser, no key needed.
* Persistence is `localStorage` only (favourites and the planner). There is no backend.
* It deploys as static files. You can upload `index.html` and the `assets` folder straight to Hostinger.

## Structure

```
amsterdam-big-lads/
  index.html              markup, CDN script tags, the module script tag
  assets/
    styles.css            all styles, design tokens live in :root
    js/
      data.js             PLACES, CATS, TRIP_DATE, STRAINS (the only place to edit data)
      app.js              all behaviour, imports from data.js
  CLAUDE.md               this file
  README.md               human setup and deploy notes
  package.json            optional dev server (Vite)
  .gitignore
  .claude/commands/       project slash commands for Claude Code
```

Keep this shape. If `app.js` grows large, it is fine to split it into smaller modules (for example `list.js`, `planner.js`, `hero3d.js`, `weather.js`) and import them from a small `main.js`. If you do that, watch the load order and avoid circular imports: the list render calls the planner render, so dependencies should flow one way.

## Data model

Everything lives in `data.js`. To add a spot, add one object to `PLACES`:

```js
{
  n: "Official name as it appears in Google",   // used for the maps link, keep it findable
  cat: "Eat",          // one of: Eat, Drink, Coffeeshops, Shops, See & Do, Stay
  type: "Sushi",       // short label shown on the row
  r: 4.3,              // rating
  rev: 1712,           // review count
  price: "€10–20",     // optional, null if unknown (en dash here is fine, it is Google data)
  label: "Short name", // optional, shown instead of n when the real name is long or noisy
  desc: "A sentence or two, no hyphens."  // shown when the row is expanded
}
```

`display()` in `app.js` trims a trailing "Amsterdam ..." from `n` when there is no `label`, so most rows read cleanly without one. Add a `label` only when the name is long or has a suffix that looks bad.

`STRAINS` drives the coffeeshop guide. Each item is `{ n, t, s, note }` where `t` is Sativa, Indica, Hybrid or Hash, and `s` is strength from 1 to 5. The guide is a general reference, not a live menu, and the page says so. Do not present it as live stock.

`TRIP_DATE` is the countdown target. Currently the early Monday flight on 2026-03-23. Change it in one place when the time firms up.

## House style for code

* Defensive and plain. Function expressions and string concatenation are used throughout rather than template literals, and there is an `escAttr` helper for values that go into attributes. Match the existing style when you edit.
* Guard every external library. If Three.js, GSAP, Lenis or the weather fetch fails, the content must still show and the page must not throw. Look at how `initHero3D`, the GSAP block and the weather module already do this and keep that pattern.
* Wrap all `localStorage` access in try and catch. It must degrade silently when storage is blocked.
* Respect `prefers-reduced-motion`. Animations are skipped or reduced when it is set. The 3D scene paints a single still frame in that mode.
* Performance: the 3D render loop pauses when the hero scrolls out of view and when the tab is hidden, and the pixel ratio is capped. Do not remove these guards.
* Mobile first. Everything must work and read well from 320px up. The list rows, planner, strain grid, weather and the feature buttons all need to size down. Test narrow before you call it done.
* Accessibility: keep focus styles, keep aria labels on icon buttons, keep the canvas marked aria-hidden, and keep tap targets large enough for thumbs.

## Design tokens

Colours and fonts are CSS variables in `:root` in `styles.css`. The palette is Dutch Oranje: a midnight navy background, vivid orange accent, electric blue as a secondary, gold for the rating stars, and a cool off white for text. Orange carries the structure, gold is only for the stars, blue is used sparingly. Fonts are Big Shoulders Display for the big type, Inter for body, Space Mono for labels. Keep new UI on these tokens rather than introducing new colours.

## Features that already exist

Hero with the 3D crosses and a live Amsterdam clock, a countdown to the trip with a flights subline, a live weather panel with a seasonal packing note, the spot list with search, category filters, per device favourites, a random picker and tap to expand info with maps and directions links, a four day planner (Monday to Thursday) that fills from saved spots and has an auto plan button, the strain guide, a "how much will James eat" generator with a do not feed sign, the squad line up, and the footer.

## Definition of done

Before you consider a change finished:

1. No hyphens or em dashes in any visible copy.
2. No console errors. Open it and check.
3. It works at 320px, 375px and a wide desktop. No horizontal scroll, no clipped text.
4. Reduced motion still looks right.
5. Favourites and the planner still save and reload.
6. The JavaScript parses. Run the syntax check below.

## Run, build, deploy

* Local dev: `npm install` then `npm run dev` for a live reloading server, or just open `index.html` through any static server.
* Deploy: upload `index.html` and the `assets` folder to Hostinger as they are. No build needed.
* Vercel: `vercel.json` deploys the site statically from the root with no build. Import the repo and it serves as is. To ship the optimised bundle on Vercel instead, set the build command to `npm run build` and the output directory to `dist`.
* Optional optimised bundle: `npm run build` outputs to `dist`. You can deploy that instead, but it is not required.

## Quick verification

Syntax check the logic without a browser:

```
cp assets/js/app.js /tmp/app.mjs && node --check /tmp/app.mjs
cp assets/js/data.js /tmp/data.mjs && node --check /tmp/data.mjs
```

## Trip facts

Monday 23 to Thursday 26 March 2026, three nights, early flight out of Manchester and a late one home, which gives four usable days. Four lads: Adam Godfrey (07), Ethan Taylor (09), James Forrester (10), Carl Youngman (14). The running joke is "he's a big lad for 14", and it should stay woven through the copy.

## Roadmap, when asked

* Live venue data (real opening hours, photos, current reviews) needs the Google Places API with a key behind a small serverless function. This cannot live in the static file safely. Set up the function first, then fetch from it.
* A shared plan and a group vote across all four phones needs a backend. Supabase fits, since Adam already uses it. This replaces the per device localStorage with synced state.
* A colour coded map near the WestCord hotel using Leaflet and OpenStreetMap tiles.
* A live theme switcher across a few palettes.

## Working with Claude Code

Project slash commands live in `.claude/commands`. There is `/add-place` for adding a venue to the data the right way, and `/audit` for checking a change against the standards above. Add more as the project grows. Whatever you write for a person to read, remember the no hyphen rule.
