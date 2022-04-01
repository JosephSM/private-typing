(function the_game() {

    function removePunctuation(str) {
        return str.replace(/[.,'\/#!?$%\^&\*;:{}=\-_`~()]/g, "")
            .replace(/\s{2,}/g, " ")
    }

    function syllabify(words) {
        const syllableRegex = /[^aeiouy]*[aeiouy]+(?:[^aeiouy]*$|[^aeiouy](?=[^aeiouy]))?/gi;
        return words.match(syllableRegex);
    }

    function processQuote(source) {
        let quote = selectRandomElem(source);

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
            console.log(quote.split(" "));
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
        const elapsedTimeCounter = document.createElement("h1");
        elapsedTimeCounter.setAttribute("id", "elapsedTimeCounter");
        elapsedTimeCounter.classList.add("counter")
        const countdownTimerCounter = document.createElement("h1");
        countdownTimerCounter.setAttribute("id", "countdownTimerCounter");
        countdownTimerCounter.classList.add("counter")

        gameContainer.appendChild(typingText);
        gameContainer.appendChild(textPreview);
        gameContainer.appendChild(typingInput);
        if (settings.show_countdown)
            gameHeaderContainer.appendChild(countdownTimerCounter);
        if (settings.show_elapsed || settings.show_total_elapsed)
            gameHeaderContainer.appendChild(elapsedTimeCounter);
        if (settings.show_wpm)
            gameHeaderContainer.appendChild(speedCounter);


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
        console.log("pause called" + start)
        console.log(pauseTimes)
        console.log(resumeTimes)
        if (start && pauseTimes.length === resumeTimes.length) {
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

    function calculate_speed(completed_letters = last_i + 1) {
        //TODO - make this clearer
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
        finished_words.push(current_word);
        current_word = upcoming_words.shift();
    }
    function resetGame(button = false) {
        if (button) {
            createDialog("play-again", "Play Again?", "Play")
        }
        if (speed_update_interval)
            clearInterval(speed_update_interval)
        if (game_clock)
            clearInterval(game_clock)
        typingInput.value = ""
        typingInput.focus();
        quote = processQuote(quotes)
        upcoming_words = quote.trim().split(" ");
        current_word = "";
        finished_words = [];
        advanceWord()
        new_game = true
        start = settings.auto_restart_clock ? Date.now() : null;
        speed_update_interval = null;
        seconds_since_start = null;
        game_clock = null;
        current_time = null;
        speed = null;
        pauseTimes = []
        resumeTimes = []
        last_i = 0;
        // resumeGame()
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
        scoreContainer,
        scoreBoard
    ] = createGameElements();

    function updateGameDisplay(input = typingInput.value) {
        if (settings.show_word_history) {
            completedText.innerText = finished_words.join(" ");
        }
        // can this be simplified?
        [].forEach.call(document.querySelectorAll(".liveText"), (elem) => {
            elem.querySelector(".rightText").innerText = current_word.slice(0, last_i);
            elem.querySelector(".wrongText").innerText = current_word.slice(last_i, input.length);
            elem.querySelector(".restText").innerText = current_word.slice(input.length);
        })
        upcomingText.innerText = upcoming_words.join(" ");
        upcomingPreview.innerText = upcoming_words.slice(0, settings.preview_length).join(" ");
    }

    document.body.appendChild(gameContainer);
    document.body.appendChild(scoreContainer);
    // const collections = Object.keys()
    let quotes = quote_collection["Harry Potter"]
    if (settings.quotes) {
        quotes = quote_collection[settings.quote_collection]
    }
    //TODO - combine with resetGame
    let quote,
        upcoming_words,
        current_word,
        finished_words,
        new_game,
        start,
        speed_update_interval,
        seconds_since_start,
        game_clock,
        speed,
        pauseTimes,
        resumeTimes,
        last_i;
    
    resetGame()
    updateGameDisplay()
    if (settings.pause_on_mouseout) {
        typingInput.addEventListener("focusout", pauseGame)
    }

    typingInput.addEventListener("input", function (e) {
        if (new_game) {
            if (!start) {
                start = Date.now()
            }
            game_clock = setInterval(function () {
                current_time = Date.now()
                seconds_since_start = Math.floor((current_time - start) / 1000);
                speed = calculate_speed()
                if (settings.show_countdown) {
                    let countdown_time = settings.countdown_time - seconds_since_start;
                    if (settings.pause_countdown_on_pause) {
                        countdown_time = settings.countdown_time - Math.floor(calculatePlayTime("seconds"))
                    }
                    countdownTimerCounter.innerText = "countdown: " + countdown_time
                    if (countdown_time <= 0) {
                        resetGame()
                        updateGameDisplay()
                    }
                }
                if (settings.show_total_elapsed) {
                    elapsedTimeCounter.innerText = settings.elapsed_label + " " + seconds_since_start
                }
                if (settings.show_elapsed) {
                    elapsedTimeCounter.innerText = settings.elapsed_label + " " + Math.floor(calculatePlayTime("seconds"))
                }
                // console.log(pauseTimes)
            }, 100)

            if (settings.show_wpm) {
                if (settings.wpm_update !== "ON_WORD"
                    && settings.wpm_update !== "ON_TYPE") {
                    let interval = settings.wpm_update_interval
                    if (settings.wpm_update === "ON_CLOCK") {
                        interval = 1000;
                    } else if (settings.wpm_update === "CONSTANT") {
                        interval = 100;
                    }
                    speed_update_interval = setInterval(function () {
                        speedCounter.innerText = settings.wpm_label + " " + speed;
                    }, interval)
                }
            }
            new_game = false;
        }

        if (pauseTimes.length > resumeTimes.length) {
            resumeGame()
        }


        for (let i = 0; i <= e.target.value.length; i++) {
            // if text typed is correct until this point
            // and more letters are correct than before 
            // or we're on to the next word 

            if (!settings.allow_incorrect_letters) {
                if (e.target.value.slice(0, i) !== current_word.slice(0, i)
                    && e.target.value !== current_word + " "
                ) {
                    e.target.value = current_word.slice(0, last_i)
                }
            }


            if ((e.target.value.slice(0, i) === current_word.slice(0, i))
                && (i !== last_i || last_i === 0)) {
                last_i = i;
                updateGameDisplay();
            }
        }
        if (settings.show_wpm && settings.wpm_update === "ON_TYPE") {
            speed = calculate_speed(completed_letters = last_i + 1)
            speedCounter.innerText = settings.wpm_label + " " + speed;
        }
        if (e.target.value === current_word + " "
            || (!settings.advance_on_space && (last_i === current_word.length))
            || settings.advance_with_errors && e.target.value.slice(-1) === " "
        ) {
            if (settings.show_wpm && settings.wpm_update === "ON_WORD") {
                speedCounter.innerText = settings.wpm_label + " " + speed;
            }
            if (settings.pause_timer_between_words) {
                pauseGame()
            }
            if (upcoming_words.length === 0) {
                win();
                if (settings.auto_restart)
                    resetGame();
                else
                    resetGame(button = true)
            } else {
                last_i = 0
                advanceWord()
            }
            e.target.value = "";
            updateGameDisplay();
        }
    })
})()