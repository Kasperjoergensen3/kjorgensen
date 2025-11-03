async function loadPage(page) {
  const content = document.getElementById("content");
  try {
    const res = await fetch(page + "/index.html");
    const text = await res.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, "text/html");
    const section = doc.querySelector("section");
    content.innerHTML = section ? section.outerHTML : "<p>Page not found.</p>";
  } catch (e) {
    content.innerHTML = "<p>Error loading page.</p>";
  }
}

function setActiveLink(page) {
  document.querySelectorAll("#site-nav a").forEach(a => {
    a.classList.toggle("active", a.dataset.page === page);
  });
}

function setupRouting() {
  function route() {
    const hash = window.location.hash.substring(1) || "home";
    setActiveLink(hash);
    if (hash === "home") {
      document.getElementById("content").innerHTML = `
        <section class="page">
          <h2>Welcome</h2>
          <p>PhD student at UCPH / DTU on the FOREVER project exploring multimodal models and explainable AI for eye scans (glaucoma).</p>
          <img src="assets/img/profile.jpg" alt="Profile" style="max-width:150px;border-radius:50%;margin-top:1rem;">
        </section>`;
    } else {
      loadPage(hash);
    }
  }
  window.addEventListener("hashchange", route);
  route();
}

function setupTheme() {
  const toggle = document.getElementById("theme-toggle");
  const saved = localStorage.getItem("theme") || "dark";
  if (saved === "light") document.body.classList.add("light-mode");
  toggle.checked = saved === "dark";
  toggle.addEventListener("change", () => {
    document.body.classList.toggle("light-mode", !toggle.checked);
    localStorage.setItem("theme", toggle.checked ? "dark" : "light");
  });
}

function setupSettingsPopup() {
  const btn = document.getElementById("settings-btn");
  const popup = document.getElementById("settings-popup");
  btn.addEventListener("click", () => popup.classList.toggle("hidden"));
}

document.addEventListener("DOMContentLoaded", () => {
  setupRouting();
  setupTheme();
  setupSettingsPopup();
});
