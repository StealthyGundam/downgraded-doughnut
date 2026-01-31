// ================= PAGE ORDER =================
const PAGE_ORDER = [
  "pages/start.html",
  "pages/access-code.html",
  "pages/character-creation.html",
  "pages/awareness.html",
  //"pages/charisma.html",
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

// ================= LOAD PAGE =================
async function loadPageByIndex(index) {
  if (index < 0 || index >= PAGE_ORDER.length) return;

  // ---- cleanup old fragment scripts
  injectedScripts.forEach(script => script.remove());
  injectedScripts = [];

  // ---- optional fragment cleanup hook
  document.dispatchEvent(new Event("spa-cleanup"));

  const path = PAGE_ORDER[index];

  try {
    const res = await fetch(path);
    if (!res.ok) throw new Error(`Failed to load ${path}`);
    const html = await res.text();

    const container = document.getElementById("main-container");
    container.innerHTML = html;

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

    // 🔹 FIX: dispatch after scripts have been attached and executed
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
