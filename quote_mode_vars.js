let quotes, // list of quotes chosen by game
  source_quote, // quote before processing
  quote, // text to practice typing on
  history, //
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
  capsOption,
  puncsOption,
  // spaceOption,
  syllablesOption,
  keysOption,
  settingsOption,
] = createGameElements();

const [scoreContainer, scoreBoard] = createScoreBoardElements();
