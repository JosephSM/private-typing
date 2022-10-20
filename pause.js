function pauseGame(style = true) {
  // only pause a game if it has started
  // or not already paused
  // console.log(pauseTimes)
  // console.log(resumeTimes)
  if (start && pauseTimes.length === resumeTimes.length) {
    console.log("Paused at " + start);
    if (style) gameContainer.style = "background-color:grey;";
    pauseTimes.push(Date.now());
  } else {
    console.log("ERROR: game paused without having been started");
  }
}

function resumeGame() {
  if (start && pauseTimes.length > resumeTimes.length) {
    gameContainer.style = "background-color:white;";
    resumeTimes.push(Date.now());
  }
}

function totalTimePaused() {
  let totalTimePaused = 0;
  let resumetime;
  for (let i = 0; i < pauseTimes.length; i++) {
    resumetime = resumeTimes[i] || current_time;
    totalTimePaused += resumetime - pauseTimes[i];
  }
  return totalTimePaused;
}
