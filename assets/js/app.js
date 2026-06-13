// app.js
// All behaviour for the Big Lads World Tour '26. Imports data from data.js.
// House style: plain and defensive. Function expressions and string
// concatenation. Every external library is guarded so the page still works
// and never throws if Three.js, GSAP, Lenis or the weather fetch fail.

import { PLACES, CATS, TRIP_DATE, STRAINS, SQUAD } from "./data.js";

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

var reducedMotion = false;
try {
  reducedMotion = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
} catch (e) {}

// Escape a value for safe use inside HTML text or attributes.
function escAttr(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function byId(id) { return document.getElementById(id); }

function pad(n) { return (n < 10 ? "0" : "") + n; }

function formatNum(n) {
  try { return Number(n).toLocaleString("en-GB"); } catch (e) { return "" + n; }
}

// Five star visual from a rating. The numeric rating is shown alongside for
// anyone using a screen reader, so this row is marked aria-hidden in the markup.
function stars(r) {
  var full = Math.round(Number(r) || 0);
  if (full < 0) full = 0;
  if (full > 5) full = 5;
  var s = "";
  for (var i = 1; i <= 5; i++) { s += (i <= full) ? "★" : "☆"; }
  return s;
}

// Display name. Use the label when given, otherwise trim a trailing
// "Amsterdam ..." from the Google name so rows read cleanly.
function display(p) {
  if (!p) return "";
  if (p.label) return p.label;
  var name = p.n || "";
  var idx = name.indexOf(" Amsterdam");
  if (idx > 0) name = name.slice(0, idx);
  return name;
}

function mapsUrl(p) {
  return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(p.n + " Amsterdam");
}
function dirUrl(p) {
  return "https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(p.n + " Amsterdam");
}

// Place lookup by full name.
var PLACE_BY_NAME = {};
for (var pi = 0; pi < PLACES.length; pi++) { PLACE_BY_NAME[PLACES[pi].n] = PLACES[pi]; }
function byName(n) { return PLACE_BY_NAME[n]; }

function safe(fn) {
  try { fn(); } catch (e) { if (window.console && console.warn) console.warn("Skipped a feature:", e); }
}

/* ------------------------------------------------------------------ */
/* Persistence (localStorage, always guarded)                          */
/* ------------------------------------------------------------------ */

var FAV_KEY = "blwt_favs_v1";
var PLAN_KEY = "blwt_plan_v1";

var DAYS = [
  { key: "Mon", label: "Monday", date: "23 Mar" },
  { key: "Tue", label: "Tuesday", date: "24 Mar" },
  { key: "Wed", label: "Wednesday", date: "25 Mar" },
  { key: "Thu", label: "Thursday", date: "26 Mar" }
];

var favs = loadFavs();
var plan = loadPlan();

function loadFavs() {
  try {
    var raw = localStorage.getItem(FAV_KEY);
    if (!raw) return {};
    var obj = JSON.parse(raw);
    return (obj && typeof obj === "object") ? obj : {};
  } catch (e) { return {}; }
}
function saveFavs() {
  try { localStorage.setItem(FAV_KEY, JSON.stringify(favs)); } catch (e) {}
}
function loadPlan() {
  var base = { Mon: [], Tue: [], Wed: [], Thu: [] };
  try {
    var raw = localStorage.getItem(PLAN_KEY);
    if (!raw) return base;
    var obj = JSON.parse(raw);
    if (!obj || typeof obj !== "object") return base;
    for (var i = 0; i < DAYS.length; i++) {
      var k = DAYS[i].key;
      base[k] = Array.isArray(obj[k]) ? obj[k].filter(function (n) { return !!byName(n); }) : [];
    }
    return base;
  } catch (e) { return base; }
}
function savePlan() {
  try { localStorage.setItem(PLAN_KEY, JSON.stringify(plan)); } catch (e) {}
}

function isFav(name) { return !!favs[name]; }
function placedSet() {
  var set = {};
  for (var i = 0; i < DAYS.length; i++) {
    var arr = plan[DAYS[i].key];
    for (var j = 0; j < arr.length; j++) { set[arr[j]] = true; }
  }
  return set;
}
function removeFromPlan(name) {
  for (var i = 0; i < DAYS.length; i++) {
    var k = DAYS[i].key;
    plan[k] = plan[k].filter(function (n) { return n !== name; });
  }
  savePlan();
}

/* ------------------------------------------------------------------ */
/* Live Amsterdam clock                                                */
/* ------------------------------------------------------------------ */

function initClock() {
  var els = document.querySelectorAll("[data-ams-clock]");
  if (!els.length) return;
  var tick = function () {
    var now = new Date();
    var str;
    try {
      str = now.toLocaleTimeString("en-GB", {
        timeZone: "Europe/Amsterdam",
        hour: "2-digit", minute: "2-digit", second: "2-digit"
      });
    } catch (e) {
      str = pad(now.getHours()) + ":" + pad(now.getMinutes()) + ":" + pad(now.getSeconds());
    }
    for (var i = 0; i < els.length; i++) { els[i].textContent = str; }
  };
  tick();
  setInterval(tick, 1000);
}

/* ------------------------------------------------------------------ */
/* Countdown to the trip                                               */
/* ------------------------------------------------------------------ */

function initCountdown() {
  var grid = byId("cd-grid");
  if (!grid) return;
  var d = byId("cd-days"), h = byId("cd-hours"), m = byId("cd-mins"), s = byId("cd-secs");

  var tick = function () {
    var diff = TRIP_DATE.getTime() - Date.now();
    if (diff <= 0) {
      grid.innerHTML = '<div class="cd-done">We are in Amsterdam. Game on.</div>';
      if (timer) clearInterval(timer);
      return;
    }
    var t = Math.floor(diff / 1000);
    var days = Math.floor(t / 86400); t -= days * 86400;
    var hrs = Math.floor(t / 3600); t -= hrs * 3600;
    var mins = Math.floor(t / 60); t -= mins * 60;
    var secs = t;
    if (d) d.textContent = days;
    if (h) h.textContent = pad(hrs);
    if (m) m.textContent = pad(mins);
    if (s) s.textContent = pad(secs);
  };
  tick();
  var timer = setInterval(tick, 1000);
}

/* ------------------------------------------------------------------ */
/* Hero 3D: floating Amsterdam crosses (Three.js, guarded)             */
/* ------------------------------------------------------------------ */

function initHero3D(canvas) {
  if (!canvas) return;
  if (typeof THREE === "undefined") return; // CDN failed, hero is still fine
  try {
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.z = 9;

    var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    scene.add(new THREE.AmbientLight(0x404a7a, 0.9));
    var key = new THREE.DirectionalLight(0xffffff, 1.1); key.position.set(4, 6, 8); scene.add(key);
    var rim = new THREE.DirectionalLight(0x3a86ff, 0.7); rim.position.set(-6, -2, 4); scene.add(rim);

    var makeCross = function () {
      var group = new THREE.Group();
      var geo = new THREE.BoxGeometry(0.5, 2.7, 0.5);
      var mat = new THREE.MeshStandardMaterial({
        color: 0xff6a13, roughness: 0.35, metalness: 0.15,
        emissive: 0x5a2000, emissiveIntensity: 0.45
      });
      var b1 = new THREE.Mesh(geo, mat); b1.rotation.z = Math.PI / 4;
      var b2 = new THREE.Mesh(geo, mat); b2.rotation.z = -Math.PI / 4;
      group.add(b1); group.add(b2);
      return group;
    };

    var crosses = [];
    var spots = [[-3.2, 0.4], [0, -0.3], [3.2, 0.5]];
    for (var i = 0; i < spots.length; i++) {
      var c = makeCross();
      c.position.x = spots[i][0];
      c.position.y = spots[i][1];
      c.userData.spin = 0.003 + Math.random() * 0.004;
      c.userData.phase = Math.random() * Math.PI * 2;
      c.userData.baseY = spots[i][1];
      scene.add(c);
      crosses.push(c);
    }

    var resize = function () {
      var w = canvas.clientWidth || (canvas.parentElement && canvas.parentElement.clientWidth) || window.innerWidth;
      var h = canvas.clientHeight || (canvas.parentElement && canvas.parentElement.clientHeight) || window.innerHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.position.z = (w < 700) ? 13 : 9;
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener("resize", resize);

    var clock = THREE.Clock ? new THREE.Clock() : null;
    var running = false, rafId = null, visible = true, inView = true;

    var renderFrame = function () { renderer.render(scene, camera); };

    var loop = function () {
      if (!running) return;
      var t = clock ? clock.getElapsedTime() : (Date.now() / 1000);
      for (var k = 0; k < crosses.length; k++) {
        var cr = crosses[k];
        cr.rotation.y += cr.userData.spin;
        cr.rotation.x = Math.sin(t * 0.4 + cr.userData.phase) * 0.25;
        cr.position.y = cr.userData.baseY + Math.sin(t * 0.7 + cr.userData.phase) * 0.35;
      }
      renderFrame();
      rafId = requestAnimationFrame(loop);
    };

    var start = function () { if (!running) { running = true; rafId = requestAnimationFrame(loop); } };
    var stop = function () { running = false; if (rafId) { cancelAnimationFrame(rafId); rafId = null; } };
    var manage = function () {
      if (reducedMotion) return;
      if (visible && inView) start(); else stop();
    };

    if (reducedMotion) {
      // Paint a single still frame and leave it. No loop.
      crosses[0].rotation.y = 0.5; crosses[1].rotation.y = -0.3; crosses[2].rotation.y = 0.2;
      crosses[0].rotation.x = 0.15; crosses[2].rotation.x = -0.12;
      renderFrame();
    } else {
      start();
    }

    document.addEventListener("visibilitychange", function () {
      visible = !document.hidden;
      manage();
    });

    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        inView = entries[0].isIntersecting;
        manage();
      }, { threshold: 0.01 });
      io.observe(canvas);
    }
  } catch (e) {
    // The hero is decorative. If WebGL is unavailable, carry on quietly.
  }
}

