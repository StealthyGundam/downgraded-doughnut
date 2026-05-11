(() => {
    let stage = 0;
    let timerInterval;
    let realTotalSeconds = 0;
    let fakeTotalSeconds = 0;
    const KEY = "page.patience.completed";
    const continueBtn =
        document.getElementById("continueBtn");
    const realContinueBtn =
        document.getElementById("realContinueBtn");
    const timerEl =
        document.getElementById("timer");
    const instructionEl =
        document.getElementById("instruction");
    // ================= SPA AUTO-SKIP =================
    if (localStorage.getItem(KEY) === "true") {
        document.dispatchEvent(
            new CustomEvent("spa-next-page")
        );
        return;
    }
    // ================= STAGES =================
    const stages = [
        {
            text: "Do Nothing",
            realTime: 60,
            fakeTime: 60},
        {
            text: "Nothing Detected",
            realTime: 30,
            fakeTime: 30},
        {
            text: "Continue Doing Nothing",
            realTime: 15,
            fakeTime: 15},
        {
            text: "Patience Is Required!",
            realTime: 300,
            fakeTime: 4*3600 }
    ];
    // ================= TIMER =================
    function startStage() {
        clearInterval(timerInterval);
        continueBtn.style.display = "none";
        const current = stages[stage];
        instructionEl.textContent = current.text;
        realTotalSeconds = current.realTime;
        fakeTotalSeconds = current.fakeTime;
        updateTimer();
        timerInterval =
            setInterval(updateTimer, 1000);
    }
    function updateTimer() {
        // Fake timer display
        const fakeHours =
            Math.floor(fakeTotalSeconds / 3600);
        const fakeMinutes =
            Math.floor((fakeTotalSeconds % 3600) / 60);
        const fakeSeconds =
            fakeTotalSeconds % 60;
        timerEl.textContent =
            String(fakeHours).padStart(2, "0") + ":" +
            String(fakeMinutes).padStart(2, "0") + ":" +
            String(fakeSeconds).padStart(2, "0");
        // Stage complete
        if (realTotalSeconds <= 0) {
            clearInterval(timerInterval);
            if (stage < stages.length - 1) {
                continueBtn.style.display =
                    "inline-block";
            } else {
                realContinueBtn.style.display =
                    "inline-block";
            }
            return;
        }
        // Countdown
        fakeTotalSeconds--;
        if (fakeTotalSeconds < 0) {
            fakeTotalSeconds = 0;
        }
        realTotalSeconds--;
    }
    // ================= PAGE COMPLETE =================
    function completePage() {
        localStorage.setItem(KEY, "true");
        document.dispatchEvent(
            new CustomEvent("spa-next-page")
        );
    }
    // ================= BUTTON EVENTS =================
    continueBtn.addEventListener("click", () => {
        continueBtn.style.display = "none";
        stage++;
        startStage();
    });
    realContinueBtn.addEventListener("click", () => {
        completePage();
    });
    // ================= TAB PUNISHMENT =================
    let tabPunishCooldown = false;
    document.addEventListener(
        "visibilitychange",
        () => {
            if (document.hidden) {
                punishForLeaving();
            }
        }
    );
    function punishForLeaving() {
        if (tabPunishCooldown) return;
        tabPunishCooldown = true;
        clearInterval(timerInterval);
        continueBtn.style.display = "none";
        realContinueBtn.style.display = "none";
        instructionEl.textContent =
            "Do Not Leave The Page!";
        setTimeout(() => {
            startStage();
            tabPunishCooldown = false;
        }, 1000);
    }
    // ================= DEVTOOLS DETECTION =================
    let devtoolsOpen = false;
    setInterval(() => {
        const threshold = 160;
        const widthDiff =
            window.outerWidth -
            window.innerWidth >
            threshold;
        const heightDiff =
            window.outerHeight -
            window.innerHeight >
            threshold;
        if ((widthDiff || heightDiff) && !devtoolsOpen) {
            devtoolsOpen = true;
            punishForLeaving();
        } else if (!widthDiff && !heightDiff) {
            devtoolsOpen = false;
        }
    }, 1000);
    // ================= START =================
    startStage();
})();
