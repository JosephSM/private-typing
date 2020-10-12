(function(){
    let quote = "The event also applies to elements with contenteditable enabled, and to any element when designMode is turned on. In the case of contenteditable and designMode, the event target is the editing host. If these properties apply to multiple elements, the editing host is the nearest ancestor element whose parent isn't editable. For elements with type=checkbox or type=radio, the input event should fire whenever a user toggles the control, per the HTML5 specification. However, historically this has not always been the case. Check compatibility, or use the change event instead for elements of these types."
    let upcoming_words;
    let current_word;
    let finished_words;
    const [
        gameContainer, 
        typingText, 
        completedText, 
        liveText,
        rightText, 
        wrongText, 
        restText,
        upcomingText,
        textPreview, 
        typingInput
    ] = createGameElements();
    
    function createGameElements(){
        const gameContainer = document.createElement("div");
        gameContainer.setAttribute("id", "game");
        const typingText = document.createElement("p");
        typingText.setAttribute("id", "typingText");
        
        const completedText = document.createElement("span");
        completedText.setAttribute("id", "completedText");
        
        const liveText = document.createElement("span");
        liveText.setAttribute("id", "liveText")    

        const rightText = document.createElement("span");
        rightText.setAttribute("id", "rightText")    
        
        const wrongText = document.createElement("span");
        wrongText.setAttribute("id", "wrongText")    

        const restText = document.createElement("span");
        restText.setAttribute("id", "restText") 

        liveText.appendChild(rightText);
        liveText.appendChild(wrongText);
        liveText.appendChild(restText);
        
        const upcomingText = document.createElement("span");
        upcomingText.setAttribute("id", "upcomingText");
        
        typingText.appendChild(completedText)
        typingText.appendChild(liveText)
        typingText.appendChild(upcomingText)
        
        
        const textPreview = document.createElement("p");
        textPreview.setAttribute("id", "textPreview");
        
        const typingInput = document.createElement("input", {
            "id": "typingInput",
            "type":"text"
        });
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
            liveText,
            rightText, 
            wrongText,
            restText, 
            upcomingText,
            textPreview, 
            typingInput
        ]
    }

    function initialGameSetup(parent=document.body){
        upcoming_words = quote.trim().split(" ")
        current_word = upcoming_words.shift()
        finished_words = []
        upcomingText.innerText = quote;
        parent.appendChild(gameContainer);
        typingInput.focus()
    }
    initialGameSetup();
    
    let last_time = Date.now()
    let start = null;
    let times = []
    let last_i = 0
    let last_noticed_i = 0
    typingInput.addEventListener("input", function(e){
        function updateGameDisplay(last_i){
            completedText.innerText = finished_words.join(" ")
            rightText.innerText = current_word.slice(0,last_i)
            wrongText.innerText = current_word.slice(last_i, e.target.value.length)
            restText.innerText = current_word.slice(e.target.value.length)
            upcomingText.innerText = upcoming_words.join(" ")
            // textPreview.innerText = upcoming_words.slice(0, 3).join(" ")
            console.log("updateGameDisplay called")
        }
        for(let i = 0; i <= e.target.value.length; i++){ 
            if (e.target.value.slice(0, i) === current_word.slice(0, i) && i > last_i){
                last_i = i
                updateGameDisplay()
            }
        }
        if(e.target.value === current_word+" "){
            console.log(upcoming_words)
            if(upcoming_words.length === 0){
                alert("you win!")
                upcoming_words = quote.trim().split(" ")
                
                current_word = upcoming_words.shift()
                current_styled = "<span class='alive'>" + current_word + "</span>"
                // textPreview.innerHTML = current_styled  + " <span class=fade>" + upcoming_words.slice(0, 3).join(" ")+"</span>"
                finished_words = []
                typingText.innerText = quote;
                last_time = Date.now()
                times = []
                last_i = 0
                last_noticed_i = 0
                e.target.value = ""
            }
            else{
                last_i = 0
                finished_words.push(current_word)
                current_word = upcoming_words.shift() 
                finished_styled = "<span class=dead>" + finished_words.join(" ") + "</span>"
                current_styled = "<span class='alive'>" + current_word + "</span>"
                typingText.innerHTML = finished_styled + " " + current_styled + " " + upcoming_words.join(" ");
                // textPreview.innerHTML = current_styled  + " <span class=fade>" + upcoming_words.slice(0, 3).join(" ")+"</span>"
                e.target.value = "";
            }
        }
        if (last_noticed_i !== last_i){
            let current_time = Date.now()
            let wpm_6letter = Math.round(60/((current_time - last_time)/1000*12))
            times.push(wpm_6letter)
            let total = 0;
            for(let i = 0; i < times.length; i++) {
                total += times[i];
            }
            let avg = total / times.length;
            speedCounter.innerText = Math.trunc(avg)
            last_time = current_time
            last_noticed_i = last_i
        }

        // Calculate WPM.
        if (start === null) {
            start = Date.now()
        }
        const wpm = finished_words.length / ((Date.now() - start) / (60 * 1000));
        document.querySelector('#wpm').innerText = Math.round(wpm);

    })

})()