/* ------------------------------------------------------------------ */
/* Live weather (Open-Meteo, guarded)                                  */
/* ------------------------------------------------------------------ */

var WX_CODES = {
  0:  { t: "Clear sky", i: "☀️" },
  1:  { t: "Mostly clear", i: "🌤️" },
  2:  { t: "Partly cloudy", i: "⛅" },
  3:  { t: "Overcast", i: "☁️" },
  45: { t: "Fog", i: "🌫️" },
  48: { t: "Freezing fog", i: "🌫️" },
  51: { t: "Light drizzle", i: "🌦️" },
  53: { t: "Drizzle", i: "🌦️" },
  55: { t: "Heavy drizzle", i: "🌧️" },
  56: { t: "Freezing drizzle", i: "🌧️" },
  57: { t: "Freezing drizzle", i: "🌧️" },
  61: { t: "Light rain", i: "🌦️" },
  63: { t: "Rain", i: "🌧️" },
  65: { t: "Heavy rain", i: "🌧️" },
  66: { t: "Freezing rain", i: "🌧️" },
  67: { t: "Freezing rain", i: "🌧️" },
  71: { t: "Light snow", i: "🌨️" },
  73: { t: "Snow", i: "🌨️" },
  75: { t: "Heavy snow", i: "❄️" },
  77: { t: "Snow grains", i: "🌨️" },
  80: { t: "Rain showers", i: "🌦️" },
  81: { t: "Rain showers", i: "🌧️" },
  82: { t: "Heavy showers", i: "⛈️" },
  85: { t: "Snow showers", i: "🌨️" },
  86: { t: "Snow showers", i: "❄️" },
  95: { t: "Thunderstorm", i: "⛈️" },
  96: { t: "Thunderstorm", i: "⛈️" },
  99: { t: "Thunderstorm", i: "⛈️" }
};

