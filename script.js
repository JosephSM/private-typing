(function the_game() {
    quotes = quotes["Harry Potter"]

    function processQuote(source) {
        let quote = selectRandomElem(source)
        //TODO - replace unwanted characters with " "

        if (!settings.show_punctuation) {
            quote = quote.replace(/[.,'\/#!?$%\^&\*;:{}=\-_`~()]/g, "")
                .replace(/\s{2,}/g, " ");
        }
        if (!settings.show_capitalization) {
            quote = quote.toLowerCase()
        }
        if (settings.auto_capitalize) {
            quote = quote.replace(
                /\w\S*/g,
                function (txt) {
                    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                }
            );
        }
        return quote
    }

    let quote = processQuote(quotes)
    let upcoming_words;
    let current_word;
    let finished_words;


    const [
        gameContainer,
        typingText,
        completedText,
        upcomingPreview,
        upcomingText,
        textPreview,
        typingInput,
        speedCounter,
        scoreContainer,
        scoreBoard
    ] = createGameElements();

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
        gameContainer.appendChild(typingText);
        gameContainer.appendChild(textPreview);
        gameContainer.appendChild(typingInput);
        if (settings.show_speed)
            gameContainer.appendChild(speedCounter);


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
            typingText,
            completedText,
            upcomingPreview,
            upcomingText,
            textPreview,
            typingInput,
            speedCounter,
            scoreContainer,
            scoreBoard
        ]
    }
    function initialGameSetup(parent = document.body) {
        upcoming_words = quote.trim().split(" ");
        current_word = upcoming_words.shift();
        finished_words = [];
        parent.appendChild(gameContainer);
        parent.appendChild(scoreContainer);
        [].forEach.call(document.querySelectorAll(".liveText"), (elem) => {
            elem.querySelector(".rightText").innerText = ""
            elem.querySelector(".wrongText").innerText = ""
            elem.querySelector(".restText").innerText = current_word
        })
        upcomingText.innerText = upcoming_words.join(" ");
        upcomingPreview.innerText = upcoming_words.slice(0, settings.preview_length).join(" ");
        typingInput.focus();
    }
    function resetGame(button = false) {
        if (button) {
            createDialog("play-again", "Play Again?", "Play")
        }
        quote = processQuote(quotes)
        clearInterval(speed_update_interval)
        if (settings.has_countdown) {
            clearInterval(countdownInterval)
            clearTimeout(countdownTimeout)
        }
        new_game = true
        current_word = "";
        upcoming_words = quote.trim().split(" ");
        finished_words = [];
        start = settings.auto_restart_clock ? Date.now() : null
        pauseTimes = []
        resumeTimes = []
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

    function pauseGame() {
        // createDialog("unpause", "Resume the game?", "Resume")
        gameContainer.style = "background-color:grey;"
        pauseTimes.push(Date.now());

    }

    function resumeGame() {
        gameContainer.style = "background-color:white;"
        resumeTimes.push(Date.now());
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
    //TODO - combine with resetGame
    initialGameSetup();

    // new_game set to true before each new game
    let new_game = true;
    let start = null;
    if (settings.speed_update === "ON_CLOCK") {
        let speed_update_interval,
            current_time,
            seconds_since_start;
    }

    if (settings.has_countdown) {
        let countdownInterval, countdownTimeout
    }
    let game_clock = null;
    let speed = null;
    let pauseTimes = [];
    let resumeTimes = [];
    let scores = [];
    // index of last correctly typed letter
    let last_i = 0;

    function calculatePlayTime() {
        let totalTimePaused = 0;
        for (let i = 0; i < pauseTimes.length; i++)
            totalTimePaused += resumeTimes[i] - pauseTimes[i]
        return Date.now() - start - totalTimePaused
    }

    function calculate_speed(completed_letters = 0) {
        //TODO - make this clearer
        return Math.round(
            ((finished_words.join(" ").length + completed_letters) / settings.word_length)
            / (calculatePlayTime() / 60000));
    }
    typingInput.addEventListener("input", function (e) {
        if (!start) {
            pauseTimes = []
            resumeTimes = []
            start = Date.now()
        }
        if (new_game) {
            if (settings.speed_update !== "ON_WORD"
                && settings.speed_update !== "ON_TYPE") {
                let interval = settings.speed_update_interval
                if (settings.speed_update === "ON_CLOCK") {
                    interval = 1000;
                } else if (settings.speed_update === "CONSTANT") {
                    interval = 100;
                }
                speed_update_interval = setInterval(function () {
                    current_time = Date.now()
                    seconds_since_start = Math.floor((current_time - start) / 1000);
                    speed = calculate_speed(completed_letters = last_i + 1)
                    speedCounter.innerText = settings.speed_label + " " + speed;
                }, interval)
            }

            if (settings.has_countdown) {
                countdownInterval = setInterval(function () {
                    console.log(settings.countdown_time - seconds_since_start)
                }, 1000)
                countdownTimeout = setTimeout(function () {
                    console.log("You timed out")
                    clearInterval(countdownInterval)
                }, settings.countdown_time * 1000)
            }

            new_game = false;
        }

        function updateGameDisplay() {
            completedText.innerText = finished_words.join(" ");
            // can this be simplified?
            [].forEach.call(document.querySelectorAll(".liveText"), (elem) => {
                elem.querySelector(".rightText").innerText = current_word.slice(0, last_i);
                elem.querySelector(".wrongText").innerText = current_word.slice(last_i, e.target.value.length);
                elem.querySelector(".restText").innerText = current_word.slice(e.target.value.length);
            })
            upcomingText.innerText = upcoming_words.join(" ");
            upcomingPreview.innerText = upcoming_words.slice(0, settings.preview_length).join(" ");
        }

        function advanceWord() {
            finished_words.push(current_word);
            current_word = upcoming_words.shift();
        }
        for (let i = 0; i <= e.target.value.length; i++) {
            // if text typed is correct until this point
            // and more letters are correct than before 
            // or we're on to the next word 
            if ((e.target.value.slice(0, i) === current_word.slice(0, i))
                && (i !== last_i || last_i === 0)) {
                last_i = i;
                updateGameDisplay();
            }
        }
        if (settings.speed_update === "ON_TYPE") {
            speed = calculate_speed(completed_letters = last_i + 1)
            speedCounter.innerText = settings.speed_label + " " + speed;
        }
        if (e.target.value === current_word + " ") {
            if (upcoming_words.length === 0) {
                win();
                if (settings.auto_restart)
                    resetGame();
                else
                    resetGame(button = true)
            }
            last_i = 0
            advanceWord()
            if (settings.speed_update === "ON_WORD") {
                speed = calculate_speed()
                speedCounter.innerText = settings.speed_label + " " + speed;
            }
            e.target.value = "";
            updateGameDisplay();
        }
    })
    if (settings.pause_on_mouseout) {
        typingInput.addEventListener("focusout", pauseGame)
        typingInput.addEventListener("focusin", resumeGame)
    }

})()