(() => {
  const KEY = "page.awareness.completed";  
  const order = ["Bellsprout", "Diglett", "Gloom", "Mewtwo", "Seadra"];
  let current = 0;

  const continueBtn = document.getElementById("continueBtn");

  document.querySelectorAll(".hit").forEach(hit => {
    hit.addEventListener("click", () => {
      const name = hit.dataset.name;

      // Only allow clicks in the correct order
      if (name !== order[current]) return;

      // ---- STRIKE THROUGH TEXT ----
      const textEl = document.querySelector(`#pokemon-list span[data-name="${name}"]`);
      if (textEl) textEl.classList.add("found");

      // Disable hitbox
      hit.style.pointerEvents = "none";

      // Move to next
      current++;

      // Enable Continue button if all found
      if (current === order.length) {
        continueBtn.disabled = false;
        continueBtn.classList.add("enabled");
      }
    });
  });

  continueBtn.addEventListener("click", () => {
    if (continueBtn.disabled) return;

    // Mark as completed
    localStorage.setItem(KEY, "true");

    // Move to next page
    document.dispatchEvent(new CustomEvent("spa-next-page"));
  });
})();
