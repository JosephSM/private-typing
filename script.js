(function the_game() {
    // TODO
    function removeUntypables(str) {
        return str.replace(/[—]/g, "")
        .replace(/\s{2,}/g, " ")
    }

    function removePunctuation(str) {
        return str.replace(/[.,'\/#!?$%\^&\*;:{}=—\-_`~()]/g, "")
            .replace(/\s{2,}/g, " ")
    }

    function syllabify(words) {
        const syllableRegex = /[^aeiouy]*[aeiouy]+(?:[^aeiouy]*$|[^aeiouy](?=[^aeiouy]))?/gi;
        return words.match(syllableRegex);
    }

    function processQuote(source, quote=null) {
        if(!quote){
            quote = selectRandomElem(source);
        }
        quote = removeUntypables(quote)

        if (settings.auto_capitalize) {
            quote = quote.replace(
                /\w\S*/g,
                function (txt) {
                    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                }
            );
        }

        if (settings.auto_punctuate) {
            let fin = []
            let words = removePunctuation(quote).split(" ")
            let numOps = "#$+%~=*^.><-"
            let pref = "@#&*/-\\"
            let suf = ":.;,?!"
            let wordOps = suf + pref
            let pairs = {
                "(": ")",
                "[": "]",
                "{": "}",
                "<": ">",
                '"': '"',
                "'": "'",
                "`": "`"
            }
            if (settings.alternate_quoting) {
                wordOps += Object.keys(pairs).join()
            }
            let isWord = false;
            for (let word of words) {
                let op
                if (isNaN(parseInt(word))) {
                    isWord = true;
                    op = wordOps[Math.floor(Math.random() * wordOps.length)]
                } else {
                    op = numOps[Math.floor(Math.random() * numOps.length)]
                }
                let newToken
                if (isWord) {
                    if (pref.includes(op)) {
                        newToken = op + word
                    }
                    else if (suf.includes(op)) {
                        newToken = word + op
                    }
                    else {
                        newToken = op + word + pairs[op]
                    }
                } else {
                    newToken = (op === '%') ? word + op : op + word
                }
                fin.push(newToken)
            }
            quote = fin.join(" ")
        }

        if (settings.split_syllables_naive) {
            quote = quote.split(" ")
                .map(syllabify)
                .map(x =>
                    (x === null)
                        ? ""
                        : x.join(" "))
                .join(" ")
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

        return quote.trim()
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
        return liveContainer
    }

    function createGameElements() {
        const gameContainer = document.createElement("div");
        gameContainer.setAttribute("id", "game");
        const gameHeaderContainer = document.createElement("div");
        gameHeaderContainer.setAttribute("id", "gameHeader");
        gameContainer.appendChild(gameHeaderContainer)
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

        const typingInput = document.createElement("input")
        typingInput.setAttribute("id", "typingInput");
        typingInput.setAttribute("type", "text");
        const speedCounter = document.createElement("h1");
        speedCounter.setAttribute("id", "speedCounter");
        speedCounter.classList.add("counter")
        const accuracyCounter = document.createElement("h1");
        accuracyCounter.setAttribute("id", "accuracyCounter");
        accuracyCounter.classList.add("counter")
        const elapsedTimeCounter = document.createElement("h1");
        elapsedTimeCounter.setAttribute("id", "elapsedTimeCounter");
        elapsedTimeCounter.classList.add("counter")
        const countdownTimerCounter = document.createElement("h1");
        countdownTimerCounter.setAttribute("id", "countdownTimerCounter");
        countdownTimerCounter.classList.add("counter")
        const upcomingLetterDisplay = document.createElement("h1");
        upcomingLetterDisplay.setAttribute("id", "upcomingLetterDisplay");
        upcomingLetterDisplay.classList.add("counter")
        const errorLetterDisplay = document.createElement("h1");
        errorLetterDisplay.setAttribute("id", "errorLetterDisplay");
        errorLetterDisplay.classList.add("counter")
        const slowAlert = document.createElement("h1");
        slowAlert.setAttribute("id", "slowAlert");
        slowAlert.classList.add("counter")

        gameContainer.appendChild(typingText);
        gameContainer.appendChild(textPreview);
        gameContainer.appendChild(typingInput);
        if (settings.show_countdown)
            gameHeaderContainer.appendChild(countdownTimerCounter);
        if (settings.show_elapsed || settings.show_total_elapsed)
            gameHeaderContainer.appendChild(elapsedTimeCounter);
        if (settings.show_wpm)
            gameHeaderContainer.appendChild(speedCounter);
        if (settings.show_accuracy)
            gameHeaderContainer.appendChild(accuracyCounter);
        if (settings.show_upcoming_letter)
            gameHeaderContainer.appendChild(upcomingLetterDisplay);
        if (settings.show_error_letter)
            gameHeaderContainer.appendChild(errorLetterDisplay);
        if (!settings.slow_mode)
            gameHeaderContainer.appendChild(slowAlert)

        const scoreContainer = document.createElement("div");
        scoreContainer.setAttribute("id", "scoreContainer")
        const scoreBoard = document.createElement("table")
        scoreBoard.setAttribute("id", "scoreBoard")
        scoreContainer.appendChild(scoreBoard)
        const scoreHeader = document.createElement("tr")
        scoreHeader.setAttribute("id", "scoreHeader")
        scoreBoard.appendChild(scoreHeader)
        const scoreTime = document.createElement("th")
        scoreTime.setAttribute("id", "scoreTime")
        scoreTime.innerText = "Time"
        scoreHeader.appendChild(scoreTime)
        const scoreValue = document.createElement("th")
        scoreValue.setAttribute("id", "scoreValue")
        scoreValue.innerText = "Score"
        scoreHeader.appendChild(scoreValue)

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
            scoreBoard
        ]
    }

    function win() {
        addScoreRow()
    }

    function createDialog(name, heading = "Heading") {
        const Dialog = document.createElement('div')
        Dialog.setAttribute("id", name + "Dialog")
        Dialog.setAttribute("class", "dialog")
        const Heading = document.createElement('h1')
        Heading.setAttribute("id", name + "Heading")
        Heading.innerText = heading;
        Dialog.appendChild(Heading)

        const close = document.createElement('h1')
        close.setAttribute("class", "dialogClose")
        close.innerText = "X"
        close.onclick = function () {
            Dialog.remove()
        }
        Dialog.appendChild(close)

        for (let i = 2; i < arguments.length; i += 2) {
            const button = document.createElement('button')
            button.setAttribute("id", name + "Button" + (i / 2))
            button.innerText = arguments[i]
            button.onclick = arguments[i + 1]
            Dialog.appendChild(button)
        }
        document.body.appendChild(Dialog)
        return Dialog
    }

    function pauseGame(style = true) {
        // only pause a game if it has started
        // or not already paused
        // console.log(pauseTimes)
        // console.log(resumeTimes)
        if (start 
            && pauseTimes.length === resumeTimes.length
            && !replay) {
            console.log("pause called " + start)
            if (style)
                gameContainer.style = "background-color:grey;"
            pauseTimes.push(Date.now());
        } else {
            console.log("pause game called without start")
        }
    }

    function resumeGame() {
        if (start && pauseTimes.length > resumeTimes.length) {
            gameContainer.style = "background-color:white;"
            resumeTimes.push(Date.now());
        }
    }

    function totalTimePaused() {
        let totalTimePaused = 0;
        let resumetime;
        for (let i = 0; i < pauseTimes.length; i++) {
            resumetime = resumeTimes[i] || current_time
            totalTimePaused += resumetime - pauseTimes[i]
        }
        return totalTimePaused
    }

    function calculatePlayTime(units = "seconds") {
        let playtime = current_time - start - totalTimePaused()
        if (units === "seconds") {
            playtime /= 1000
        } else if (units === "minutes") {
            playtime /= 60000
        }
        return playtime
    }

    function calculate_speed(completed_letters = last_i) {
        //TODO - consider Math.truncate()
        return Math.round(
            ((finished_words.join(" ").length + completed_letters) / settings.word_length)
            / calculatePlayTime("minutes"));
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
        let tr = document.createElement("tr")
        let time = document.createElement("td")
        let dt = new Date()
        let hrs = dt.getHours() % 12
        let mins = checkTime(dt.getMinutes())
        let secs = checkTime(dt.getSeconds())
        time.innerText = hrs + ":" + mins + ":" + secs;
        let value = document.createElement("td")
        value.innerText = speed
        tr.appendChild(time)
        tr.appendChild(value)
        if (!scoreHeader.nextSibling) {
            scoreBoard.appendChild(tr)
        } else {
            scoreBoard.insertBefore(tr, scoreHeader.nextSibling)
        }
    }

    function advanceWord() {
        if (current_word_mistyped) {
            recordMistypedWord(word = current_word)
            current_word_mistyped = false;
        }
        finished_words.push(current_word);
        current_word = upcoming_words.shift();
        let current_word_unpunct = removePunctuation(current_word)
        if (data["words"].hasOwnProperty(current_word_unpunct)) {
            data["words"][current_word_unpunct] += 1
        } else {
            data["words"][current_word_unpunct] = 1
        }
        last_i = 0
        console.log(data)
    }

    function resetGame(button = false, str=null) {
        data = {
            "letters": {},
            "words": {},
            "word_mistypes": {},
            "letter_mistypes": {},
            "all_presses": []
        }
        if (button) {
            createDialog("play-again", "Play Again?", "Play")
        }
        if (speed_update_interval)
            clearInterval(speed_update_interval)
        if (time_and_countdown_interval)
            clearInterval(time_and_countdown_interval)
        typingInput.readOnly = false
        typingInput.value = ""
        speedCounter.innerText = 0;
        accuracyCounter.innerText = "100%";
        elapsedTimeCounter.innerText = 0;
        countdownTimerCounter.innerText = settings.countdown_time
        typingInput.focus();
        if (settings.quote_collection) {
            quotes = quote_collection[settings.quote_collection]
        } else {
            quotes = quote_collection["Harry Potter"]
        }
        if(str){
            quote = str
        }else{
            quote = processQuote(quotes)
        }
        upcoming_words = quote.trim().split(" ");
        current_word = ""; // advanceWord() sets this to first word in quote
        finished_words = [];
        // last_i = 0; 
        advanceWord() // move to next word and record words and mistyped words in data
        updateUpcomingLetter()
        new_game = true
        start = settings.auto_restart_clock ? Date.now() : null;
        speed_update_interval = null;
        seconds_since_start = null;
        time_and_countdown_interval = null;
        current_time = null;
        speed = 0;
        pauseTimes = []
        resumeTimes = []
        error_was_typed = false;
        last_input = "";
        updateGameDisplay()
    }

    function recordCharacterOccurence(character = upcoming_letter) {
        console.log("recording ", character)
        if (data["letters"].hasOwnProperty(character)) {
            data["letters"][character] += 1
        } else {
            data["letters"][character] = 1
        }
    }

    function recordMistypedCharacter(character = upcoming_letter, err_char = err_char) {
        if (!data["letter_mistypes"].hasOwnProperty(character)) {
            data["letter_mistypes"][character] = {}
        }
        if (!data["letter_mistypes"][character].hasOwnProperty(err_char)) {
            data["letter_mistypes"][character][err_char] = 1
        } else {
            data["letter_mistypes"][character][err_char] += 1
        }
        console.log("mistyped char: ", err_char)
    }

    function recordMistypedWord(word = current_word) {
        if (data["word_mistypes"].hasOwnProperty(word)) {
            data["word_mistypes"][word] += 1
        }
        else {
            data["word_mistypes"][word] = 1
        }
    }

    function updateUpcomingLetter() {
        upcoming_letter = current_word[last_i] || "˽";
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
        scoreBoard
    ] = createGameElements();

    function updateGameDisplay(input = typingInput.value) {
        if (settings.show_word_history) {
            completedText.innerText = finished_words.join(" ");
        }
        // can this be simplified?
        // console.log(last_i, input.length);
        [].forEach.call(document.querySelectorAll(".liveText"), (elem) => {
            elem.querySelector(".rightText").innerText = current_word.slice(0, last_i);
            elem.querySelector(".wrongText").innerText = current_word.slice(last_i, input.length);
            elem.querySelector(".restText").innerText = current_word.slice(Math.max(input.length, last_i))
        })
        upcomingLetterDisplay.innerText = upcoming_letter
        upcomingText.innerText = upcoming_words.join(" ");
        upcomingPreview.innerText = upcoming_words.slice(0, settings.preview_length).join(" ");
    }

    function getAccuracy() {
        let total_letters = 0;
        let total_mistyped = 0;
        for (let letter in data["letters"]) {
            total_letters += data.letters[letter]
        }
        for (let letter in data["letter_mistypes"]) {
            for (let other_letter in data["letter_mistypes"][letter]) {
                total_mistyped += data.letter_mistypes[letter][other_letter]
            }
        }
        // console.log(total_letters, total_mistyped)
        if (total_letters === 0) {
            return 100
        }
        return (((total_letters - total_mistyped) / total_letters) * 100)
    }

    function timeAndCoundown() {
        current_time = Date.now()
        seconds_since_start = Math.floor((current_time - start) / 1000);
        speed = calculate_speed()
        if (settings.show_countdown) {
            let countdown = settings.countdown_time || 60;
            let countdown_time = countdown - seconds_since_start;
            if (settings.pause_countdown_on_pause) {
                countdown_time = countdown - Math.floor(calculatePlayTime("seconds"))
            }
            countdownTimerCounter.innerText = countdown_time
            if (settings.end_after_countdown && countdown_time <= 0) {
                resetGame()
            }
        }
        if (settings.show_total_elapsed) {
            elapsedTimeCounter.innerText = settings.elapsed_label + " " + seconds_since_start
        }
        if (settings.show_elapsed) {
            elapsedTimeCounter.innerText = settings.elapsed_label + " " + Math.floor(calculatePlayTime("seconds"))
        }
    }

    function updateSpeedAndAccuracy() {
        speedCounter.innerText = settings.wpm_label + " " + speed;
        //TODO - this should be moved to somewhere less expensive 
        accuracy = getAccuracy()
        minacc = settings.minimum_accuracy || 80
        if (settings.end_below_accuracy && accuracy < minacc) {
            resetGame()
        }
        accuracyCounter.innerText = Math.floor(accuracy) + "%"
    }

    function show_replay(){
        playback = []
        for(let i = 0; i < data["all_presses"].length; i++){
            let button = data["all_presses"][i][0]
            let time = data["all_presses"][i][1]
            time = (i === 0)
            ? time - start
            : time - data["all_presses"][i-1][1]
            playback.push([button, time])
        }
        resetGame(button=false, str=quote)
        // console.log(playback)
        last_time = Date.now()
        replay_interval = setInterval(function(){
            if (playback.length === 0){
                clearInterval(replay_interval)
                return
            }
            this_time = Date.now()
            if ((this_time - last_time) >= playback[0][1]){
                let btn = playback.shift(playback[0])[0]
                typingInput.readOnly = true
                let cv = typingInput.value
                if(btn.length === 1){
                    typingInput.value = cv + btn;
                }else{
                    num_backspaces = parseInt(btn.split(" ")[0])
                    console.log("num_backspaces ", num_backspaces)
                    typingInput.value = cv.substring(0, cv.length - num_backspaces)
                }
                typingInput.dispatchEvent(new Event('input', {bubbles:true}))
                last_time = this_time
            }
        }, 30)
    }

    document.body.appendChild(gameContainer);
    document.body.appendChild(scoreContainer);

    let quotes, // list of quotes chosen by game
        quote, // text to practice typing on
        data, // object containing letter and word frequencies, errors and speed
        upcoming_letter, // next letter required to type
        upcoming_words, // list of upcoming words in quote, seperated by spaces
        current_word, // current word to type correctly
        finished_words, // words completed (or skipped)
        new_game, // set to true before a new game begins
        start, // timestamp of the instant the game begins
        speed_update_interval, // setInterval() for updating the speed and accuracy Counters 
        seconds_since_start,
        time_and_countdown_interval, // setInterval() for regularly updating values other than speed and accuracy (countdown and elapsed time) 
        speed, // wpm calculation - updated by time_and_countdown_interval
        // used together to calculate play time
        pauseTimes, // list of recorded timestamps of times paused 
        resumeTimes, // list of recorded timestamps of times resumed
        time_of_button_press, // timestamp of last character typed
        // time_of_last_button_press,
        last_i, // index AFTER last correctly typed character AKA the count of correctly typed letters
        current_word_mistyped, // true when current word been recorded in data as mistyped so as not to re-record 
        last_input, // text of the last state of the input field
        accuracy; // (total-chars-encountered - total-chars-mistyped) / total-chars-encountered * 100

    let playback, last_time;
    let replay = true;
    resetGame()
    if (settings.pause_on_mouseout) {
        typingInput.addEventListener("focusout", pauseGame)
    }

    typingInput.addEventListener("input", function (e) {
        time_of_button_press = Date.now()
        // Don't record button press
        if (!settings.insert_mode) {
            e.target.value = last_input
            return
        }

        if (settings.slow_mode && speed > settings.speed_ceiling){
            console.log("Too fast! ", speed)   
            if (settings.slow_mode) {
                e.target.value = last_input
            }
            slowAlert.innerText = "Slow Down! "
            return  
        }else{
            slowAlert.innerText = ""
        }
        if (!start) {
            start = time_of_button_press
        }
        if (new_game) {
            //TODO: rename this
            // 50ms is fast enough to accurately track a typist typing at 230wpm
            // 50ms < 1 / ( 230wpm * (5 / 60,000))
            time_and_countdown_interval = setInterval(timeAndCoundown, 50)

            if (settings.show_wpm) {
                if (settings.speed_and_accuracy_update !== "ON_WORD"
                    && settings.speed_and_accuracy_update !== "ON_TYPE") {
                    let interval = settings.speed_and_accuracy_update_interval || 100
                    if (settings.speed_and_accuracy_update === "ON_CLOCK") {
                        interval = 1000;
                    } else if (settings.speed_and_accuracy_update === "CONSTANT") {
                        interval = 100;
                    }
                    speed_update_interval = setInterval(updateSpeedAndAccuracy, interval)
                }
            }
            new_game = false;
        }
        // record typed letters into input and timestamp
        if (last_input.length < e.target.value.length) {
            data.all_presses.push([e.target.value.slice(-1), time_of_button_press])
        } else {
            // record number of letters backspaced via ctrl+backspace 
            let backspace_len = last_input.length - e.target.value.length
            data.all_presses.push([backspace_len + " <BS>", time_of_button_press])
        }

        // DO NOT REFERENCE -- last_i -- BEFORE THIS POINT
        if (e.target.value.length === last_i + 1
            && last_input.length < e.target.value.length) {
            recordCharacterOccurence()
        }
        //for every index from END to BEGINNING
        for (let i = current_word.length; i >= 0; i--) {
            // if the slice from the beginning til that index matched the current word's
            //first match can break
            if (e.target.value.slice(0, i) === current_word.slice(0, i)) {
                // if more of the word has been typed correctly 
                if (i > last_i) {
                    last_i = i;
                }
                // if we BACKSPACED over CORRECTLY TYPED LETTERS
                else if (i < last_i) {
                    if (settings.keep_completed_letters) {
                        // and typing (not backspacing)
                        if (e.target.value.length > last_input.length) {
                            e.target.value = current_word.slice(0, last_i)
                        }
                    } else {
                        last_i = i;
                    }
                }
                updateUpcomingLetter()
                updateGameDisplay()
                break;
            }
        }

        // console.log("last i = ", last_i, e.target.value.charAt(last_i))

        //if we're not advancing the word
        if (e.target.value !== current_word + " ") {
            if (!settings.allow_incorrect_letters) {
                e.target.value = current_word.slice(0, last_i)
            }
            if (e.target.value.length === last_i + 1
                && last_input.length < e.target.value.length) {
                let incorrect_type = e.target.value.slice(-1)
                let err_char = (incorrect_type !== " ")
                    ? incorrect_type
                    : "˽"
                recordMistypedCharacter(character = upcoming_letter, err_char = err_char)
                errorLetterDisplay.innerText = err_char
                current_word_mistyped = true // recorded in data when word advances
            } else if (e.target.value.length <= last_i) {
                errorLetterDisplay.innerText = ""
            }
        }

        if (pauseTimes.length > resumeTimes.length) {
            resumeGame()
        }

        if (settings.show_wpm
            && settings.speed_and_accuracy_update === "ON_TYPE") {
            speedCounter.innerText = settings.wpm_label + " " + speed;
        }
        if (e.target.value === current_word + " "
            || (e.target.value === current_word && !settings.advance_on_space)
            || (settings.advance_with_errors && e.target.value.slice(-1) === " ")
        ) {
            // TODO - turn this word salad into functions
            if (settings.advance_with_errors && e.target.value.slice(-1) === " ") {
                //current_word[last_i] is already counted as a mistyped space
                let skipped_chars = current_word.slice(last_i + 1).split("")
                console.log(skipped_chars)
                if (skipped_chars !== []) {
                    for (let char of skipped_chars) {
                        recordCharacterOccurence(char)
                        recordMistypedCharacter(char, err_char = "<blank>")
                    }
                }
            }

            if (settings.show_wpm && settings.speed_and_accuracy_update === "ON_WORD") {
                speedCounter.innerText = settings.wpm_label + " " + speed;
            }
            if (upcoming_words.length === 0) {
                win();
                if (settings.auto_restart){
                    if (replay){
                        show_replay(e);
                    }else{
                        resetGame();
                    }
                    replay = !replay
                }else
                    resetGame(button = true)
            } else {
                if (settings.pause_timer_between_words) {
                    pauseGame()
                }
                advanceWord()
                updateUpcomingLetter()
                e.target.value = "";
                updateGameDisplay();
            }
        }
        last_input = e.target.value;
    })
})()