function wxInfo(code) {
  return WX_CODES[code] || { t: "Amsterdam weather", i: "🌤️" };
}

var WX_LAT = 52.3676, WX_LON = 4.9041;

function rainIcon(r) {
  if (r == null) return "⛅";
  if (r >= 60) return "🌧️";
  if (r >= 35) return "🌦️";
  return "⛅";
}

// The four trip dates as ISO strings, derived from TRIP_DATE.
function tripDateList() {
  var y = TRIP_DATE.getUTCFullYear(), m = TRIP_DATE.getUTCMonth(), d = TRIP_DATE.getUTCDate();
  var out = [];
  for (var i = 0; i < DAYS.length; i++) {
    var dt = new Date(Date.UTC(y, m, d + i));
    out.push(dt.getUTCFullYear() + "-" + pad(dt.getUTCMonth() + 1) + "-" + pad(dt.getUTCDate()));
  }
  return out;
}

function initWeather() {
  var card = byId("weather");
  if (!card) return;

  var defaultNote =
    "Late March in Amsterdam tends to run cold to mild, often grey with a good " +
    "chance of rain. Pack layers, a waterproof and comfy shoes for the cobbles. " +
    "One smart shirt between the four of us, optimistic at best.";

  // Skeleton with two slots that fill independently.
  card.innerHTML =
    '<div class="weather-now" id="weather-now"><div class="weather-loading">Checking the sky over Amsterdam.</div></div>' +
    '<div class="weather-trip">' +
      '<div class="trip-head">Your four days <span class="trip-tag" id="trip-tag">loading</span></div>' +
      '<div class="trip-days" id="trip-days"></div>' +
    '</div>' +
    '<div class="pack-note" id="pack-note"><b>Packing call.</b> ' + escAttr(defaultNote) + '</div>';

  var nowEl = byId("weather-now");
  var daysBox = byId("trip-days");
  var tagEl = byId("trip-tag");
  var noteEl = byId("pack-note");

  var renderNowErr = function () {
    if (nowEl) nowEl.innerHTML = '<div class="weather-err">Live conditions are not loading right now. The four day outlook below still holds.</div>';
  };

  var renderPackNote = function (days) {
    if (!noteEl) return;
    var note = defaultNote;
    if (days && days.length) {
      var his = [], los = [], rains = [];
      for (var i = 0; i < days.length; i++) { his.push(days[i].hi); los.push(days[i].lo); rains.push(days[i].rain == null ? 0 : days[i].rain); }
      var maxHi = Math.max.apply(null, his), minLo = Math.min.apply(null, los), maxRain = Math.max.apply(null, rains);
      var wet = maxRain >= 50 ? "Rain looks likely, so a waterproof is not optional."
        : maxRain >= 30 ? "Showers are on the cards, so pack a light waterproof."
        : "Rain looks light, but Amsterdam can turn, so bring a jacket.";
      note = "Looking at " + minLo + "° to " + maxHi + "° across the four days. " + wet +
        " Layers, comfy shoes for the cobbles, and one smart shirt between the four of us, optimistic at best.";
    }
    noteEl.innerHTML = '<b>Packing call.</b> ' + escAttr(note);
  };

  var renderTrip = function (days, tag) {
    if (tagEl) tagEl.textContent = tag;
    if (daysBox) {
      var html = "";
      for (var i = 0; i < days.length; i++) {
        var dd = days[i];
        var ic = (dd.code != null) ? wxInfo(dd.code).i : rainIcon(dd.rain);
        html += '<div class="trip-day">' +
          '<div class="td-day">' + escAttr(dd.label) + '</div>' +
          '<div class="td-date">' + escAttr(dd.date) + '</div>' +
          '<div class="td-icon" aria-hidden="true">' + ic + '</div>' +
          '<div class="td-temps"><span class="td-hi">' + dd.hi + '°</span> <span class="td-lo">' + dd.lo + '°</span></div>' +
          (dd.rain != null ? '<div class="td-rain">' + dd.rain + '% rain</div>' : '') +
        '</div>';
      }
      daysBox.innerHTML = html;
    }
    renderPackNote(days);
  };

  var tripDates = tripDateList();
  var dayLabel = function (i) { return DAYS[i] ? DAYS[i].key : ""; };
  var dayDate = function (i) { return DAYS[i] ? DAYS[i].date : ""; };

  // Always available fallback so the trip block shows something useful offline.
  var typicalDays = function () {
    var base = [{ hi: 11, lo: 4, rain: 45 }, { hi: 11, lo: 4, rain: 45 }, { hi: 12, lo: 5, rain: 40 }, { hi: 12, lo: 5, rain: 40 }];
    var out = [];
    for (var i = 0; i < DAYS.length; i++) {
      out.push({ label: dayLabel(i), date: dayDate(i), hi: base[i].hi, lo: base[i].lo, rain: base[i].rain, code: null });
    }
    return out;
  };

  if (typeof fetch !== "function") {
    renderNowErr();
    renderTrip(typicalDays(), "Typical late March");
    return;
  }

  // Current conditions.
  var nowUrl = "https://api.open-meteo.com/v1/forecast?latitude=" + WX_LAT + "&longitude=" + WX_LON +
    "&current=temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m&timezone=Europe%2FAmsterdam";
  fetch(nowUrl).then(function (r) { if (!r.ok) throw 0; return r.json(); }).then(function (data) {
    var cur = data && data.current;
    if (!cur || cur.temperature_2m == null) { renderNowErr(); return; }
    var info = wxInfo(cur.weather_code);
    if (!nowEl) return;
    nowEl.innerHTML =
      '<div class="weather-icon" aria-hidden="true">' + info.i + '</div>' +
      '<div>' +
        '<div class="now-label">Right now in Amsterdam</div>' +
        '<div class="weather-temp">' + Math.round(cur.temperature_2m) + '°<span style="font-size:0.5em;color:var(--muted)">C</span></div>' +
        '<div class="weather-cond">' + escAttr(info.t) + '</div>' +
        '<div class="weather-rows">' +
          '<span>Wind <b>' + Math.round(cur.wind_speed_10m) + ' km/h</b></span>' +
          '<span>Humidity <b>' + Math.round(cur.relative_humidity_2m) + '%</b></span>' +
        '</div>' +
      '</div>';
  }).catch(renderNowErr);

  // Trip outlook: try a live forecast, then a historical average, then typical.
  var tryForecast = function () {
    var u = "https://api.open-meteo.com/v1/forecast?latitude=" + WX_LAT + "&longitude=" + WX_LON +
      "&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max" +
      "&start_date=" + tripDates[0] + "&end_date=" + tripDates[tripDates.length - 1] + "&timezone=Europe%2FAmsterdam";
    return fetch(u).then(function (r) { if (!r.ok) throw 0; return r.json(); }).then(function (d) {
      if (!d || d.error || !d.daily || !d.daily.time) throw 0;
      var t = d.daily.time, mx = d.daily.temperature_2m_max, mn = d.daily.temperature_2m_min,
        wc = d.daily.weather_code, pp = d.daily.precipitation_probability_max || [];
      var out = [];
      for (var i = 0; i < tripDates.length; i++) {
        var idx = t.indexOf(tripDates[i]);
        if (idx < 0 || mx[idx] == null || mn[idx] == null) throw 0;
        out.push({
          label: dayLabel(i), date: dayDate(i),
          hi: Math.round(mx[idx]), lo: Math.round(mn[idx]),
          code: wc ? wc[idx] : null,
          rain: (pp[idx] != null ? Math.round(pp[idx]) : null)
        });
      }
      return out;
    });
  };

  var tryClimatology = function () {
    var ty = TRIP_DATE.getUTCFullYear();
    var sY = ty - 10, eY = ty - 1;
    var u = "https://archive-api.open-meteo.com/v1/archive?latitude=" + WX_LAT + "&longitude=" + WX_LON +
      "&daily=temperature_2m_max,temperature_2m_min,precipitation_sum" +
      "&start_date=" + sY + "-03-20&end_date=" + eY + "-03-29&timezone=Europe%2FAmsterdam";
    return fetch(u).then(function (r) { if (!r.ok) throw 0; return r.json(); }).then(function (d) {
      if (!d || !d.daily || !d.daily.time) throw 0;
      var t = d.daily.time, mx = d.daily.temperature_2m_max, mn = d.daily.temperature_2m_min, ps = d.daily.precipitation_sum;
      var doms = [];
      for (var q = 0; q < tripDates.length; q++) { doms.push(parseInt(tripDates[q].slice(8, 10), 10)); }
      var out = [];
      for (var k = 0; k < doms.length; k++) {
        var hiSum = 0, loSum = 0, n = 0, wet = 0;
        for (var i = 0; i < t.length; i++) {
          if (t[i].slice(5, 7) === "03" && parseInt(t[i].slice(8, 10), 10) === doms[k] && mx[i] != null && mn[i] != null) {
            hiSum += mx[i]; loSum += mn[i]; n++;
            if (ps && ps[i] != null && ps[i] >= 1) wet++;
          }
        }
        if (n === 0) throw 0;
        out.push({ label: dayLabel(k), date: dayDate(k), hi: Math.round(hiSum / n), lo: Math.round(loSum / n), rain: Math.round(100 * wet / n), code: null });
      }
      return out;
    });
  };

  tryForecast().then(function (days) {
    renderTrip(days, "Live forecast");
  }).catch(function () {
    tryClimatology().then(function (days) {
      renderTrip(days, "Typical, last 10 years");
    }).catch(function () {
      renderTrip(typicalDays(), "Typical late March");
    });
  });
}

