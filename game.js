let quote = "The event also applies to elements with contenteditable enabled, and to any element when designMode is turned on. In the case of contenteditable and designMode, the event target is the editing host. If these properties apply to multiple elements, the editing host is the nearest ancestor element whose parent isn't editable. For elements with type=checkbox or type=radio, the input event should fire whenever a user toggles the control, per the HTML5 specification. However, historically this has not always been the case. Check compatibility, or use the change event instead for elements of these types."

// function 
let upcoming_words = quote.trim().split(" ")
let current_word = upcoming_words.shift()
let finished_words = []

let inp = document.querySelector("input")
inp.focus()
let p = document.querySelector("p.para")
let line = document.querySelector("p.short")
let h1 = document.querySelector("h1")

p.innerText = quote;

let last_time = Date.now()
let start = null;
let times = []
let last_i = 0
let last_noticed_i = 0
inp.addEventListener("input", function(e){
    for(let i = 0; i <= e.target.value.length; i++){ 
        if (e.target.value.slice(0, i) === current_word.slice(0, i)){
            if (i > last_i){
                last_i = i
            }
            let right = "<span class='right'>" + current_word.slice(0, i) + "</span>"
            let wrong = "<span class='wrong'>" + current_word.slice(i, e.target.value.length) + "</span>"
            let rest = current_word.slice(e.target.value.length)
            finished_styled = "<span class='dead'>" + finished_words.join(" ") + "</span>"
            current_styled = "<span class='alive'>" + right + wrong + rest + "</span>"
            p.innerHTML = finished_styled + " " + current_styled + " " + upcoming_words.join(" ");
            line.innerHTML = current_styled  + " <span class=fade>" + upcoming_words.slice(0, 3).join(" ")+"</span>"
        }
    }
    if(e.target.value === current_word+" "){
        console.log(upcoming_words)
        if(upcoming_words.length === 0){
            alert("you win!")
            upcoming_words = quote.trim().split(" ")
            
            current_word = upcoming_words.shift()
            current_styled = "<span class='alive'>" + current_word + "</span>"
            line.innerHTML = current_styled  + " <span class=fade>" + upcoming_words.slice(0, 3).join(" ")+"</span>"
            finished_words = []
            p.innerText = quote;
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
            p.innerHTML = finished_styled + " " + current_styled + " " + upcoming_words.join(" ");
            line.innerHTML = current_styled  + " <span class=fade>" + upcoming_words.slice(0, 3).join(" ")+"</span>"
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
        h1.innerText = Math.trunc(avg)
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

