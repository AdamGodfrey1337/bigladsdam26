Audit the current change against the project standards in CLAUDE.md.

Focus, if given: $ARGUMENTS

Work through this checklist and report pass or fail on each, with the exact file
and line for anything that needs fixing.

1. No hyphens or em dashes in any copy a person reads. Check headings, body
   text, button labels, placeholders, aria labels, alt text and any string that
   app.js renders. The only allowed exceptions are Google price ranges that use
   an en dash, like "€10–20", and proper brand names that genuinely contain a
   hyphen, like Ice-o-lator.
2. The JavaScript parses:
   `cp assets/js/app.js /tmp/app.mjs && node --check /tmp/app.mjs`
   `cp assets/js/data.js /tmp/data.mjs && node --check /tmp/data.mjs`
3. Every external library is guarded. Three.js, GSAP, Lenis and the weather
   fetch must each fail without throwing, and the content must still show.
4. All localStorage access sits inside try and catch.
5. prefers-reduced-motion is respected. The 3D scene paints one still frame and
   the reveal animations are skipped.
6. The 3D loop still pauses when the hero leaves the viewport and when the tab
   is hidden, and the pixel ratio is still capped.
7. It holds up at 320px, 375px and a wide desktop. No horizontal scroll, no
   clipped text, tap targets stay thumb friendly.
8. Favourites and the planner still save to localStorage and reload correctly.
9. Colours and fonts use the tokens in :root. No new one off colours.

Report the findings as a short list. Do not change anything unless I ask.