/* ------------------------------------------------------------------ */
/* Spot list: search, filters, favourites, random pick, expand         */
/* ------------------------------------------------------------------ */

var listEl, countEl, filtersEl, searchInput, pagerEl;
var state = { q: "", cat: "All", page: 1 };
var openSet = {};
var PAGE_SIZE = 8;

function filtered() {
  var q = state.q.trim().toLowerCase();
  var cat = state.cat;
  return PLACES.filter(function (p) {
    if (cat !== "All" && p.cat !== cat) return false;
    if (!q) return true;
    var hay = (p.n + " " + (p.label || "") + " " + p.type + " " + p.cat + " " + (p.desc || "")).toLowerCase();
    return hay.indexOf(q) !== -1;
  });
}

function rowHtml(p) {
  var fav = isFav(p.n);
  var open = !!openSet[p.n];
  var name = escAttr(p.n);
  var dn = escAttr(display(p));

  return '' +
    '<article class="spot' + (open ? ' open' : '') + '" data-name="' + name + '">' +
      '<div class="spot-head">' +
        '<button class="fav" type="button" aria-pressed="' + (fav ? 'true' : 'false') + '" ' +
          'aria-label="' + (fav ? 'Remove ' + dn + ' from your saved spots' : 'Save ' + dn + ' to your trip') + '" data-fav="' + name + '">' +
          (fav ? '♥' : '♡') +
        '</button>' +
        '<button class="spot-main" type="button" aria-expanded="' + (open ? 'true' : 'false') + '">' +
          '<span class="spot-name">' + dn + ' <span class="spot-type">' + escAttr(p.type) + '</span></span>' +
          '<span class="spot-info">' +
            '<span class="stars" aria-hidden="true">' + stars(p.r) + '</span> ' +
            '<span>' + (Number(p.r).toFixed(1)) + '</span> ' +
            '<span>(' + formatNum(p.rev) + ')</span>' +
            (p.price ? ' <span class="spot-price">' + escAttr(p.price) + '</span>' : '') +
          '</span>' +
        '</button>' +
        '<span class="spot-toggle" aria-hidden="true">▾</span>' +
      '</div>' +
      '<div class="spot-body">' +
        '<p class="spot-desc">' + escAttr(p.desc || "") + '</p>' +
        '<div class="spot-actions">' +
          '<a class="btn btn-ghost" href="' + escAttr(mapsUrl(p)) + '" target="_blank" rel="noopener">Open in Maps</a>' +
          '<a class="btn btn-ghost" href="' + escAttr(dirUrl(p)) + '" target="_blank" rel="noopener">Directions</a>' +
          '<button class="btn btn-ghost" type="button" data-add="' + name + '">Add to planner</button>' +
        '</div>' +
      '</div>' +
    '</article>';
}

