// ================= PAGE ORDER =================
const PAGE_ORDER = [
  "pages/start.html",
  "pages/access-code.html",
  "pages/character-creation.html",
  "pages/awareness.html",
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
let injectedScripts = [];

// ================= SPA HELPER: get page name =================
function getPageNameFromPath(path) {
  // Extract file name without extension
  const fileName = path.split("/").pop();
  return fileName.replace(".html", "");
}

// ================= LOAD PAGE =================
async function loadPageByIndex(index) {
  if (index < 0 || index >= PAGE_ORDER.length) return;

  const path = PAGE_ORDER[index];
  const pageName = getPageNameFromPath(path);

  // Skip completed pages BEFORE loading fragment
  if (localStorage.getItem(`page.${pageName}.completed`) === "true") {
    // Recursively skip to next page
    loadPageByIndex(index + 1);
    return;
  }

  try {
    // Fetch the HTML fragment
    const res = await fetch(path);
    if (!res.ok) throw new Error(`Failed to load ${path}`);
    const html = await res.text();

    const container = document.getElementById("main-container");
    container.innerHTML = html;

    // ---- cleanup old fragment scripts
    injectedScripts.forEach(script => script.remove());
    injectedScripts = [];

    // ---- re-execute fragment scripts
    container.querySelectorAll("script").forEach(oldScript => {
      const newScript = document.createElement("script");

      if (oldScript.src) {
        newScript.src = oldScript.src;
      } else {
        newScript.textContent = oldScript.textContent;
      }

      newScript.dataset.spa = "fragment";
      document.body.appendChild(newScript);
      injectedScripts.push(newScript);

      oldScript.remove();
    });

    enableFullscreen();
    currentPageIndex = index;

    // ---- dispatch after scripts attached and executed
    setTimeout(() => {
      document.dispatchEvent(
        new CustomEvent("spa-page-loaded", { detail: { path, index } })
      );
    }, 0);

  } catch (err) {
    console.error(err);
  }
}

// ================= FULLSCREEN =================
function enableFullscreen() {
  if (document.fullscreenElement) return;

  const handler = async () => {
    try {
      await document.documentElement.requestFullscreen();
    } catch {}
    document.removeEventListener("click", handler);
  };

  document.addEventListener("click", handler);
}

// ================= NAVIGATION EVENT =================
document.addEventListener("spa-next-page", () => {
  const nextIndex = currentPageIndex + 1;
  if (nextIndex < PAGE_ORDER.length) {
    loadPageByIndex(nextIndex);
  }
});

// ================= START SPA =================
document.addEventListener("DOMContentLoaded", () => {
  loadPageByIndex(0);
});

// ================= OPTIONAL: reset all progress (for testing) =================
function resetAllProgress() {
  Object.keys(localStorage)
    .filter(k => k.startsWith("page."))
    .forEach(k => localStorage.removeItem(k));
  console.log("All puzzle progress reset.");
}
