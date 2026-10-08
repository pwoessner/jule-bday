/* ============================================================
   Happy Birthday Lieblings Jule — interactions
   ============================================================ */

/* ------------------------------------------------------------
   GOOGLE FORM CONFIG  (live values)
   See README.md ("Google Form einrichten") for how these map.
   ------------------------------------------------------------ */
const FORM_CONFIG = {
  actionUrl: "https://docs.google.com/forms/d/e/1FAIpQLSfkLThpE-hKrazhNkllIA6GQXh3K62W_PELU0rq90a0pbQg8g/formResponse",
  entries: {
    date1: "entry.734973945",
    date2: "entry.1299717124",
    date3: "entry.1098130843",
    company: "entry.612866239",
  },
};

/* ------------------------------------------------------------
   Helpers
   ------------------------------------------------------------ */
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const hasConfetti = () => typeof window.confetti === "function";

/* ------------------------------------------------------------
   1 · Opening confetti + 30 count-up
   ------------------------------------------------------------ */
function launchOpeningConfetti() {
  if (prefersReducedMotion || !hasConfetti()) return;
  const end = Date.now() + 1600;
  const colors = ["#ff5e92", "#ff9a76", "#d9a7ff", "#bdeedd", "#ffd166"];

  (function frame() {
    window.confetti({ particleCount: 5, angle: 60, spread: 70, origin: { x: 0 }, colors });
    window.confetti({ particleCount: 5, angle: 120, spread: 70, origin: { x: 1 }, colors });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();

  window.confetti({ particleCount: 160, spread: 100, origin: { y: 0.6 }, colors, scalar: 1.1 });
}

function countUpAge() {
  const el = document.getElementById("ageCounter");
  if (!el) return;
  const target = parseInt(el.dataset.target, 10) || 30;

  if (prefersReducedMotion) { el.textContent = String(target); return; }

  const duration = 1500;
  const start = performance.now();
  function tick(now) {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
    el.textContent = String(Math.round(eased * target));
    if (p < 1) requestAnimationFrame(tick);
    else el.textContent = String(target);
  }
  requestAnimationFrame(tick);
}

/* ------------------------------------------------------------
   2 · Scroll reveal
   ------------------------------------------------------------ */
function initScrollReveal() {
  const items = [...document.querySelectorAll(".reveal")];
  // Hero content is above the fold — reveal it immediately so nothing stays hidden.
  const heroItems = items.filter((el) => el.closest(".hero"));
  const scrollItems = items.filter((el) => !el.closest(".hero"));
  requestAnimationFrame(() => heroItems.forEach((el) => el.classList.add("in")));

  if (prefersReducedMotion) {
    scrollItems.forEach((el) => el.classList.add("in"));
    return;
  }

  const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);

  // Reveal progress is driven by each item's position in the viewport, so the
  // fade / rise tracks the scroll movement instead of snapping in at once.
  function update() {
    const vh = window.innerHeight;
    const start = vh * 0.95; // begin revealing when the top crosses here
    const end = vh * 0.55;   // fully revealed once the top reaches here
    for (const el of scrollItems) {
      const top = el.getBoundingClientRect().top;
      const p = clamp((start - top) / (start - end), 0, 1);
      el.style.opacity = String(p);
      el.style.transform = `translateY(${((1 - p) * 42).toFixed(1)}px) scale(${(0.98 + 0.02 * p).toFixed(3)})`;
    }
  }

  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { update(); ticking = false; });
  }

  update();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
}

/* ------------------------------------------------------------
   3 · Ambient sparkles
   ------------------------------------------------------------ */
function initSparkles() {
  if (prefersReducedMotion) return;
  const layer = document.getElementById("sparkleLayer");
  if (!layer) return;
  const glyphs = ["✦", "✧", "·", "✨", "❀"];

  function spawn() {
    const s = document.createElement("span");
    s.className = "sparkle";
    s.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
    s.style.left = Math.random() * 100 + "vw";
    s.style.bottom = "-5vh";
    s.style.fontSize = 0.6 + Math.random() * 1.3 + "rem";
    const duration = 7 + Math.random() * 7;
    s.style.animationDuration = duration + "s";
    s.style.color = ["#ff8fb1", "#ffd166", "#d9a7ff", "#ff9a76"][Math.floor(Math.random() * 4)];
    layer.appendChild(s);
    setTimeout(() => s.remove(), duration * 1000);
  }

  for (let i = 0; i < 6; i++) setTimeout(spawn, i * 400);
  setInterval(spawn, 1300);
}

/* ------------------------------------------------------------
   4 · Form submit → Google Forms
   ------------------------------------------------------------ */