function renderPager(total, pageCount) {
  if (!pagerEl) return;
  if (pageCount <= 1) { pagerEl.innerHTML = ""; return; }
  var p = state.page;
  pagerEl.innerHTML =
    '<button class="pager-btn" type="button" data-page="' + (p - 1) + '"' + (p <= 1 ? ' disabled' : '') + ' aria-label="Previous page">‹ Prev</button>' +
    '<span class="pager-info">Page ' + p + ' of ' + pageCount + '</span>' +
    '<button class="pager-btn" type="button" data-page="' + (p + 1) + '"' + (p >= pageCount ? ' disabled' : '') + ' aria-label="Next page">Next ›</button>';
}

function renderList() {
  if (!listEl) return;
  var arr = filtered();
  var total = arr.length;
  var pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  if (state.page > pageCount) state.page = pageCount;
  if (state.page < 1) state.page = 1;

  if (countEl) {
    var favCount = Object.keys(favs).length;
    countEl.textContent = total + (total === 1 ? " spot" : " spots") + " · " + favCount + " saved";
  }
  if (!total) {
    listEl.innerHTML = '<div class="empty">No spots match that. Try another word or clear the filters.</div>';
    renderPager(0, 1);
    return;
  }
  var start = (state.page - 1) * PAGE_SIZE;
  var slice = arr.slice(start, start + PAGE_SIZE);
  var html = "";
  for (var i = 0; i < slice.length; i++) { html += rowHtml(slice[i]); }
  listEl.innerHTML = html;
  renderPager(total, pageCount);
}

