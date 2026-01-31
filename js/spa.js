// ===== SPA PAGE ORDER =====
const PAGE_ORDER = [
  "pages/index.html",
  "pages/start.html",
  "pages/access-code.html",
  "pages/character-creation.html",
  "pages/tutorial.html",
  "pages/awareness.html",
  "pages/charisma.html",
  "pages/intelligence.html",
  "pages/luck.html",
  "pages/navigation.html",
  "pages/patience.html",
  "pages/procrastination.html",
  "pages/wisdom.html",
  "pages/keypad.html",
  "pages/rsa.html"
];

let currentPageIndex = 0;

// ===== Load a fragment by index =====
async function loadPageByIndex(index) {
  if (index < 0 || index >= PAGE_ORDER.length) return;

  const path = PAGE_ORDER[index];
  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`Failed to load ${path}`);
    const html = await res.text();

    const container = document.getElementById("main-container");
    container.innerHTML = html;

    // Execute scripts inside the fragment
    container.querySelectorAll("script").forEach(oldScript => {
      const newScript = document.createElement("script");
      if (oldScript.src) newScript.src = oldScript.src;
      else newScript.textContent = oldScript.textContent;
      document.body.appendChild(newScript);
      oldScript.remove(); // optional
    });

    // Enable fullscreen (only once)
    enableFullscreen();

    // Update current page index
    currentPageIndex = index;

  } catch (err) {
    console.error(err);
  }
}

// ===== Fullscreen handler =====
function enableFullscreen() {
  if (!document.fullscreenElement) {
    document.addEventListener(
      "click",
      () => document.documentElement.requestFullscreen(),
      { once: true }
    );
  }
}

// ===== SPA event listener for fragment-driven Continue buttons =====
document.addEventListener("spa-next-page", () => {
  if (currentPageIndex + 1 < PAGE_ORDER.length) {
    loadPageByIndex(currentPageIndex + 1);
  } else {
    alert("You completed all pages!");
  }
});

// ===== Start SPA =====
document.addEventListener("DOMContentLoaded", () => {
  loadPageByIndex(0); // Start with the first page in PAGE_ORDER
});