function celebrateSubmit() {
  if (prefersReducedMotion || !hasConfetti()) return;
  const colors = ["#ff5e92", "#ff9a76", "#d9a7ff", "#bdeedd", "#ffd166"];
  window.confetti({ particleCount: 220, spread: 120, origin: { y: 0.65 }, colors, scalar: 1.2 });
  setTimeout(() => window.confetti({ particleCount: 120, angle: 60, spread: 80, origin: { x: 0 }, colors }), 180);
  setTimeout(() => window.confetti({ particleCount: 120, angle: 120, spread: 80, origin: { x: 1 }, colors }), 320);
}

function initForm() {
  const form = document.getElementById("tripForm");
  const errorEl = document.getElementById("formError");
  const successEl = document.getElementById("formSuccess");
  const submitBtn = document.getElementById("submitBtn");
  if (!form) return;

  function showError(msg) {
    errorEl.textContent = msg;
    errorEl.hidden = false;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorEl.hidden = true;

    const data = new FormData(form);
    const date1 = data.get("date1");
    const date2 = data.get("date2");
    const date3 = data.get("date3");
    const company = data.get("company");

    if (!date1 || !date2 || !date3) {
      showError("Bitte wähle alle drei Wunsch-Termine aus. 🗓️");
      return;
    }
    if (!company) {
      showError("Bitte sag uns noch, mit wem du losziehen möchtest. 💛");
      return;
    }

    submitBtn.disabled = true;
    submitBtn.querySelector(".submit-btn__label").textContent = "Wird gesendet …";

    const payload = new FormData();
    payload.append(FORM_CONFIG.entries.date1, date1);
    payload.append(FORM_CONFIG.entries.date2, date2);
    payload.append(FORM_CONFIG.entries.date3, date3);
    payload.append(FORM_CONFIG.entries.company, company);

    try {
      // Google Forms does not send CORS headers; "no-cors" posts the data
      // successfully but returns an opaque response, so we treat reaching
      // this point as success.
      await fetch(FORM_CONFIG.actionUrl, {
        method: "POST",
        mode: "no-cors",
        body: payload,
      });
    } catch (err) {
      submitBtn.disabled = false;
      submitBtn.querySelector(".submit-btn__label").textContent = "Nochmal versuchen";
      showError("Hoppla, da ist etwas schiefgelaufen. Bitte versuch es noch einmal.");
      return;
    }

    form.hidden = true;
    successEl.hidden = false;
    successEl.scrollIntoView({ behavior: "smooth", block: "center" });
    celebrateSubmit();
  });
}

/* ------------------------------------------------------------
   5 · Hero photo 3D tilt with spring physics (mouse, pen & touch)
   ------------------------------------------------------------ */
function initHeroTilt() {
  const card = document.getElementById("tiltCard");
  if (!card || prefersReducedMotion) return;
  const glare = card.querySelector(".tilt-card__glare");

  const BASE_TILT = -2;
  const MAX_ROT = 14;
  const MAX_SHIFT = 16;
  const STIFFNESS = 0.14;
  const DAMPING = 0.75;
  const REST = 0.002;

  const cur = { rx: 0, ry: 0, tx: 0, ty: 0, rz: BASE_TILT, sc: 1 };
  const vel = { rx: 0, ry: 0, tx: 0, ty: 0, rz: 0, sc: 0 };
  const tgt = { rx: 0, ry: 0, tx: 0, ty: 0, rz: BASE_TILT, sc: 1 };
  const gCur = { pos: 50, op: 0 };
  const gTgt = { pos: 50, op: 0 };

  let raf = null;
  let engaged = false;

  function settled() {
    const springsRest = Object.keys(cur).every(
      (k) => Math.abs(vel[k]) < REST && Math.abs(tgt[k] - cur[k]) < REST
    );
    return springsRest && Math.abs(gTgt.op - gCur.op) < REST && Math.abs(gTgt.pos - gCur.pos) < 0.1;
  }

  function paint() {
    card.style.transform =
      `translate3d(${cur.tx.toFixed(2)}px, ${cur.ty.toFixed(2)}px, 0)` +
      ` rotateX(${cur.rx.toFixed(2)}deg) rotateY(${cur.ry.toFixed(2)}deg)` +
      ` rotate(${cur.rz.toFixed(2)}deg) scale(${cur.sc.toFixed(3)})`;

    card.style.boxShadow =
      `${(-cur.ry * 1.8).toFixed(1)}px ${(26 + cur.rx * 1.8).toFixed(1)}px ` +
      `${(60 + Math.abs(cur.ry) * 1.5).toFixed(1)}px rgba(255, 94, 146, 0.28)`;

    if (glare) {
      glare.style.setProperty("--glare-pos", gCur.pos.toFixed(1) + "%");
      glare.style.setProperty("--glare-angle", (115 + cur.ry * 2.5).toFixed(1) + "deg");
      glare.style.setProperty("--glare-op", gCur.op.toFixed(3));
    }
  }

  function step() {
    for (const k in cur) {
      vel[k] = (vel[k] + (tgt[k] - cur[k]) * STIFFNESS) * DAMPING;
      cur[k] += vel[k];
    }
    gCur.pos += (gTgt.pos - gCur.pos) * 0.18;
    gCur.op += (gTgt.op - gCur.op) * 0.12;

    paint();
    raf = settled() ? null : requestAnimationFrame(step);
  }

  function kick() {
    if (!raf) raf = requestAnimationFrame(step);
  }

  function aim(e) {
    const r = card.getBoundingClientRect();
    const clamp = (v) => Math.min(Math.max(v, 0), 1);
    const x = clamp((e.clientX - r.left) / r.width);
    const y = clamp((e.clientY - r.top) / r.height);

    tgt.ry = (x - 0.5) * 2 * MAX_ROT;
    tgt.rx = -(y - 0.5) * 2 * MAX_ROT;
    tgt.tx = (x - 0.5) * 2 * MAX_SHIFT;
    tgt.ty = (y - 0.5) * 2 * MAX_SHIFT;
    gTgt.pos = x * 100;
    kick();
  }

  function engage(e) {
    engaged = true;
    tgt.rz = 0;
    tgt.sc = 1.035;
    gTgt.op = 1;
    aim(e);
  }

  function release() {
    engaged = false;
    tgt.rx = tgt.ry = tgt.tx = tgt.ty = 0;
    tgt.rz = BASE_TILT;
    tgt.sc = 1;
    gTgt.pos = 50;
    gTgt.op = 0;
    kick();
  }

  card.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") engage(e); });
  card.addEventListener("pointerdown", (e) => { if (e.pointerType !== "mouse") engage(e); });
  card.addEventListener("pointermove", (e) => { if (engaged) aim(e); });
  card.addEventListener("pointerleave", release);
  card.addEventListener("pointerup", release);
  card.addEventListener("pointercancel", release);
}

