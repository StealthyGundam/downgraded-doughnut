// FULLSCREEN ON CLICK ANYWHERE
    const enterFullscreen = async () => {
      document.removeEventListener("click", enterFullscreen);
      const elem = document.documentElement;
      try {
        if (elem.requestFullscreen) await elem.requestFullscreen();
        else if (elem.webkitRequestFullscreen) await elem.webkitRequestFullscreen();
        else if (elem.msRequestFullscreen) await elem.msRequestFullscreen();
      } catch (e) {
        console.warn("Fullscreen request failed:", e);
      }
    };
    document.addEventListener("click", enterFullscreen);
