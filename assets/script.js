// theme handling
const html = document.documentElement;
const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
  html.setAttribute("data-theme", savedTheme);
}

const themeToggle = document.getElementById("theme-toggle");
if (themeToggle) {
  // set initial checkbox state
  if (savedTheme === "dark") {
    themeToggle.checked = true;
  }
  themeToggle.addEventListener("change", (e) => {
    const isDark = e.target.checked;
    html.setAttribute("data-theme", isDark ? "dark" : "light");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });
}

// plotly render if present
function renderPhdPlot() {
  const plotDiv = document.getElementById("phd-plot");
  if (!plotDiv || typeof Plotly === "undefined") return;

  const trace = {
    x: [0.1, 0.2, 0.35, 0.5, 0.65, 0.8],
    y: [0.9, 0.92, 0.88, 0.93, 0.91, 0.95],
    mode: "markers",
    type: "scatter",
    marker: { size: 10 }
  };

  const layout = {
    title: "Experiment scatter (DICE vs cohort)",
    xaxis: { title: "Cohort / param" },
    yaxis: { title: "Metric", range: [0.8, 1.0] }
  };

  Plotly.newPlot(plotDiv, [trace], layout, { responsive: true });
}
renderPhdPlot();
