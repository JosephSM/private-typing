function recordCharacterOccurence(character = upcoming_letter) {
  data.total_letter_count += 1;
  console.log("recording", character, "|", data.total_letter_count);
  if (data["letters"].hasOwnProperty(character)) {
    data["letters"][character] += 1;
  } else {
    data["letters"][character] = 1;
  }
}

function recordMistypedCharacter(
  character = upcoming_letter,
  err_char = err_char
) {
  if (!data["letter_mistypes"].hasOwnProperty(character)) {
    data["letter_mistypes"][character] = {};
  }
  if (!data["letter_mistypes"][character].hasOwnProperty(err_char)) {
    data["letter_mistypes"][character][err_char] = 1;
  } else {
    data["letter_mistypes"][character][err_char] += 1;
  }
  data.mistype_count += 1;
  console.log("mistyped char: ", err_char, "|", data.mistype_count);
}

function recordMistypedWord(word = current_word) {
  if (data["word_mistypes"].hasOwnProperty(word)) {
    data["word_mistypes"][word] += 1;
  } else {
    data["word_mistypes"][word] = 1;
  }
}

function recordWord(word) {
  if (data["words"].hasOwnProperty(word)) {
    data["words"][word] += 1;
  } else {
    data["words"][word] = 1;
  }
}

function recordLetterPress(e) {
  if (last_input.length < e.target.value.length) {
    data.all_presses.push([
      e.target.value.slice(last_input.length),
      time_of_button_press,
    ]);
  } else {
    // record number of letters backspaced via ctrl+backspace
    let backspace_len = last_input.length - e.target.value.length;
    data.all_presses.push([backspace_len + " <BS>", time_of_button_press]);
  }
}

function recordSkippedChars() {
  let skipped_chars = current_word.slice(correct_letter_length + 1).split("");
  console.log("skipped chars: ", skipped_chars);
  if (skipped_chars !== []) {
    for (let char of skipped_chars) {
      recordCharacterOccurence(char);
      recordMistypedCharacter(char, (err_char = "<blank>"));
    }
  }
}

function recordScore() {
  let elapsed_ms = data.all_presses.at(-1).at(-1) - start - time_paused;
  let words = quote.length / 5;
  let minute = elapsed_ms / 60_000;
  score = {
    start: start,
    source_quote: source_quote,
    quote: quote,
    settings: Object.assign({}, settings),
    data: data,
    pauseTimes: pauseTimes,
    resumeTimes: resumeTimes,
    time_paused: time_paused,
    speed: words / minute,
    accuracy:
      (data.total_letter_count - data.mistype_count) / data.total_letter_count,
    total_elapsed_time: elapsed_time,
    playback: playback,
  };
  if (history) history.push(score);
  else history = [score];
  // alert("Score Recorded");
  console.log(history);
}

// update mean
function updateMean(mu, n, x) {
  return mu + (x - mu) / n;
}

function recordAverageSpeed() {}

function recordAverageAccuracy() {}

/*
letter_stats = {
  a:{
    accuracy:89,
    speed: 50,
    frequency:30,
    mistypes: {
      q: 39,
      s:20,
      z: 2,
    }
  },
  b
  c
  d
  e
}







*/
