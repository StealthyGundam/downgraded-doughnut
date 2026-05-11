(() => {
  let stage = 0;

let timerInterval;

let realTotalSeconds = 0;
let fakeTotalSeconds = 0;

const KEY = "page.intelligence.completed";


// ================= STAGES =================

const stages = [
  {
    text: "Do Nothing",
    realTime: 3 * 60,
    fakeTime: 3 * 3600 + 45 * 60
  },

  {
    text: "Nothing Detected",
    realTime: 8,
    fakeTime: 8
  },

  {
    text: "Continue Doing Nothing",
    realTime: 12,
    fakeTime: 12
  },

  {
    text: "Patience Is Required!",
    realTime: 15,
    fakeTime: 15
  }
];


// ================= ELEMENTS =================

const timerEl =
  document.getElementById("timer");

const continueBtn =
  document.getElementById("continueBtn");

const realContinueBtn =
  document.getElementById("realContinueBtn");

const instructionEl =
  document.getElementById("instruction");


// ================= SPA NAVIGATION =================

function goToNextPage() {

  // EXAMPLE:
  // window.location.href = "/next-page";

  console.log("Go to next SPA page here");
}


// ================= AUTO SKIP =================

if (localStorage.getItem(KEY) === "true") {

  goToNextPage();

} else {

  startStage();
}


// ================= TIMER =================

function startStage() {

  clearInterval(timerInterval);

  const current = stages[stage];

  instructionEl.textContent = current.text;

  realTotalSeconds = current.realTime;
  fakeTotalSeconds = current.fakeTime;

  updateTimer();

  timerInterval =
    setInterval(updateTimer, 1000);
}


function updateTimer() {

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

  fakeTotalSeconds--;

  if (fakeTotalSeconds < 0) {
    fakeTotalSeconds = 0;
  }

  realTotalSeconds--;
}


// ================= BUTTONS =================

continueBtn.addEventListener("click", () => {

  continueBtn.style.display = "none";

  stage++;

  startStage();
});


realContinueBtn.addEventListener("click", () => {

  localStorage.setItem(KEY, "true");

  goToNextPage();
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
})();
