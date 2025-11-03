// /assets/js/app.js

// joins root and path safely
function joinRoot(root, path) {
  const r = root.replace(/\/$/, "");
  const p = path.replace(/^\//, "");
  return r + "/" + p;
}

async function loadPartial(selector, url) {
  const el = document.querySelector(selector);
  if (!el) return;
  const res = await fetch(url);
  if (!res.ok) {
    console.warn("Could not load partial:", url);
    return;
  }
  el.innerHTML = await res.text();
}

// after partials are loaded we can fix nav links
function setupNavLinks(root) {
  const nav = document.getElementById("site-nav");
  if (!nav) return;
  const mapping = {
    home: "",
    cv: "cv/",
    publications: "publications/",
    posts: "posts/",
    phd: "phd/",
  };
  const current = window.location.pathname.replace(/\/+$/, "");
  Array.from(nav.querySelectorAll("[data-nav]")).forEach((a) => {
    const key = a.getAttribute("data-nav");
    const target = mapping[key];
    const href = target === "" ? root + "/" : joinRoot(root, target);
    a.setAttribute("href", href);
    // active state
    if (current.endsWith("/" + key) || (key === "home" && (current === "" || current.endsWith("/")))) {
      a.classList.add("active");
    }
  });
}

function initTheme() {
  const html = document.documentElement;
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    html.setAttribute("data-theme", savedTheme);
  }
  const toggle = document.getElementById("theme-toggle");
  if (toggle) {
    if (savedTheme === "dark") {
      toggle.checked = true;
    }
    toggle.addEventListener("change", (e) => {
      const t = e.target.checked ? "dark" : "light";
      html.setAttribute("data-theme", t);
      localStorage.setItem("theme", t);
    });
  }
}

function initSettingsPopup() {
  const btn = document.getElementById("settings-button");
  const popup = document.getElementById("settings-popup");
  const close = document.getElementById("settings-close");
  if (!btn || !popup) return;
  btn.addEventListener("click", () => {
    popup.classList.toggle("hidden");
  });
  if (close) {
    close.addEventListener("click", () => popup.classList.add("hidden"));
  }
  document.addEventListener("click", (e) => {
    if (!popup.contains(e.target) && !btn.contains(e.target)) {
      popup.classList.add("hidden");
    }
  });
}

async function initLayout() {
  // figure out root from script tag
  const script = document.currentScript;
  const root = script?.dataset?.root || ".";

  await Promise.all([
    loadPartial("#topbar-slot", joinRoot(root, "assets/partials/topbar.html")),
    loadPartial("#sidebar-slot", joinRoot(root, "assets/partials/sidebar.html")),
  ]);

  // after partials available
  setupNavLinks(root);
  initTheme();
  initSettingsPopup();
}

initLayout();
