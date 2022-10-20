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

function selectRandomElem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function processQuote(quote) {
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
