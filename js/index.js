const OPTIONS = {
  pomodoro: 25,
  shortBreak: 5,
  longBreak: 15,
};

const settings = document.getElementById("settings");
const settingsChildren = [...settings.children];
let currentOption = settingsChildren[0].getAttribute("data-value");
const actionButton = document.getElementById("actionBtn");
const timeElement = document.getElementById("time");
let interval;
let buttonStatus = "start";

const updateCircleProgress = (progress) => {
  const circle = document.getElementById("circle");
  const radius = circle.r.baseVal.value;
  const circumference = 2 * Math.PI * radius;

  circle.style.strokeDasharray = `${circumference} ${circumference}`;
  circle.style.strokeDashoffset = `${circumference}`;
  circle.style.transition = "stroke-dashoffset 0.5s ease-in-out";

  const offset = circumference - (progress / 100) * circumference;
  circle.style.strokeDashoffset = `${offset}`;
};

settingsChildren[0].classList.add("active");
timeElement.innerText = `${OPTIONS[currentOption]}:00`;

actionButton.addEventListener("click", () => {
  if (buttonStatus === "start") {
    buttonStatus = "stop";

    // update timer display
    interval = setInterval(() => {
      const timer = document.getElementById("time");
      const time = timer.innerText.split(":").map(Number);
      const [m, s] = time;
      if (s === 0) {
        if (m === 0) {
          timer.innerText = `${OPTIONS[currentOption]}:00`;
          clearInterval(interval);
          updateCircleProgress(100);
        } else {
          timer.innerText = `${m - 1}:59`;
        }
      } else {
        timer.innerText = `${m}:${String(s - 1).padStart(2, "0")}`;

        updateCircleProgress(
          ((m * 60 + s - 1) / (OPTIONS[currentOption] * 60)) * 100
        );
      }
    }, 1000);
  } else {
    buttonStatus = "start";
    clearInterval(interval);
  }
  actionButton.innerText = buttonStatus;
});

settingsChildren.forEach((child) => {
  child.addEventListener("click", (event) => {
    settingsChildren.forEach((child) => child.classList.remove("active"));
    event.target.classList.add("active");
    currentOption = event.target.getAttribute("data-value");
    timeElement.innerText = `${OPTIONS[currentOption]}:00`;

    if (interval) {
      clearInterval(interval);
      updateCircleProgress(100);
      actionButton.innerText = "start";
    }
  });
});
