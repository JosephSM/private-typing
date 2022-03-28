(function(){

    // Making the framework to print and break up the main text 
    let quote = selectRandomElem(quotes)
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
    
    function createLiveWordElement(){
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

    function createGameElements(){
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
        
        const livePreviewContainer = createLiveWordElement();
        const upcomingPreview = document.createElement("span");
        upcomingPreview.setAttribute("id", "upcomingPreview");
        const textPreview = document.createElement("p");
        textPreview.setAttribute("id", "textPreview");
        textPreview.appendChild(livePreviewContainer);
        textPreview.appendChild(upcomingPreview);
        
        const typingInput = document.createElement("input")
        typingInput.setAttribute("id", "typingInput");
        typingInput.setAttribute("type","text");
        const speedCounter = document.createElement("h1");
        speedCounter.setAttribute("id", "speedCounter");
        gameContainer.appendChild(typingText);
        gameContainer.appendChild(textPreview);
        gameContainer.appendChild(typingInput);
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
    function initialGameSetup(parent=document.body){
        upcoming_words = quote.trim().split(" ");
        current_word = upcoming_words.shift();
        finished_words = [];
        upcomingText.innerText = quote;
        parent.appendChild(gameContainer);
        parent.appendChild(scoreContainer)
        typingInput.focus();
    }
    function resetGame(){
        quote = selectRandomElem(quotes)
        current_word = "";
        upcoming_words = quote.trim().split(" ");
        finished_words = [];
        start = null
        pauseTimes = []
        resumeTimes = []
    }

    function win(){
        addScoreRow()
    }

    function pauseGame(){
        gameContainer.style = "background-color:grey;"
        pauseTimes.push(Date.now());

    }
    function resumeGame(){
        gameContainer.style = "background-color:white;"
        resumeTimes.push(Date.now());
    }

    function calculatePlayTime(){
        let totalTimePaused = 0;
        for(let i = 0; i < pauseTimes.length; i++)
            totalTimePaused += resumeTimes[i] - pauseTimes[i]
        return Date.now() - start - totalTimePaused
    }
    function checkTime(i) {
        if (i < 10) {
          i = "0" + i;
        }
        return i;
      }

      function selectRandomElem(items){
        return items[Math.floor(Math.random() * items.length)];
      }

    function addScoreRow(){
        let tr = document.createElement("tr")
        let time = document.createElement("td")
        let dt = new Date()
        let hrs = dt.getHours()%12
        let mins = checkTime(dt.getMinutes())
        let secs = checkTime(dt.getSeconds())
        time.innerText = hrs+":"+mins+":"+secs;
        let value = document.createElement("td")
        value.innerText = speed
        tr.appendChild(time)
        tr.appendChild(value)
        if (!scoreHeader.nextSibling){
            scoreBoard.appendChild(tr)
        }else{
            scoreBoard.insertBefore(tr, scoreHeader.nextSibling)
        }
    }

    initialGameSetup();
    
    
    // let last_time = Date.now()
    let start = null;
    let speed = null;
    let pauseTimes = [];
    let resumeTimes = [];
    let scores = [];
    // index of last correctly typed letter
    let last_i = 0
    typingInput.addEventListener("input", function(e){
        if(!start){
            start = Date.now()
        }
        function updateGameDisplay(){
            completedText.innerText = finished_words.join(" ");
            // can this be simplified?
            [].forEach.call(document.querySelectorAll(".liveText"), (elem) => {
                elem.querySelector(".rightText").innerText = current_word.slice(0,last_i);
                elem.querySelector(".wrongText").innerText = current_word.slice(last_i, e.target.value.length);
                elem.querySelector(".restText").innerText = current_word.slice(e.target.value.length);
            })
            upcomingText.innerText = upcoming_words.join(" ");
            upcomingPreview.innerText = upcoming_words.slice(0, 3).join(" ");
        }

        function advanceWord(){
            finished_words.push(current_word);
            current_word = upcoming_words.shift();
        }
        for(let i = 0; i <= e.target.value.length; i++){ 
            // if text typed is correct until this point
            // and more letters are correct than before 
            // or we're on to the next word 
            if ((e.target.value.slice(0, i) === current_word.slice(0, i)) 
                && (i !== last_i || last_i === 0)){
                last_i = i;
                updateGameDisplay();
            }
        }
        if(e.target.value === current_word+" "){
            if(upcoming_words.length === 0){
                win();
                resetGame();
            }
            // let time = Date.now() 
            last_i = 0
            advanceWord()
            speed = Math.round((finished_words.join(" ").length / 5)/(calculatePlayTime() /60000));
            speedCounter.innerText = speed;
            e.target.value = "";
            updateGameDisplay();
        }
    })

    typingInput.addEventListener("focusout", pauseGame)
    typingInput.addEventListener("focusin", resumeGame)

})()