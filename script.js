(function(){

    // Making the framework to print and break up the main text 
    let quote = "where the optional sign may by either integer"

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
        speedCounter
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
        return [
            gameContainer, 
            typingText, 
            completedText, 
            upcomingPreview,
            upcomingText,
            textPreview, 
            typingInput, 
            speedCounter
        ]
    }
    function initialGameSetup(parent=document.body){
        upcoming_words = quote.trim().split(" ");
        current_word = upcoming_words.shift();
        finished_words = [];
        upcomingText.innerText = quote;
        parent.appendChild(gameContainer);
        typingInput.focus();
    }
    function resetGame(){
        current_word = "";
        upcoming_words = quote.trim().split(" ");
        finished_words = [];
    }

    function win(){
        alert("you win!");
        start = null
    }

    initialGameSetup();
    
    
    // let last_time = Date.now()
    let start = null;
    // let times = []
    let last_i = 0
    // let last_noticed_i = 0
    typingInput.addEventListener("input", function(e){
        if(!start){
            start = Date.now()
        }
        function updateGameDisplay(){
            completedText.innerText = finished_words.join(" ");
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
            if ((e.target.value.slice(0, i) === current_word.slice(0, i)) && (i !== last_i || last_i === 0)){
                last_i = i;
                updateGameDisplay();
            }
        }
        if(e.target.value === current_word+" "){
            if(upcoming_words.length === 0){
                win();
                resetGame();
            }
            let time = Date.now() 
            last_i = 0
            advanceWord()
            speedCounter.innerText = Math.round((finished_words.join(" ").length / 5)/((time - start) /60000));
            e.target.value = "";
            updateGameDisplay();
        }
    })

})()