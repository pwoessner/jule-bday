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

  if (!("IntersectionObserver" in window)) {
    scrollItems.forEach((i) => i.classList.add("in"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
  );
  scrollItems.forEach((i) => io.observe(i));
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
   Boot
   ------------------------------------------------------------ */
window.addEventListener("DOMContentLoaded", () => {
  initScrollReveal();
  initSparkles();
  initForm();
  countUpAge();
});

window.addEventListener("load", () => {
  // slight delay so the confetti lands after the first paint
  setTimeout(launchOpeningConfetti, 250);
});
