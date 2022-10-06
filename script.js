(function the_game() {
  // TODO
  function removeUntypables(str) {
    return str.replace(/[—]/g, "").replace(/\s{2,}/g, " ");
  }

  function removePunctuation(str) {
    return str
      .replace(/[.,'\/#!?$%\^&\*;:{}=—\-_`~()]/g, "")
      .replace(/\s{2,}/g, " ");
  }

  function syllabify(words) {
    const syllableRegex =
      /[^aeiouy]*[aeiouy]+(?:[^aeiouy]*$|[^aeiouy](?=[^aeiouy]))?/gi;
    return words.match(syllableRegex);
  }

  function processQuote(source, quote = null) {
    if (!quote) {
      quote = selectRandomElem(source);
    }
    quote = removeUntypables(quote);

    if (settings.auto_capitalize) {
      quote = quote.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
    }

    if (settings.auto_punctuate) {
      let fin = [];
      let words = removePunctuation(quote).split(" ");
      let numOps = "#$+%~=*^.><-";
      let pref = "@#&*/-\\";
      let suf = ":.;,?!";
      let wordOps = suf + pref;
      let pairs = {
        "(": ")",
        "[": "]",
        "{": "}",
        "<": ">",
        '"': '"',
        "'": "'",
        "`": "`",
      };
      if (settings.alternate_quoting) {
        wordOps += Object.keys(pairs).join();
      }
      let isWord = false;
      for (let word of words) {
        let op;
        if (isNaN(parseInt(word))) {
          isWord = true;
          op = wordOps[Math.floor(Math.random() * wordOps.length)];
        } else {
          op = numOps[Math.floor(Math.random() * numOps.length)];
        }
        let newToken;
        if (isWord) {
          if (pref.includes(op)) {
            newToken = op + word;
          } else if (suf.includes(op)) {
            newToken = word + op;
          } else {
            newToken = op + word + pairs[op];
          }
        } else {
          newToken = op === "%" ? word + op : op + word;
        }
        fin.push(newToken);
      }
      quote = fin.join(" ");
    }

    if (settings.split_syllables_naive) {
      quote = quote
        .split(" ")
        .map(syllabify)
        .map((x) => (x === null ? "" : x.join(" ")))
        .join(" ");
    }

    if (!settings.show_punctuation) {
      quote = removePunctuation(quote);
    }

    if (!settings.show_capitalization) {
      quote = quote.toLowerCase();
    }

    if (settings.no_spaces) {
      // console.log(quote.split(" "));
      quote = quote.split(" ").join("");
    }

    return quote.trim();
  }

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
    if (settings.show_accuracy)
      gameHeaderContainer.appendChild(accuracyCounter);
    if (settings.show_upcoming_letter)
      gameHeaderContainer.appendChild(upcomingLetterDisplay);
    if (settings.show_error_letter)
      gameHeaderContainer.appendChild(errorLetterDisplay);
    if (!settings.slow_mode) gameHeaderContainer.appendChild(slowAlert);

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
      scoreContainer,
      scoreBoard,
    ];
  }

  function win() {
    addScoreRow();
  }

  function createDialog(name, heading = "Heading") {
    const Dialog = document.createElement("div");
    Dialog.setAttribute("id", name + "Dialog");
    Dialog.setAttribute("class", "dialog");
    const Heading = document.createElement("h1");
    Heading.setAttribute("id", name + "Heading");
    Heading.innerText = heading;
    Dialog.appendChild(Heading);

    const close = document.createElement("h1");
    close.setAttribute("class", "dialogClose");
    close.innerText = "X";
    close.onclick = function () {
      Dialog.remove();
    };
    Dialog.appendChild(close);

    for (let i = 2; i < arguments.length; i += 2) {
      const button = document.createElement("button");
      button.setAttribute("id", name + "Button" + i / 2);
      button.innerText = arguments[i];
      button.onclick = arguments[i + 1];
      Dialog.appendChild(button);
    }
    document.body.appendChild(Dialog);
    return Dialog;
  }

  function pauseGame(style = true) {
    // only pause a game if it has started
    // or not already paused
    // console.log(pauseTimes)
    // console.log(resumeTimes)
    if (start && pauseTimes.length === resumeTimes.length) {
      console.log("pause called " + start);
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

  function checkTime(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  }

  function selectRandomElem(items) {
    return items[Math.floor(Math.random() * items.length)];
  }

  function addScoreRow() {
    let tr = document.createElement("tr");
    let time = document.createElement("td");
    let dt = new Date();
    let hrs = dt.getHours() % 12;
    let mins = checkTime(dt.getMinutes());
    let secs = checkTime(dt.getSeconds());
    time.innerText = hrs + ":" + mins + ":" + secs;
    let value = document.createElement("td");
    value.innerText = speed;
    tr.appendChild(time);
    tr.appendChild(value);
    // if(scoreHeader !== null){
    if (!scoreHeader.nextSibling) {
      scoreBoard.appendChild(tr);
    } else {
      scoreBoard.insertBefore(tr, scoreHeader.nextSibling);
    }
    // }
  }

  function advanceWord() {
    if (settings.show_wpm && settings.speed_and_accuracy_update === "ON_WORD") {
      speedCounter.innerText = settings.wpm_label + " " + speed;
    }
    if (is_word_mistyped) {
      recordMistypedWord((word = current_word));
      is_word_mistyped = false;
    }
    console.log("advancing word", current_word);
    finished_words.push(current_word);
    if (upcoming_words.length === 0) {
      win();
      if (settings.auto_restart) {
        if (replay) {
          show_replay();
        } else {
          resetGame();
        }
        replay = !replay;
      } else resetGame((button = true));
    } else {
      current_word = upcoming_words.shift();
      let current_word_unpunct = removePunctuation(current_word);
      if (data["words"].hasOwnProperty(current_word_unpunct)) {
        data["words"][current_word_unpunct] += 1;
      } else {
        data["words"][current_word_unpunct] = 1;
      }
      console.log(data);
      correct_letter_length = 0;
      updateUpcomingLetter();
      updateGameDisplay();
      if (settings.pause_timer_between_words) {
        pauseGame();
      }
    }
  }

  function resetGame(button = false, str = null) {
    data = {
      letters: {},
      total_letter_count: 0,
      mistype_count: 0,
      words: {},
      word_mistypes: {},
      letter_mistypes: {},
      all_presses: [],
    };
    if (button) {
      createDialog("play-again", "Play Again?", "Play");
    }

    //reset time interval
    interval && clearInterval(interval);
    interval = null;

    //reset Game Display
    typingInput.readOnly = false;
    typingInput.value = "";
    speedCounter.innerText = 0;
    accuracyCounter.innerText = "100%";
    elapsedTimeCounter.innerText = 0;
    countdownTimerCounter.innerText = settings.countdown_time;

    // getQuote()
    if (settings.quote_collection) {
      quotes = quote_collection[settings.quote_collection];
    } else {
      quotes = quote_collection["Harry Potter"];
    }
    if (str) {
      quote = str;
    } else {
      quote = processQuote(quotes);
    }

    //initialize time state
    current_time = null;
    speed = 0;
    pauseTimes = [];
    resumeTimes = [];

    //initialize game state
    last_input = "";
    upcoming_words = quote.trim().split(" ");
    current_word = ""; // advanceWord() sets this to first word in quote
    finished_words = [];
    advanceWord(); // move to next word and record words and mistyped words in data
    updateUpcomingLetter();

    // reset the visuals
    updateGameDisplay();
    typingInput.focus();
    start = settings.auto_restart_clock ? Date.now() : null;
  }

  function recordCharacterOccurence(character = upcoming_letter) {
    console.log("recording ", character);
    data.total_letter_count += 1;
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
    console.log("mistyped char: ", err_char);
  }

  function recordMistypedWord(word = current_word) {
    if (data["word_mistypes"].hasOwnProperty(word)) {
      data["word_mistypes"][word] += 1;
    } else {
      data["word_mistypes"][word] = 1;
    }
  }

  function updateUpcomingLetter() {
    upcoming_letter = current_word[correct_letter_length] || " ";
  }

  function updateGameDisplay(input = typingInput.value) {
    if (settings.show_word_history) {
      completedText.innerText = finished_words.join(" ");
    }
    // can this be simplified?
    // console.log(correct_letter_length, input.length);
    [].forEach.call(document.querySelectorAll(".liveText"), (elem) => {
      elem.querySelector(".rightText").innerText = current_word.slice(
        0,
        correct_letter_length
      );
      elem.querySelector(".wrongText").innerText = current_word.slice(
        correct_letter_length,
        input.length
      );
      elem.querySelector(".restText").innerText = current_word.slice(
        Math.max(input.length, correct_letter_length)
      );
    });
    upcomingLetterDisplay.innerText =
      upcoming_letter === " " ? "˽" : upcoming_letter;
    upcomingText.innerText = upcoming_words.join(" ");
    upcomingPreview.innerText = upcoming_words
      .slice(0, settings.preview_length)
      .join(" ");
  }

  function show_replay() {
    typingInput.removeEventListener("input", mouseOutPauseListener);
    typingInput.readOnly = true;
    playback = [];
    for (let i = 0; i < data["all_presses"].length; i++) {
      let button = data["all_presses"][i][0];
      let time = data["all_presses"][i][1];
      time = i === 0 ? time - start : time - data["all_presses"][i - 1][1];
      playback.push([button, time]);
    }
    resetGame((button = false), (str = quote));
    // console.log(playback)
    last_time = null;
    replay_interval = setInterval(function () {
      if (playback.length === 0) {
        clearInterval(replay_interval);
        return;
      }
      if (!last_time) {
        last_time = start;
      }
      this_time = Date.now();
      if (this_time - last_time >= playback[0][1]) {
        let btn = playback.shift(playback[0])[0];
        typingInput.readOnly = true;
        let cv = typingInput.value;
        if (btn.length === 1) {
          typingInput.value = cv + btn;
        } else {
          num_backspaces = parseInt(btn.split(" ")[0]);
          console.log("num_backspaces ", num_backspaces);
          typingInput.value = cv.substring(0, cv.length - num_backspaces);
        }
        typingInput.dispatchEvent(new Event("input", { bubbles: true }));
        last_time = this_time;
      }
    }, 30);
  }

  function get_correct_letter_length(e) {
    //for every index from END to BEGINNING
    for (let i = current_word.length; i >= 0; i--) {
      // if the slice from the beginning til that index matched the current word's
      //first match can break
      if (e.target.value.slice(0, i) === current_word.slice(0, i)) {
        // if more of the word has been typed correctly
        return i;
      }
    }
    return 0;
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
    console.log(countdown_time);
    countdownTimerCounter.innerText = "countdown_time";
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

  function todo() {
    // Don't record button press
    // if (!settings.insert_mode) {
    //     e.target.value = last_input
    //     return
    // }
    //slow mode is buggy
    // if (settings.slow_mode && speed > settings.speed_ceiling){
    //     console.log("Too fast! ", speed)
    //     if (settings.slow_mode) {
    //         e.target.value = last_input
    //     }
    //     slowAlert.innerText = "Slow Down! "
    //     return
    // }else{
    //     slowAlert.innerText = ""
    // }
  }

  const [
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
    scoreContainer,
    scoreBoard,
  ] = createGameElements();

  document.body.appendChild(gameContainer);
  document.body.appendChild(scoreContainer);

  let quotes, // list of quotes chosen by game
    quote, // text to practice typing on
    data, // object containing letter and word frequencies, errors and speed
    // --- WORD ---
    upcoming_letter, // next letter required to type
    current_word, // current word to type correctly
    upcoming_words, // list of upcoming words in quote, seperated by spaces
    finished_words, // words completed (or skipped)
    correct_letter_length, // index AFTER last correctly typed character AKA the count of correctly typed letters
    is_word_mistyped, // true when current word been recorded in data as mistyped so as not to re-record
    last_input, // text of the last state of the input field
    // --- TIME ---
    time_of_button_press, // timestamp of last button pressed into input
    start, // timestamp of the game start
    current_time,
    elapsed_time,
    countdown_time,
    interval,
    // --- PLAYTIME  ---
    elapsed_play_time,
    countdown_play_time,
    // PAUSE AND RESUME
    pauseTimes, // list of recorded timestamps of times paused
    resumeTimes, // list of recorded timestamps of times resumed
    time_paused, // total time paused in  ms
    mouseOutPauseListener, // pause when input not selected
    // --- SPEED AND ACCURACY
    speed,
    accuracy;

  let playback, last_time;
  let replay = true;
  resetGame();

  if (settings.pause_on_mouseout) {
    mouseOutPauseListener = typingInput.addEventListener("focusout", pauseGame);
  }

  typingInput.addEventListener("input", function (e) {
    time_of_button_press = Date.now();

    // only resume if the game is currently paused
    if (pauseTimes.length > resumeTimes.length) {
      resumeGame();
    }
    if (settings.show_wpm && settings.speed_and_accuracy_update === "ON_TYPE") {
      speedCounter.innerText = settings.wpm_label + " " + speed;
    }
    // some todos in this function
    // todo()

    // On first button press...
    // start = time
    // initiate elapsed, countdown, speed, & accuracy timers
    if (!start) {
      start = time_of_button_press;
      // 50ms is fast enough to accurately track a typist typing at 230wpm
      // 50ms < 1 / ( 230wpm * (5 / 60,000))
      interval = setInterval(timeInterval, 500);
    }
    // record typed letters and backspaces
    // data["all_presses"].push([letter, timestamp])
    recordLetterPress(e);

    // correct_letter_length = number of correctly typed letters from beggining of word
    // initial value is 0 - (reset by advanceWord(), which is called upon resetGame())
    if (
      //if we're 1 ahead of the correctly typed letters
      // (as a result of typing and not backspacing)
      e.target.value.length - 1 === correct_letter_length &&
      last_input.length < e.target.value.length
    ) {
      //increment the character count of the expected char - data["letters"][upcoming_letter ] += 1
      // this happens whether or not the correct character was typed
      recordCharacterOccurence((character = upcoming_letter));

      let typed_letter = e.target.value.slice(-1);
      if (typed_letter === upcoming_letter) {
        errorLetterDisplay.innerText = "";
      } else {
        recordMistypedCharacter(
          (character = upcoming_letter),
          (err_char = typed_letter)
        );
        is_word_mistyped = true; // recorded in data when word advances
        errorLetterDisplay.innerText =
          typed_letter === " " ? "˽" : typed_letter;
      }
    }

    // ----- RE-CALCULATE -----
    // correct_letter_length
    // ------ UPDATE -------
    // upcoming letter & GameDisplay

    let keep_completed_letters =
      settings.keep_completed_letters &&
      // backspaced over correctly typed chars
      e.target.value.length < correct_letter_length &&
      // ...and are now typing (not backspacing)
      e.target.value.length > last_input.length;

    if (
      keep_completed_letters ||
      (!settings.allow_incorrect_letters &&
        e.target.value.slice(-1) !== upcoming_letter)
    ) {
      e.target.value = current_word.slice(0, correct_letter_length);
    } else {
      correct_letter_length = get_correct_letter_length(e);
      updateUpcomingLetter();
      updateGameDisplay();
    }
    // --- Overview of updateGameDisplay() ---
    //UPDATE VISUAL COMPONENTS OF GAME THAT DONT INVOLVE THE CLOCK
    //completedText = finished_words,
    //.rightText = currentword[:correct_letter]
    //.wrongText = currentword[correct_letter:input_length]
    //.rest = currentword[input_length:]
    //upcomingLetter = upcoming_letter
    //upComingText = upcoming_words.join(" ")
    //upComingPreview = upcoming_words.slice(n).join(" ")
    // -----------------------------------------

    // ---- Advancing the word -----
    if (
      // normal advance (upon completed word)
      e.target.value === current_word + " " ||
      (e.target.value === current_word && !settings.advance_on_space)
    ) {
      e.target.value = "";
      advanceWord();
    } else if (
      // advance with errors (incomplete word)
      settings.advance_with_errors &&
      e.target.value.slice(-1) === " "
    ) {
      recordSkippedChars();
      e.target.value = "";
      advanceWord();
    }

    last_input = e.target.value;
  });
})();
