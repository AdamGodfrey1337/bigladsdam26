Add a new spot to the Amsterdam site the right way.

The place to add: $ARGUMENTS

Do this:

1. Open `assets/js/data.js` and find the `PLACES` array.
2. Add one new object in the right category block, matching the shape of the
   ones around it. The fields are:
   - `n`: the official name exactly as Google shows it, so the maps link finds
     it. Keep any real hyphen a brand genuinely uses.
   - `cat`: one of Eat, Drink, Coffeeshops, Shops, See & Do, Stay.
   - `type`: a short label for the row, two or three words.
   - `r`: the Google rating, a number like 4.4.
   - `rev`: the review count, a whole number.
   - `price`: a Google price range like "€10–20", or `null` if unknown. The en
     dash in a price range is the one allowed exception to the hyphen rule.
   - `label`: only when `n` is long or has a noisy suffix. Otherwise leave it
     off, since `display()` already trims a trailing "Amsterdam ..." for you.
   - `desc`: a sentence or two with a bit of personality. No hyphens, no em
     dashes. Reword instead.
3. Keep the running joke in mind. Woven in lightly is good, forced is not.
4. Verify nothing broke:
   `cp assets/js/data.js /tmp/data.mjs && node --check /tmp/data.mjs`
5. Read the new `desc` back and confirm there is not a single hyphen or em dash
   in it. This is the rule that matters most.

Then tell me what you added and show the object.