/* ------------------------------------------------------------
   6 · Gallery ticker — auto-drift with touch / drag control
   ------------------------------------------------------------ */
function initSingleGallery(track, reversed) {
  if (!track) return;

  track.style.animation = "none";

  const BASE_DRIFT = reversed ? 55 : -55;  // px/s; positive = rightward
  const DECAY = 2.8;

  let pos = 0;
  let vel = BASE_DRIFT;
  let dragging = false;
  let lastX = 0;
  let lastT = 0;
  let last = performance.now();

  const halfWidth = () => track.scrollWidth / 2;

  function wrap() {
    const hw = halfWidth();
    if (hw <= 0) return;
    while (pos <= -hw) pos += hw;
    while (pos > 0) pos -= hw;
  }

  function frame(now) {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;

    if (!dragging) {
      vel = BASE_DRIFT + (vel - BASE_DRIFT) * Math.exp(-DECAY * dt);
      pos += vel * dt;
      wrap();
      track.style.transform = `translateX(${pos.toFixed(2)}px)`;
    }
    requestAnimationFrame(frame);
  }

  track.addEventListener("pointerdown", (e) => {
    if (e.button > 0) return;
    dragging = true;
    lastX = e.clientX;
    lastT = performance.now();
    vel = 0;
    track.setPointerCapture(e.pointerId);
    track.classList.add("is-dragging");
  });

  track.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const now = performance.now();
    const dt = Math.max((now - lastT) / 1000, 0.001);
    const dx = e.clientX - lastX;
    lastX = e.clientX;
    lastT = now;
    vel = dx / dt;
    pos += dx;
    wrap();
    track.style.transform = `translateX(${pos.toFixed(2)}px)`;
  });

  function release() {
    if (!dragging) return;
    dragging = false;
    track.classList.remove("is-dragging");
  }
  track.addEventListener("pointerup", release);
  track.addEventListener("pointercancel", release);

  requestAnimationFrame(frame);
}

function initGallery() {
  if (prefersReducedMotion) return;
  document.querySelectorAll(".photo-ticker").forEach((ticker) => {
    const track = ticker.querySelector(".photo-ticker__track");
    const reversed = ticker.classList.contains("photo-ticker--reverse");
    initSingleGallery(track, reversed);
  });
}

/* ------------------------------------------------------------
   Boot
   ------------------------------------------------------------ */
window.addEventListener("DOMContentLoaded", () => {
  initScrollReveal();
  initSparkles();
  initForm();
  initHeroTilt();
  initGallery();
  countUpAge();
});

window.addEventListener("load", () => {
  // slight delay so the confetti lands after the first paint
  setTimeout(launchOpeningConfetti, 250);
});
