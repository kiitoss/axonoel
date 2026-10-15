(() => {
  "use strict";

  const PLACEHOLDER = "./images/placeholder.svg";
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Guirlande ---------- */
  const garland = document.querySelector(".garland");
  const colors = ["var(--red)", "var(--gold)", "var(--green)", "var(--violet-400)"];
  const bulbs = Math.min(28, Math.max(10, Math.round(innerWidth / 48)));
  for (let i = 0; i < bulbs; i++) {
    const li = document.createElement("li");
    li.style.setProperty("--c", colors[i % colors.length]);
    li.style.setProperty("--d", `${(i % 4) * 0.4}s`);
    garland.appendChild(li);
  }

  /* ---------- Jeux ---------- */
  const grid = document.getElementById("games");
  const tpl = document.getElementById("card-tpl");

  const games = window.GAMES || [];
  if (games.length) {
    games.forEach((g, i) => grid.appendChild(renderCard(g, i)));
  } else {
    grid.outerHTML = '<p class="empty">Les jeux arrivent bientôt… 🎁</p>';
  }

  function renderCard(game, index) {
    const node = tpl.content.firstElementChild.cloneNode(true);
    node.href = game.url;
    node.style.setProperty("--i", index);
    node.setAttribute("aria-label", `Jouer à ${game.title}`);

    const img = node.querySelector("img");
    img.src = game.image || PLACEHOLDER;
    img.addEventListener("error", () => { if (!img.src.endsWith("placeholder.svg")) img.src = PLACEHOLDER; }, { once: true });

    node.querySelector("h2").textContent = game.title;
    node.querySelector("p").textContent = game.description || "";

    if (game.tag) {
      const tag = node.querySelector(".tag");
      tag.textContent = game.tag;
      tag.hidden = false;
    }
    return node;
  }

  /* ---------- Neige ---------- */
  if (!reduceMotion) {
    const canvas = document.getElementById("snow");
    const ctx = canvas.getContext("2d");
    let w, h, flakes = [], running = true;

    const resize = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      w = innerWidth; h = innerHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(140, (w * h) / 11000));
      flakes = Array.from({ length: count }, () => makeFlake(true));
    };

    const makeFlake = (anywhere) => ({
      x: Math.random() * w,
      y: anywhere ? Math.random() * h : -10,
      r: Math.random() * 2.4 + 0.6,
      vy: Math.random() * 0.6 + 0.3,
      sway: Math.random() * Math.PI * 2,
      swaySpeed: Math.random() * 0.01 + 0.004,
      a: Math.random() * 0.5 + 0.35,
    });

    const tick = () => {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      for (const f of flakes) {
        f.sway += f.swaySpeed;
        f.x += Math.sin(f.sway) * 0.4;
        f.y += f.vy * (1 + f.r * 0.25);
        if (f.y > h + 10) Object.assign(f, makeFlake(false));
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${f.a})`;
        ctx.fill();
      }
      requestAnimationFrame(tick);
    };

    addEventListener("resize", resize);
    document.addEventListener("visibilitychange", () => {
      running = !document.hidden;
      if (running) requestAnimationFrame(tick);
    });
    resize();
    requestAnimationFrame(tick);
  }

  /* ---------- PWA ---------- */
  // Le service worker n'existe qu'en http(s) ; en file:// la page marche sans.
  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
    addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(() => {}));
  }

  const installBtn = document.getElementById("install");
  let deferredPrompt;
  addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installBtn.hidden = false;
  });
  installBtn.addEventListener("click", async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
    installBtn.hidden = true;
  });
})();
