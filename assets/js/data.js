// data.js
// The only place to edit content. PLACES, CATS, TRIP_DATE and STRAINS.
// House rule: no hyphens or em dashes in any copy a person reads.
// The one exception is Google price ranges that use an en dash, like "€10–20".

// Countdown target. The early Monday flight out of Manchester on 2026-03-23.
// Manchester sits on GMT that weekend, so this is pinned to UTC. Change it here
// in one place when the time firms up.
export var TRIP_DATE = new Date("2026-03-23T06:00:00Z");

// Categories in display order. Each has a short key, a label and an icon.
// The list and the filter bar both read from this.
export var CATS = [
  { key: "Eat", label: "Eat", icon: "🍽️" },
  { key: "Drink", label: "Drink", icon: "🍺" },
  { key: "Coffeeshops", label: "Coffeeshops", icon: "🌿" },
  { key: "Shops", label: "Shops", icon: "🛍️" },
  { key: "See & Do", label: "See & Do", icon: "🎟️" },
  { key: "Stay", label: "Stay", icon: "🛏️" }
];

// The spots. To add one, copy an object and fill it in. See CLAUDE.md for the
// shape and the rules. Keep "n" findable on Google, it powers the maps link.
export var PLACES = [
  // Eat
  {
    n: "The Pancake Bakery",
    cat: "Eat",
    type: "Pancakes",
    r: 4.4,
    rev: 9800,
    price: "€10–20",
    desc: "Proper Dutch pancakes the size of a steering wheel, sweet or savoury, in a snug cellar off the Prinsengracht. A solid first feed."
  },
  {
    n: "Winkel 43",
    cat: "Eat",
    type: "Apple pie",
    r: 4.5,
    rev: 6200,
    price: "€5–15",
    desc: "The apple pie that gets all the hype, and it earns it. Warm, towering, with a mountain of cream. Get there before the queue does."
  },
  {
    n: "Vleminckx Sausmeester",
    cat: "Eat",
    type: "Fries",
    r: 4.5,
    rev: 14000,
    price: "€3–8",
    label: "Vleminckx Frites",
    desc: "A hole in the wall doing the best frites in town since 1957. Get the joppiesaus and thank us later."
  },
  {
    n: "Foodhallen Amsterdam",
    cat: "Eat",
    type: "Food hall",
    r: 4.3,
    rev: 17500,
    price: "€10–25",
    desc: "An indoor food hall in an old tram depot. Everyone picks something different, nobody argues, and the bar sits right in the middle."
  },
  {
    n: "The Butcher",
    cat: "Eat",
    type: "Burgers",
    r: 4.3,
    rev: 5400,
    price: "€10–20",
    desc: "Serious burgers in De Pijp with a secret bar hidden behind a door at the back. Ask nicely and see how far you get."
  },
  {
    n: "Sir Hummus",
    cat: "Eat",
    type: "Hummus",
    r: 4.6,
    rev: 2100,
    price: "€8–15",
    desc: "A tiny spot doing some of the best hummus you will eat, run by lads who take it very seriously. Cheap and cheerful."
  },
  {
    n: "FEBO",
    cat: "Eat",
    type: "Snack wall",
    r: 4.0,
    rev: 3300,
    price: null,
    desc: "Hot snacks straight out of a wall of little windows. Drop in a coin, grab a kroket, keep walking. Peak Amsterdam at two in the morning."
  },
  {
    n: "Kapsalon Granada",
    cat: "Eat",
    type: "Kapsalon",
    r: 4.4,
    rev: 1900,
    price: "€6–12",
    desc: "Fries, shawarma, cheese and salad in one glorious tray. Invented in Rotterdam, perfected for nights like ours. James orders two."
  },

  // Drink
  {
    n: "Brouwerij 't IJ",
    cat: "Drink",
    type: "Brewery",
    r: 4.5,
    rev: 12000,
    price: "€5–12",
    desc: "A brewery in the shadow of a windmill on the east side. Sit outside with a tasting paddle and watch the afternoon vanish."
  },
  {
    n: "Wynand Fockink",
    cat: "Drink",
    type: "Jenever house",
    r: 4.6,
    rev: 3800,
    price: "€5–15",
    desc: "A jenever tasting house from 1679, no stools, just you and a glass filled to the very brim. Lean in for the first sip without using your hands."
  },
  {
    n: "Café de Dokter",
    cat: "Drink",
    type: "Tiny bar",
    r: 4.6,
    rev: 900,
    price: "€6–14",
    desc: "The smallest bar in the city, candlelit and full of old curiosities. Four of us walk in and it is basically full."
  },
  {
    n: "Café de Sluyswacht",
    cat: "Drink",
    type: "Canal bar",
    r: 4.5,
    rev: 2600,
    price: "€5–12",
    desc: "A wonky old building leaning over the water by the lock. Grab a beer on the terrace and watch the boats go by."
  },
  {
    n: "Hannekes Boom",
    cat: "Drink",
    type: "Waterside bar",
    r: 4.4,
    rev: 5200,
    price: "€5–14",
    desc: "An easygoing bar right on the water with a big terrace. Good for an afternoon that quietly turns into an evening."
  },
  {
    n: "Door 74",
    cat: "Drink",
    type: "Cocktail bar",
    r: 4.6,
    rev: 1500,
    price: "€12–18",
    desc: "A hidden cocktail bar behind an unmarked door. Book ahead, smarten up, and let the bartenders make the calls."
  },
  {
    n: "Café Belgique",
    cat: "Drink",
    type: "Beer bar",
    r: 4.5,
    rev: 2400,
    price: "€4–10",
    desc: "A tiny pub with a huge list of Belgian beers on tap. Strong stuff, so pace yourself, big lad."
  },
  {
    n: "TonTon Club Centrum",
    cat: "Drink",
    type: "Arcade bar",
    r: 4.4,
    rev: 1200,
    price: "€4–12",
    desc: "Arcade games and pinball with cold beer and fresh pizza. Settle the rankings here before anyone gets too cocky."
  },

  // Coffeeshops
  {
    n: "The Bulldog The First",
    cat: "Coffeeshops",
    type: "Coffeeshop",
    r: 4.2,
    rev: 9000,
    price: null,
    desc: "The original coffeeshop, open since 1975, right on the canal in the old quarter. More tourist trail than local secret, but worth seeing once."
  },
  {
    n: "Boerejongens",
    cat: "Coffeeshops",
    type: "Coffeeshop",
    r: 4.7,
    rev: 3400,
    price: null,
    desc: "A spotless counter with staff who actually know their stuff and serve you like a proper shop. Quality is the whole point here."
  },
  {
    n: "Grey Area Coffeeshop",
    cat: "Coffeeshops",
    type: "Coffeeshop",
    r: 4.6,
    rev: 2800,
    price: null,
    desc: "A legendary little room run by two Americans. Often a queue, sometimes shut when they fancy a day off. Worth the wander."
  },
  {
    n: "Dampkring",
    cat: "Coffeeshops",
    type: "Coffeeshop",
    r: 4.4,
    rev: 4100,
    price: null,
    desc: "The one from the Ocean's Twelve scene, warm wooden interior and a long menu. Busy, friendly and very central."
  },
  {
    n: "Barney's Coffeeshop",
    cat: "Coffeeshops",
    type: "Coffeeshop",
    r: 4.4,
    rev: 5200,
    price: null,
    desc: "Breakfast and a smoke under one roof. Big mornings tend to start here before anyone has agreed a plan."
  },
  {
    n: "Tweede Kamer",
    cat: "Coffeeshops",
    type: "Coffeeshop",
    r: 4.5,
    rev: 1500,
    price: null,
    desc: "Small, calm and well run, a favourite with people who know the city. No frills, just a good quiet spot."
  },
  {
    n: "Coffeeshop Hashtag",
    cat: "Coffeeshops",
    type: "Coffeeshop",
    r: 4.8,
    rev: 372,
    price: null,
    desc: "One of Adam's saved picks and it shows in the reviews. A small modern shop, calm and friendly with a tidy menu. Tap the menu link for today's list."
  },
  {
    n: "Coffeeshop Relax Amsterdam",
    cat: "Coffeeshops",
    type: "Coffeeshop",
    r: 4.7,
    rev: 779,
    price: null,
    label: "Coffeeshop Relax",
    desc: "Right in the centre and exactly as relaxed as the name promises. Easy to drop into between the sights for a proper sit down."
  },
  {
    n: "Coffeeshop Sativa Amsterdam",
    cat: "Coffeeshops",
    type: "Coffeeshop",
    r: 4.8,
    rev: 763,
    price: null,
    label: "Coffeeshop Sativa",
    desc: "Top marks from the locals and a name that tells you the mood. Bright and upbeat, a safe bet for a daytime visit."
  },
  {
    n: "Coffeeshop Bagheera",
    cat: "Coffeeshops",
    type: "Coffeeshop",
    r: 4.5,
    rev: 931,
    price: null,
    desc: "A long standing neighbourhood favourite with a steady following. Unfussy, welcoming and reliably good."
  },
  {
    n: "Coffeeshop 137",
    cat: "Coffeeshops",
    type: "Coffeeshop",
    r: 4.6,
    rev: 971,
    price: null,
    desc: "A well rated local spot that keeps people coming back. Low key, friendly and easy to settle into."
  },
  {
    n: "Tha Dogg House a Snoop Dogg Store",
    cat: "Coffeeshops",
    type: "Coffeeshop",
    r: 4.9,
    rev: 233,
    price: null,
    label: "Tha Dogg House",
    desc: "The Snoop Dogg themed shop, as daft and fun as it sounds. Worth a look for the theme alone, and the reviews are sky high."
  },

  // Shops
  {
    n: "Albert Cuyp Market",
    cat: "Shops",
    type: "Street market",
    r: 4.4,
    rev: 16000,
    price: null,
    desc: "The biggest street market in the country, stalls of stroopwafels, cheese, fish and tat. Graze your way down the whole length of it."
  },
  {
    n: "Tony's Chocolonely Super Store",
    cat: "Shops",
    type: "Chocolate",
    r: 4.6,
    rev: 4200,
    price: "€5–15",
    label: "Tony's Chocolonely Store",
    desc: "A whole shop of the famous chunky chocolate, with a counter where you build your own bar. A genuinely dangerous room for James."
  },
  {
    n: "The American Book Center",
    cat: "Shops",
    type: "Books",
    r: 4.5,
    rev: 1300,
    price: null,
    desc: "Three floors of English books in the centre, great for a rainy hour and a quiet browse away from the crowds."
  },
  {
    n: "Condomerie",
    cat: "Shops",
    type: "Novelty",
    r: 4.4,
    rev: 800,
    price: null,
    desc: "The first shop in the world dedicated to one thing. More of a giggle than a serious browse, and good for a daft photo."
  },
  {
    n: "De Bijenkorf Amsterdam",
    cat: "Shops",
    type: "Department store",
    r: 4.3,
    rev: 7600,
    price: null,
    desc: "The grand department store on Dam Square. Posh, shiny and handy if someone forgot to pack a clean shirt."
  },
  {
    n: "Concerto Records",
    cat: "Shops",
    type: "Records",
    r: 4.6,
    rev: 900,
    price: null,
    desc: "A rambling record shop on the Utrechtsestraat, new and secondhand vinyl spread across several rooms. Easy to lose an hour in."
  },

  // See & Do
  {
    n: "Rijksmuseum",
    cat: "See & Do",
    type: "Art museum",
    r: 4.7,
    rev: 120000,
    price: "€22.50",
    desc: "The big one. Rembrandt, Vermeer and a building that is a work of art in itself. Book a slot and give it a couple of hours."
  },
  {
    n: "Van Gogh Museum",
    cat: "See & Do",
    type: "Art museum",
    r: 4.6,
    rev: 90000,
    price: "€20",
    desc: "The largest collection of his work anywhere, told as a proper story from start to finish. Timed tickets only, so plan it in."
  },
  {
    n: "Anne Frank House",
    cat: "See & Do",
    type: "History",
    r: 4.6,
    rev: 85000,
    price: "€16",
    desc: "A moving walk through the secret annex where she hid. Sobering and essential. Tickets go fast, so book this one early."
  },
  {
    n: "Heineken Experience",
    cat: "See & Do",
    type: "Brewery tour",
    r: 4.4,
    rev: 70000,
    price: "€21",
    desc: "A tour of the old brewery that ends, of course, with a couple of cold ones. Touristy, daft and a good laugh as a group."
  },
  {
    n: "A'DAM Lookout",
    cat: "See & Do",
    type: "Viewpoint",
    r: 4.5,
    rev: 23000,
    price: "€16.50",
    desc: "The top of the tower across the river, with a swing that hangs you out over the edge. Not one for the squeamish."
  },
  {
    n: "STRAAT Museum",
    cat: "See & Do",
    type: "Street art",
    r: 4.8,
    rev: 6500,
    price: "€19.50",
    desc: "A giant warehouse of street art and graffiti over in Noord. Loud, colourful and a brilliant couple of hours."
  },
  {
    n: "Vondelpark",
    cat: "See & Do",
    type: "Park",
    r: 4.7,
    rev: 60000,
    price: null,
    desc: "The city's favourite green space. Grab some snacks, find a bench and watch Amsterdam roll past on bikes."
  },
  {
    n: "NEMO Science Museum",
    cat: "See & Do",
    type: "Science",
    r: 4.5,
    rev: 26000,
    price: "€17.50",
    desc: "A green ship of a museum stuffed with gadgets you get to play with. The rooftop has one of the best views in town, and it is free to walk up."
  },

  // Stay
  {
    n: "WestCord Fashion Hotel Amsterdam",
    cat: "Stay",
    type: "Base camp",
    r: 4.2,
    rev: 5200,
    price: null,
    label: "WestCord Fashion Hotel",
    desc: "Home base for the trip. Comfy enough, well placed for the trams, and the bar does not shut early. Carl gets the rollaway bed, he is a big lad for 14."
  }
];