function syncFavButton(name) {
  if (!listEl) return;
  var btns = listEl.querySelectorAll(".fav");
  for (var i = 0; i < btns.length; i++) {
    if (btns[i].getAttribute("data-fav") === name) {
      var fav = isFav(name);
      btns[i].setAttribute("aria-pressed", fav ? "true" : "false");
      btns[i].textContent = fav ? "♥" : "♡";
      var dn = display(byName(name));
      btns[i].setAttribute("aria-label", fav ? "Remove " + dn + " from your saved spots" : "Save " + dn + " to your trip");
      return;
    }
  }
}

function onFav(btn) {
  var name = btn.getAttribute("data-fav");
  var nowFav = !isFav(name);
  if (nowFav) { favs[name] = true; }
  else { delete favs[name]; removeFromPlan(name); }
  saveFavs();
  syncFavButton(name);
  if (countEl) {
    var arr = filtered();
    countEl.textContent = arr.length + (arr.length === 1 ? " spot" : " spots") + " · " + Object.keys(favs).length + " saved";
  }
  renderPlanner();
}

function onToggle(mainBtn) {
  var card = mainBtn.closest(".spot");
  if (!card) return;
  var name = card.getAttribute("data-name");
  var willOpen = !card.classList.contains("open");
  card.classList.toggle("open", willOpen);
  mainBtn.setAttribute("aria-expanded", willOpen ? "true" : "false");
  if (willOpen) openSet[name] = true; else delete openSet[name];
}

function resetFilters() {
  state.q = ""; state.cat = "All"; state.page = 1;
  if (searchInput) searchInput.value = "";
  if (filtersEl) {
    var chips = filtersEl.querySelectorAll("[data-cat]");
    for (var i = 0; i < chips.length; i++) {
      chips[i].setAttribute("aria-pressed", chips[i].getAttribute("data-cat") === "All" ? "true" : "false");
    }
  }
}

function randomPick() {
  var arr = filtered();
  if (!arr.length) { resetFilters(); arr = filtered(); }
  if (!arr.length) return;
  var idx = Math.floor(Math.random() * arr.length);
  var p = arr[idx];
  openSet[p.n] = true;
  state.page = Math.floor(idx / PAGE_SIZE) + 1;
  renderList();
  if (!listEl) return;
  var cards = listEl.querySelectorAll(".spot");
  for (var i = 0; i < cards.length; i++) {
    if (cards[i].getAttribute("data-name") === p.n) {
      try {
        cards[i].scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "center" });
      } catch (e) {
        cards[i].scrollIntoView();
      }
      break;
    }
  }
}

