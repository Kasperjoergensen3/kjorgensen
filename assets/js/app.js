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
    console.warn("Could not load partial:", url, res.status);
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
    if (
      current.endsWith("/" + key) ||
      (key === "home" && (current === "" || current === "/" || current.endsWith("/index.html")))
    ) {
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


function enableSpaNavigation(root) {
  const nav = document.getElementById("site-nav");
  const content = document.querySelector("main.content");
  if (!nav || !content) return;

  nav.addEventListener("click", async (e) => {
    const link = e.target.closest("a.nav-link");
    if (!link) return;
    e.preventDefault();

    const href = link.getAttribute("href");
    if (!href) return;

    // show a tiny loading state
    content.innerHTML = "<p>Loading…</p>";

    // fetch the target page HTML
    const res = await fetch(href);
    const text = await res.text();

    // parse it and extract that page's <main>
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, "text/html");
    const newMain = doc.querySelector("main.content");
    if (newMain) {
      content.innerHTML = newMain.innerHTML;
      // update active link
      nav.querySelectorAll("a.nav-link").forEach(a => a.classList.remove("active"));
      link.classList.add("active");
      // update URL so back button works
      window.history.pushState({}, "", href);
    }
  });

  // handle back/forward
  window.addEventListener("popstate", async () => {
    const res = await fetch(window.location.pathname);
    const text = await res.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, "text/html");
    const newMain = doc.querySelector("main.content");
    if (newMain) {
      content.innerHTML = newMain.innerHTML;
    }
  });
}

async function initLayout() {
  const script = document.querySelector("script[data-root]");
  const root = script ? script.dataset.root || "." : ".";

  await Promise.all([
    loadPartial("#topbar-slot", joinRoot(root, "assets/partials/topbar.html")),
    loadPartial("#sidebar-slot", joinRoot(root, "assets/partials/sidebar.html")),
  ]);

  setupNavLinks(root);
  initTheme();
  initSettingsPopup();
  enableSpaNavigation(root);
}

// run after HTML is parsed
document.addEventListener("DOMContentLoaded", initLayout);
