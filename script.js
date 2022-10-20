function quote_mode() {
  // TODO

  // function win() {
  //   // addScoreRow();
  //   recordScore();
  // }

  // function checkTime(i) {
  //   if (i < 10) {
  //     i = "0" + i;
  //   }
  //   return i;
  // }

  // function addScoreRow() {
  //   let tr = document.createElement("tr");
  //   let time = document.createElement("td");
  //   let dt = new Date();
  //   let hrs = dt.getHours() % 12;
  //   let mins = checkTime(dt.getMinutes());
  //   let secs = checkTime(dt.getSeconds());
  //   time.innerText = hrs + ":" + mins + ":" + secs;
  //   let value = document.createElement("td");
  //   value.innerText = speed;
  //   tr.appendChild(time);
  //   tr.appendChild(value);
  //   // if(scoreHeader !== null){
  //   if (!scoreHeader.nextSibling) {
  //     scoreBoard.appendChild(tr);
  //   } else {
  //     scoreBoard.insertBefore(tr, scoreHeader.nextSibling);
  //   }
  //   // }
  // }

  function advanceWord() {
    if (settings.show_wpm && settings.speed_and_accuracy_update === "ON_WORD") {
      speedCounter.innerText = settings.wpm_label + " " + speed;
    }
    if (is_word_mistyped) {
      recordMistypedWord((word = current_word));
      is_word_mistyped = false;
    }
    // console.log("advancing word", current_word);
    finished_words.push(current_word);
    if (upcoming_words.length > 0) {
      current_word = upcoming_words.shift();
      // Is this necessary?
      let current_word_unpunct = removePunctuation(current_word);
      //-------------------
      recordWord(current_word_unpunct);
      // console.log(data);
      correct_letter_length = 0;
      updateUpcomingLetter();
      updateGameDisplay();
      if (settings.pause_timer_between_words) {
        pauseGame();
      }
    } else {
      playback = createPlayback();
      if (settings.replay) {
        if (replay) {
          recordScore();
          show_replay();
        } else {
          document.querySelectorAll(".option").forEach(function (e) {
            e.classList.remove("hide");
          });
          resetGame();
        }
        replay = !replay;
      } else {
        recordScore();
        resetGame();
      }
    }
  }

  function resetGame(str = null, process = true) {
    data = {
      letters: {},
      total_letter_count: 0,
      mistype_count: 0,
      words: {},
      word_mistypes: {},
      letter_mistypes: {},
      all_presses: [],
    };

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

    source_quote = str || selectRandomElem(quotes);
    quote = !process ? source_quote : processQuote(source_quote);

    //initialize time state
    current_time = null;
    speed = 0;
    resumeGame();
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

  function createPlayback() {
    const playback = [];
    for (let i = 0; i < data["all_presses"].length; i++) {
      let button = data["all_presses"][i][0];
      let time = data["all_presses"][i][1];
      time = i === 0 ? time - start : time - data["all_presses"][i - 1][1];
      playback.push([button, time]);
    }
    return playback;
  }

  function show_replay() {
    typingInput.removeEventListener("input", mouseOutPauseListener);
    typingInput.readOnly = true;
    // playback = createPlayback();
    // hide buttons which can modify the state during the replay
    document.querySelectorAll(".option").forEach(function (e) {
      e.classList.add("hide");
    });
    // reset the game using the quote (as opposed to source_quote)
    // but don't process it again..
    resetGame((str = quote), (process = false));

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
          // console.log("num_backspaces ", num_backspaces);
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

  document.body.appendChild(gameContainer);
  // document.body.appendChild(scoreContainer);

  capsOption.addEventListener("click", function () {
    settings.auto_capitalize = !settings.auto_capitalize;
    resetGame((str = source_quote));
  });

  puncsOption.addEventListener("click", function () {
    settings.auto_punctuate = !settings.auto_punctuate;
    resetGame((str = source_quote));
  });

  // spaceOption.addEventListener("click", function () {
  //   settings.no_spaces = !settings.no_spaces;
  //   resetGame((str = source_quote));
  // });

  syllablesOption.addEventListener("click", function () {
    settings.split_syllables_naive = !settings.split_syllables_naive;
    resetGame((str = source_quote));
  });

  keysOption.addEventListener("click", function () {
    div = createOverlay("Profile");
    document.body.appendChild(div);
  });

  function updateSettingsView(table) {
    table.innerHTML = "";
    headrow = document.createElement("tr");
    th1 = document.createElement("th");
    th1.innerText = "Setting";
    th2 = document.createElement("th");
    th2.innerText = "Value";
    headrow.append(th1, th2);
    table.append(headrow);
    for (var key of Object.keys(settings)) {
      const row = document.createElement("tr");
      const k = document.createElement("td");
      k.innerText = key;
      const v = document.createElement("td");
      v.innerText = settings[key];
      row.append(k, v);
      table.append(row);
      console.log(key, settings[key]);
    }
  }

  settingsOption.addEventListener("click", function () {
    div = createOverlay("Settings");
    select = document.createElement("select");
    for (var key of Object.keys(settings)) {
      const opt = document.createElement("option");
      opt.value = key;
      opt.textContent = key;
      select.append(opt);
    }
    inp = document.createElement("input");
    table = document.createElement("table");
    select.addEventListener("change", function (e) {
      inp.value = settings[e.target.value];
    });
    inp.addEventListener("keypress", function (e) {
      console.log(e.code || e.key);
      if (!e) e = window.event;
      var keyCode = e.code || e.key;
      if (keyCode == "Enter") {
        console.log("ENTER!!!!!!!!");
        settings[select.value] = e.target.value;
        updateSettingsView(table);
        console.log(settings);
        resetGame();
        inp.focus();
        // div.remove();
        return false;
      }
    });
    updateSettingsView(table);
    inp.value = settings[select.value];
    div.append(select, inp, table);
    document.body.appendChild(div);
  });
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

    let completed_but_backspaced =
      settings.keep_completed_letters &&
      // backspaced over correctly typed chars
      e.target.value.length < correct_letter_length;

    // ...and are now typing (not backspacing)
    let now_typing = e.target.value.length > last_input.length;

    if (
      !settings.allow_incorrect_letters &&
      e.target.value.slice(-1) !== upcoming_letter
    ) {
      e.target.value = current_word.slice(0, correct_letter_length);
    } else if (completed_but_backspaced) {
      if (now_typing)
        e.target.value = current_word.slice(0, correct_letter_length);
      // else (maintain letter length)
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
}

quote_mode();