function initList() {
  listEl = byId("spots");
  countEl = byId("list-count");
  filtersEl = byId("filters");
  searchInput = byId("search-input");
  pagerEl = byId("pager");
  var randomBtn = byId("random-btn");
  if (!listEl) return;

  // Build the filter chips: All plus each category.
  if (filtersEl) {
    var fhtml = '<button class="chip" type="button" aria-pressed="true" data-cat="All">All</button>';
    for (var i = 0; i < CATS.length; i++) {
      fhtml += '<button class="chip" type="button" aria-pressed="false" data-cat="' + escAttr(CATS[i].key) + '">' +
        '<span aria-hidden="true">' + CATS[i].icon + '</span> ' + escAttr(CATS[i].label) + '</button>';
    }
    filtersEl.innerHTML = fhtml;
    filtersEl.addEventListener("click", function (e) {
      var chip = e.target.closest("[data-cat]");
      if (!chip) return;
      state.cat = chip.getAttribute("data-cat");
      state.page = 1;
      var chips = filtersEl.querySelectorAll("[data-cat]");
      for (var k = 0; k < chips.length; k++) {
        chips[k].setAttribute("aria-pressed", chips[k] === chip ? "true" : "false");
      }
      renderList();
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", function () {
      state.q = searchInput.value || "";
      state.page = 1;
      renderList();
    });
  }

  if (randomBtn) {
    randomBtn.addEventListener("click", randomPick);
  }

  listEl.addEventListener("click", function (e) {
    var favBtn = e.target.closest(".fav");
    if (favBtn) { onFav(favBtn); return; }
    var addBtn = e.target.closest("[data-add]");
    if (addBtn) { addToPlanner(addBtn.getAttribute("data-add")); return; }
    var main = e.target.closest(".spot-main");
    if (main) { onToggle(main); return; }
  });

  if (pagerEl) {
    pagerEl.addEventListener("click", function (e) {
      var b = e.target.closest("[data-page]");
      if (!b || b.disabled) return;
      var pg = parseInt(b.getAttribute("data-page"), 10);
      if (isNaN(pg)) return;
      state.page = pg;
      renderList();
      var sec = byId("spots-section");
      if (sec) {
        try { sec.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" }); }
        catch (e2) { sec.scrollIntoView(); }
      }
    });
  }

  renderList();
}

/* ------------------------------------------------------------------ */
/* Four day planner                                                    */
/* ------------------------------------------------------------------ */

var poolEl, daysEl;

function shortestDayKey() {
  var bestKey = DAYS[0].key;
  var bestLen = plan[bestKey].length;
  for (var i = 1; i < DAYS.length; i++) {
    var k = DAYS[i].key;
    if (plan[k].length < bestLen) { bestLen = plan[k].length; bestKey = k; }
  }
  return bestKey;
}

function addToShortestDay(name) {
  if (placedSet()[name]) return;
  plan[shortestDayKey()].push(name);
  savePlan();
  renderPlanner();
}

function addToPlanner(name) {
  if (!isFav(name)) { favs[name] = true; saveFavs(); syncFavButton(name); }
  if (!placedSet()[name]) { addToShortestDay(name); }
  else { renderPlanner(); }
}

function autoPlan() {
  var names = [];
  for (var i = 0; i < PLACES.length; i++) {
    if (isFav(PLACES[i].n)) names.push(PLACES[i].n);
  }
  for (var d = 0; d < DAYS.length; d++) { plan[DAYS[d].key] = []; }
  for (var j = 0; j < names.length; j++) {
    plan[DAYS[j % DAYS.length].key].push(names[j]);
  }
  savePlan();
  renderPlanner();
}

function clearPlan() {
  for (var i = 0; i < DAYS.length; i++) { plan[DAYS[i].key] = []; }
  savePlan();
  renderPlanner();
}

function renderPlanner() {
  if (poolEl) {
    var placed = placedSet();
    var pool = [];
    for (var i = 0; i < PLACES.length; i++) {
      var nm = PLACES[i].n;
      if (isFav(nm) && !placed[nm]) pool.push(PLACES[i]);
    }
    if (!pool.length) {
      poolEl.innerHTML = '<p class="pool-empty">Heart a few spots up in the list and they will show up here, ready to drop into a day. Or hit Auto plan to spread your saved spots across the four days.</p>';
    } else {
      var ph = "";
      for (var j = 0; j < pool.length; j++) {
        ph += '<span class="pool-chip">' + escAttr(display(pool[j])) +
          ' <button type="button" aria-label="Add ' + escAttr(display(pool[j])) + ' to a day" data-pool="' + escAttr(pool[j].n) + '">+</button></span>';
      }
      poolEl.innerHTML = ph;
    }
  }

  if (daysEl) {
    var dh = "";
    for (var k = 0; k < DAYS.length; k++) {
      var day = DAYS[k];
      var items = plan[day.key];
      var inner = "";
      if (!items.length) {
        inner = '<p class="day-empty">Nothing planned yet.</p>';
      } else {
        for (var m = 0; m < items.length; m++) {
          var p = byName(items[m]);
          if (!p) continue;
          inner += '<div class="day-item">' +
            '<span><span class="di-type">' + escAttr(p.type) + '</span>' + escAttr(display(p)) + '</span>' +
            '<button type="button" aria-label="Remove ' + escAttr(display(p)) + ' from ' + day.label + '" ' +
              'data-remove-day="' + day.key + '" data-remove-name="' + escAttr(p.n) + '">×</button>' +
            '</div>';
        }
      }
      dh += '<div class="day">' +
        '<h3>' + day.label + ' <span class="date">' + day.date + '</span></h3>' +
        '<div class="day-items">' + inner + '</div>' +
        '</div>';
    }
    daysEl.innerHTML = dh;
  }
}

function initPlanner() {
  poolEl = byId("plan-pool");
  daysEl = byId("plan-days");
  var autoBtn = byId("plan-auto");
  var clearBtn = byId("plan-clear");

  if (autoBtn) autoBtn.addEventListener("click", autoPlan);
  if (clearBtn) clearBtn.addEventListener("click", clearPlan);

  if (poolEl) {
    poolEl.addEventListener("click", function (e) {
      var b = e.target.closest("[data-pool]");
      if (b) addToShortestDay(b.getAttribute("data-pool"));
    });
  }
  if (daysEl) {
    daysEl.addEventListener("click", function (e) {
      var b = e.target.closest("[data-remove-day]");
      if (!b) return;
      var dayKey = b.getAttribute("data-remove-day");
      var name = b.getAttribute("data-remove-name");
      plan[dayKey] = plan[dayKey].filter(function (n) { return n !== name; });
      savePlan();
      renderPlanner();
    });
  }

  renderPlanner();
}

/* ------------------------------------------------------------------ */
/* Strain guide                                                        */
/* ------------------------------------------------------------------ */

function renderStrains() {
  var grid = byId("strain-grid");
  if (!grid) return;
  var typeClass = { Sativa: "t-sativa", Indica: "t-indica", Hybrid: "t-hybrid", Hash: "t-hash" };
  var html = "";
  for (var i = 0; i < STRAINS.length; i++) {
    var st = STRAINS[i];
    var pips = "";
    for (var p = 1; p <= 5; p++) {
      pips += '<span class="pip' + (p <= st.s ? ' on' : '') + '"></span>';
    }
    html += '<article class="strain">' +
      '<div class="strain-top">' +
        '<span class="strain-name">' + escAttr(st.n) + '</span>' +
        '<span class="strain-type ' + (typeClass[st.t] || '') + '">' + escAttr(st.t) + '</span>' +
      '</div>' +
      '<p class="strain-note">' + escAttr(st.note) + '</p>' +
      '<div class="strength">Strength <span class="pips" aria-hidden="true">' + pips + '</span>' +
        '<span class="sr-only">' + st.s + ' out of 5</span></div>' +
      '</article>';
  }
  grid.innerHTML = html;
}

/* ------------------------------------------------------------------ */
/* How much will James eat                                             */
/* ------------------------------------------------------------------ */

var JAMES_VERBS = ["demolish", "see off", "put away", "inhale", "destroy", "make short work of"];
var JAMES_NUMS = [9, 11, 12, 14, 14, 16, 18, 20, 24];
var JAMES_FOODS = [
  "kroketten", "stroopwafels", "portions of frites", "bitterballen",
  "FEBO burgers", "Dutch pancakes", "kapsalon trays", "slices of Tony's chocolate",
  "poffertjes", "cheese toasties", "shawarma wraps"
];
var JAMES_WHEN = [
  "before we even reach the hotel",
  "between two coffeeshops",
  "and still ask where we are eating",
  "at half eleven at night",
  "without once sitting down",
  "and call it a warm up",
  "on the walk back from Vondelpark",
  "while the rest of us share one portion of chips"
];

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function jamesLine() {
  return "James will " + pick(JAMES_VERBS) + " <b>" + pick(JAMES_NUMS) + "</b> " +
    pick(JAMES_FOODS) + " " + pick(JAMES_WHEN) + ".";
}

function initJames() {
  var out = byId("james-out");
  var btn = byId("james-btn");
  if (!out) return;
  var run = function () { out.innerHTML = jamesLine(); };
  if (btn) btn.addEventListener("click", run);
  run();
}

/* ------------------------------------------------------------------ */
/* Squad line up                                                       */
/* ------------------------------------------------------------------ */

function renderSquad() {
  var grid = byId("squad-grid");
  if (!grid) return;
  var html = "";
  for (var i = 0; i < SQUAD.length; i++) {
    var lad = SQUAD[i];
    html += '<article class="lad">' +
      '<div class="lad-num">' + escAttr(lad.num) + '</div>' +
      '<div>' +
        '<div class="lad-name">' + escAttr(lad.name) + '</div>' +
        '<div class="lad-role">' + escAttr(lad.role) + '</div>' +
        '<p class="lad-line">' + escAttr(lad.line) + '</p>' +
      '</div>' +
      '</article>';
  }
  grid.innerHTML = html;
}

/* ------------------------------------------------------------------ */
/* Reveal on scroll (IntersectionObserver, no dependency)              */
/* ------------------------------------------------------------------ */

function initReveals() {
  var items = document.querySelectorAll(".reveal");
  if (!items.length) return;
  if (reducedMotion || !("IntersectionObserver" in window)) {
    for (var i = 0; i < items.length; i++) { items[i].classList.add("in"); }
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    for (var j = 0; j < entries.length; j++) {
      if (entries[j].isIntersecting) {
        entries[j].target.classList.add("in");
        io.unobserve(entries[j].target);
      }
    }
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
  for (var k = 0; k < items.length; k++) { io.observe(items[k]); }
}

/* ------------------------------------------------------------------ */
/* Smooth scroll (Lenis, guarded) and optional GSAP hero entrance      */
/* ------------------------------------------------------------------ */

function initSmoothScroll() {
  if (reducedMotion) return;
  if (typeof Lenis === "undefined") return;
  try {
    var lenis = new Lenis({ duration: 1.05, smoothWheel: true });
    var raf = function (time) { lenis.raf(time); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);

    if (window.gsap && window.ScrollTrigger) {
      lenis.on("scroll", window.ScrollTrigger.update);
    }

    var anchors = document.querySelectorAll('a[href^="#"]');
    for (var i = 0; i < anchors.length; i++) {
      anchors[i].addEventListener("click", function (e) {
        var href = this.getAttribute("href");
        if (!href || href.length < 2) return;
        var target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          lenis.scrollTo(target, { offset: -64 });
        }
      });
    }
  } catch (e) {}
}

function initHeroEntrance() {
  if (reducedMotion) return;
  if (!window.gsap) return;
  try {
    window.gsap.from(".hero-anim", {
      y: 26, opacity: 0, duration: 0.8, ease: "power3.out", stagger: 0.08, delay: 0.1
    });
  } catch (e) {}
}

/* ------------------------------------------------------------------ */
/* Boot                                                                */
/* ------------------------------------------------------------------ */

function ready(fn) {
  if (document.readyState !== "loading") fn();
  else document.addEventListener("DOMContentLoaded", fn);
}

ready(function () {
  safe(initClock);
  safe(initCountdown);
  safe(function () { initHero3D(byId("hero-canvas")); });
  safe(initWeather);
  safe(initList);
  safe(initPlanner);
  safe(renderStrains);
  safe(initJames);
  safe(renderSquad);
  safe(initReveals);
  safe(initSmoothScroll);
  safe(initHeroEntrance);
});
