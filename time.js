function timeInterval() {
  current_time = Date.now();
  // total_time_paused()
  time_paused = totalTimePaused();
  // updateElapsedTime();
  elapsed_time = current_time - start;
  elapsed_play_time = elapsed_time - time_paused;
  // updateCountdown();
  countdown_time = settings.countdown_time * 1000 - elapsed_time;
  countdown_play_time = countdown_time + time_paused;
  // updateSpeed();
  total_letters_and_spaces =
    finished_words.join(" ").length + correct_letter_length;
  speed = total_letters_and_spaces / 5 / (elapsed_play_time / 60);
  // updateAccuracy();
  char_count = data.total_letter_count;
  accuracy = (char_count - data.mistype_count) / char_count;
  // console.log(
  //   "char count:",
  //   char_count,
  //   "mistypes:",
  //   data.mistype_count,
  //   "accuracy:",
  //   accuracy
  // );
  // console.log(
  //   countdown_time,
  //   countdown_play_time,
  //   elapsed_time,
  //   elapsed_play_time,
  //   speed,
  //   accuracy
  // );
  updateTimeDisplay();
}

function updateTimeDisplay() {
  //   if (settings.show_wpm) {
  //     if (!["ON_WORD", "ON_TYPE"].includes(speedSetting)) {
  //       let interval = settings.speed_and_accuracy_update_interval || 100;
  //       if (speedSetting === "ON_CLOCK") {
  //         interval = 1000;
  //       } else if (speedSetting === "CONSTANT") {
  //         interval = 100;
  //       }
  // if (settings.show_countdown) {
  //     if (settings.pause_countdown_on_pause) {
  // console.log(countdown_time);
  countdownTimerCounter.innerText = countdown_time;
  // if (settings.end_after_countdown && countdown_time <= 0)
  // resetGame();
  // if (settings.show_elapsed) {
  // if (settings.show_total_elapsed) {
  elapsedTimeCounter.innerText = Math.floor(elapsed_play_time / 1000);
  speedCounter.innerText = Math.floor(speed * 1000);
  // if (settings.end_below_accuracy && accuracy < minacc) {
  //     resetGame();
  //   }
  accuracyCounter.innerText = Math.floor(100 * accuracy);
}
