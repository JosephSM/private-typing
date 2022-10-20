function createLiveWordElement() {
  const liveContainer = document.createElement("span");
  liveContainer.setAttribute("class", "liveContainer");

  const liveText = document.createElement("span");
  liveText.setAttribute("class", "liveText");

  const rightText = document.createElement("span");
  rightText.setAttribute("class", "rightText");

  const wrongText = document.createElement("span");
  wrongText.setAttribute("class", "wrongText");

  const restText = document.createElement("span");
  restText.setAttribute("class", "restText");

  liveContainer.appendChild(document.createTextNode(" "));
  liveText.appendChild(rightText);
  liveText.appendChild(wrongText);
  liveText.appendChild(restText);
  liveContainer.appendChild(liveText);
  liveContainer.appendChild(document.createTextNode(" "));
  return liveContainer;
}

function createGameElements() {
  const gameContainer = document.createElement("div");
  gameContainer.setAttribute("id", "game");
  const gameHeaderContainer = document.createElement("div");
  gameHeaderContainer.setAttribute("id", "gameHeader");
  gameContainer.appendChild(gameHeaderContainer);
  const typingText = document.createElement("p");
  typingText.setAttribute("id", "typingText");

  const completedText = document.createElement("span");
  completedText.setAttribute("id", "completedText");

  const liveContainer = createLiveWordElement();

  const upcomingText = document.createElement("span");
  upcomingText.setAttribute("id", "upcomingText");

  typingText.appendChild(completedText);
  typingText.appendChild(liveContainer);
  typingText.appendChild(upcomingText);

  const upcomingPreview = document.createElement("span");
  upcomingPreview.setAttribute("id", "upcomingPreview");
  const textPreview = document.createElement("p");
  if (settings.show_preview) {
    const livePreviewContainer = createLiveWordElement();
    textPreview.appendChild(livePreviewContainer);
    textPreview.setAttribute("id", "textPreview");
    textPreview.appendChild(upcomingPreview);
  }

  const typingInput = document.createElement("input");
  typingInput.setAttribute("id", "typingInput");
  typingInput.setAttribute("type", "text");

  const capsOption = document.createElement("button");
  capsOption.innerHTML = "a";
  capsOption.classList.add("option");
  capsOption.setAttribute("id", "capsOption");
  gameHeaderContainer.appendChild(capsOption);

  const puncsOption = document.createElement("button");
  puncsOption.innerHTML = ";";
  puncsOption.classList.add("option");
  puncsOption.setAttribute("id", "puncsOption");
  gameHeaderContainer.appendChild(puncsOption);

  // const spaceOption = document.createElement("button");
  // spaceOption.innerHTML = "˽";
  // spaceOption.classList.add("option");
  // spaceOption.setAttribute("id", "spaceOption");
  // gameHeaderContainer.appendChild(spaceOption);

  const syllablesOption = document.createElement("button");
  syllablesOption.innerHTML = "O˽K";
  syllablesOption.classList.add("option");
  syllablesOption.setAttribute("id", "syllablesOption");
  gameHeaderContainer.appendChild(syllablesOption);

  const keysOption = document.createElement("button");
  keysOption.innerHTML = "Profile";
  keysOption.classList.add("option");
  keysOption.setAttribute("id", "keysOption");
  gameHeaderContainer.appendChild(keysOption);

  const settingsOption = document.createElement("button");
  settingsOption.innerHTML = "Settings";
  settingsOption.classList.add("option");
  settingsOption.setAttribute("id", "settingsOption");
  gameHeaderContainer.appendChild(settingsOption);

  const speedCounter = document.createElement("h1");
  speedCounter.setAttribute("id", "speedCounter");
  speedCounter.classList.add("counter");
  const accuracyCounter = document.createElement("h1");
  accuracyCounter.setAttribute("id", "accuracyCounter");
  accuracyCounter.classList.add("counter");
  const elapsedTimeCounter = document.createElement("h1");
  elapsedTimeCounter.setAttribute("id", "elapsedTimeCounter");
  elapsedTimeCounter.classList.add("counter");
  const countdownTimerCounter = document.createElement("h1");
  countdownTimerCounter.setAttribute("id", "countdownTimerCounter");
  countdownTimerCounter.classList.add("counter");
  const upcomingLetterDisplay = document.createElement("h1");
  upcomingLetterDisplay.setAttribute("id", "upcomingLetterDisplay");
  upcomingLetterDisplay.classList.add("counter");
  const errorLetterDisplay = document.createElement("h1");
  errorLetterDisplay.setAttribute("id", "errorLetterDisplay");
  errorLetterDisplay.classList.add("counter");
  const slowAlert = document.createElement("h1");
  slowAlert.setAttribute("id", "slowAlert");
  slowAlert.classList.add("counter");

  gameContainer.appendChild(typingText);
  gameContainer.appendChild(textPreview);
  gameContainer.appendChild(typingInput);
  if (settings.show_countdown)
    gameHeaderContainer.appendChild(countdownTimerCounter);
  if (settings.show_elapsed || settings.show_total_elapsed)
    gameHeaderContainer.appendChild(elapsedTimeCounter);
  if (settings.show_wpm) gameHeaderContainer.appendChild(speedCounter);
  if (settings.show_accuracy) gameHeaderContainer.appendChild(accuracyCounter);
  if (settings.show_upcoming_letter)
    gameHeaderContainer.appendChild(upcomingLetterDisplay);
  if (settings.show_error_letter)
    gameHeaderContainer.appendChild(errorLetterDisplay);
  if (!settings.slow_mode) gameHeaderContainer.appendChild(slowAlert);

  return [
    gameContainer,
    gameHeaderContainer,
    typingText,
    completedText,
    upcomingPreview,
    upcomingText,
    textPreview,
    typingInput,
    elapsedTimeCounter,
    speedCounter,
    accuracyCounter,
    countdownTimerCounter,
    upcomingLetterDisplay,
    errorLetterDisplay,
    slowAlert,
    capsOption,
    puncsOption,
    // spaceOption,
    syllablesOption,
    keysOption,
    settingsOption,
  ];
}

function createScoreBoardElements() {
  const scoreContainer = document.createElement("div");
  scoreContainer.setAttribute("id", "scoreContainer");
  const scoreBoard = document.createElement("table");
  scoreBoard.setAttribute("id", "scoreBoard");
  scoreContainer.appendChild(scoreBoard);
  const scoreHeader = document.createElement("tr");
  scoreHeader.setAttribute("id", "scoreHeader");
  scoreBoard.appendChild(scoreHeader);
  const scoreTime = document.createElement("th");
  scoreTime.setAttribute("id", "scoreTime");
  scoreTime.innerText = "Time";
  scoreHeader.appendChild(scoreTime);
  const scoreValue = document.createElement("th");
  scoreValue.setAttribute("id", "scoreValue");
  scoreValue.innerText = "Score";
  scoreHeader.appendChild(scoreValue);
  return [scoreContainer, scoreBoard];
}

function createOverlay(heading) {
  const div = document.createElement("div");
  div.tabIndex = 1;
  const header = document.createElement("div");
  const h3 = document.createElement("h3");
  h3.innerText = heading;
  header.appendChild(h3);
  div.appendChild(header);
  const close = document.createElement("button");
  close.classList.add("close");
  close.innerText = "X";
  close.addEventListener("click", function () {
    div.remove();
  });
  div.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      console.log("escaped");
      div.remove();
    }
  });
  header.appendChild(close);
  div.classList.add("overlay");
  return div;
}