// The coffeeshop strain guide. A general reference, not a live menu.
// t is Sativa, Indica, Hybrid or Hash. s is strength from 1 to 5.
export var STRAINS = [
  { n: "Amnesia Haze", t: "Sativa", s: 5, note: "A heavy hitting haze with a citrus kick. Energetic and a bit much for beginners. Go slow." },
  { n: "White Widow", t: "Hybrid", s: 4, note: "The Dutch classic from the nineties. Balanced, sociable and easy to find on almost any menu." },
  { n: "Northern Lights", t: "Indica", s: 3, note: "Soft, sleepy and mellow. The one for a quiet night in after a very big day." },
  { n: "Super Silver Haze", t: "Sativa", s: 4, note: "Bright and buzzy with a long lift. A daytime favourite for wandering the canals." },
  { n: "OG Kush", t: "Hybrid", s: 4, note: "Earthy and strong with a proper body weight to it. Comfy sofa territory." },
  { n: "Sour Diesel", t: "Sativa", s: 4, note: "Fuel forward and fast. Chatty and a little daft, good for a laugh with the lads." },
  { n: "Bubba Kush", t: "Indica", s: 3, note: "Sweet and heavy, melts you into the seat. Save this one for the end of the night." },
  { n: "Girl Scout Cookies", t: "Hybrid", s: 5, note: "Rich, sweet and seriously potent. Respect it or it will fold you in half." },
  { n: "Lemon Haze", t: "Sativa", s: 3, note: "Zesty and uplifting without going overboard. A friendly all rounder for the daytime." },
  { n: "Blueberry", t: "Indica", s: 3, note: "Fruity and calming with a gentle landing. Tastes as good as it sounds." },
  { n: "Jack Herer", t: "Sativa", s: 4, note: "Named after the activist. Clear headed and creative, great for a museum morning." },
  { n: "Ice-o-lator", t: "Hash", s: 5, note: "Premium ice water hash, very clean and very strong. A tiny bit goes a very long way." },
  { n: "Moroccan Pollen", t: "Hash", s: 3, note: "Classic soft hash, mellow and traditional. Crumble a little into a quiet smoke." }
];

// The squad. Numbers are the running joke. Carl is a big lad for 14.
export var SQUAD = [
  { name: "Adam Godfrey", num: "07", role: "Trip captain", line: "Booked the flights, built the site, keeps the group chat alive." },
  { name: "Ethan Taylor", num: "09", role: "The navigator", line: "Has read every menu before we sit down. Knows the tram numbers off by heart." },
  { name: "James Forrester", num: "10", role: "The appetite", line: "Eats first, asks where we are eating second. Do not leave food unattended." },
  { name: "Carl Youngman", num: "14", role: "The big lad", line: "He's a big lad for 14. Gets the rollaway bed and the first round in." }
];
