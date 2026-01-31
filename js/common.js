// FULLSCREEN ON CLICK ANYWHERE
const enterFullscreen = async () => {
  document.removeEventListener("click", enterFullscreen);

  if (document.fullscreenElement) return;

  try {
    const el = document.documentElement;
    if (el.requestFullscreen) await el.requestFullscreen();
    else if (el.webkitRequestFullscreen) await el.webkitRequestFullscreen();
    else if (el.msRequestFullscreen) await el.msRequestFullscreen();
  } catch {}
};

document.addEventListener("click", enterFullscreen, { once: true });
