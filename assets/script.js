// handle section switching
const navItems = document.querySelectorAll(".nav-item[data-target]");
const sections = document.querySelectorAll(".section");

navItems.forEach((btn) => {
  btn.addEventListener("click", () => {
    const target = btn.getAttribute("data-target");

    // set active in sidebar
    navItems.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    // show section
    sections.forEach((sec) => {
      if (sec.id === target) {
        sec.classList.add("visible");
      } else {
        sec.classList.remove("visible");
      }
    });
  });
});

// dropdown (settings)
const dropdownToggles = document.querySelectorAll(".dropdown-toggle");
dropdownToggles.forEach((toggle) => {
  toggle.addEventListener("click", () => {
    const id = toggle.getAttribute("data-dropdown");
    const menu = document.getElementById(id);
    if (!menu) return;
    const isOpen = menu.style.display === "block";
    menu.style.display = isOpen ? "none" : "block";
  });
});

// theme toggle
const themeToggle = document.getElementById("theme-toggle");
const html = document.documentElement;

// load previously saved theme
const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
  html.setAttribute("data-theme", savedTheme);
  if (savedTheme === "dark") {
    themeToggle.checked = true;
  }
}

if (themeToggle) {
  themeToggle.addEventListener("change", (e) => {
    const isDark = e.target.checked;
    html.setAttribute("data-theme", isDark ? "dark" : "light");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });
}

// Plotly scatter for PhD section
function renderPhdPlot() {
  const plotDiv = document.getElementById("phd-plot");
  if (!plotDiv) return;

  // dummy data – replace with real experiment data
  const trace = {
    x: [0.1, 0.2, 0.35, 0.5, 0.65, 0.8],
    y: [0.9, 0.92, 0.88, 0.93, 0.91, 0.95],
    mode: "markers",
    type: "scatter",
    marker: { size: 10 }
  };

  const layout = {
    title: "Experiment scatter (e.g. DICE vs parameter)",
    xaxis: { title: "Hyperparameter / cohort index" },
    yaxis: { title: "Metric (DICE)", range: [0.8, 1.0] },
    margin: { t: 40, r: 20, l: 50, b: 50 }
  };

  Plotly.newPlot(plotDiv, [trace], layout, { responsive: true });
}

renderPhdPlot();
