// const wpm_update_options = [
//   "ON_TYPE",
//   "ON_WORD",
//   "TIME_ELAPSE",
//   "ON_CLOCK",
//   "CONSTANT",
// ];

let settings = {
  // qoute
  quote_collection: "Harry Potter", //done

  //formatting
  no_spaces: false, // done
  auto_capitalize: false, //done
  auto_punctuate: false, //done
  alternate_quoting: true, // quasi-done
  split_syllables_naive: false, // quasi-done
  show_punctuation: true, // done
  show_capitalization: true, // done

  // speed
  word_length: 5, // done
  speed_and_accuracy_update: "CONSTANT",
  speed_and_accuracy_update_interval: 50,
  // advancing
  advance_on_space: true, // done
  advance_with_errors: false, // done //aka allow_errors
  // error policy
  allow_incorrect_letters: true, // done
  show_error_letter: false, // done
  // pausing
  pause_on_mouseout: true, // done
  resume_on_focus: false, // NOT DONE
  pause_countdown_on_pause: false, // NOT DONE
  pause_timer_between_words: false, // done
  // game constraints and thresholds
  keep_completed_letters: true,
  end_after_countdown: true, // done
  end_below_accuracy: false, // done
  minimum_accuracy: 80, //done
  // view
  show_countdown: false, //NOT DONE
  show_upcoming_letter: true, // done
  show_word_history: true, // done
  show_elapsed: true, // done
  show_wpm: true, //done
  show_preview: true, // done
  preview_length: 0, //done
  show_accuracy: true, // done
  show_total_elapsed: false, // done
  elapsed_label: "", // done
  countdown_time: 30, // done
  wpm_label: "", // done
  // auto
  replay: true, // done
  auto_restart_clock: false, // done

  // random, disappearing text, moving text,
  // flashing text
  // insert your own snippets
  // insert language grammar to generate
  // RANDOM IDEA : search engine that accounts for your history
  // show_pause_icon: false, // show state
  // auto_contrast_colors: false ,
  // auto_quote: false,
  // slow_mode: true, // buggy

  // speed_ceiling: 40, // speed ceiling
  // slow_only_on_error_words: true,
  // game_type: "NORMAL",
  // replay_on_condition: false, // didn't reach a threshold wpm, accuracy etc.
  // win_on_space: true,
  // win_on_enter: true,
  // show_error_history: false,
  // game_width: "NORMAL",
  // max_width: "", //
  // show_ledger_lines: "",
  // show_line_numbers: "",
  // indent_paragraph: "",
  // max_lines: "",
  // text_source: "quote.js",
  // auto_scroll: true,
  // auto_remove_untypables: true,
  // text_area_height: "Normal",
  // text_area_color: "Normal",
  // text_area_top_margin: "Normal",
  // only_happy_quotes: false,
  // font: "NORMAL",
  // font_size: "NORMAL",
  // font_color: "NORMAL",
  // type_font_size: "",
  // type_font_color: "",
  // line_spacing: "NORMAL",
  // word_spacing: "NORMAL",
  // preview_color: "Normal",
  // vim_mode: false,
  // insert_mode: true,
  // min_wpm: false,
  // min_accuracy: false,
  // disable_backspace: false,
  // show_only_next_letter: false,
  // enable_paste: false,
  // hack the formatter
  // Ergo mode - go easy on hands (easier letter combos = less pain)
  // edit mode
  // diff mode
};

/*
#finished features
# DONE 1. if user clicks off the input pause the game and clock
# DONE 2. track characters that user types incorrectly and which letters they're typing instead
# DONE 4. visual indication of letters that the user types incorrectly
# DONE 6. track speed for individual characters
# DONE 7. track accuracy
# DONE 8. run time tracking on a time interval rather than simply when the user types (maybe have this set as an option that can change later)


# features to implement #
3. add a mode to allow user to slowly practice the letters that they got wrong
5. add voice mode.
9. spaced repitition mode.
13. implement scroll
14. make statistic page in sidebar
15. Wrong text is inconsistent because it only does the word
	and does not do the whitespace after or next words
16. write tests

speed graph 
error graph


set your own penalties and point system
countdowns
maintain speed threshold
maintain minimum accuracy
replay game until acheiving certain success

word text-formatting mode //bold italics underlined
text-editing mode 
learn mode
vim mode
vim mode should detect your slowest motions and recommend keymappings
slow mode // can only type slowly 
sudden death mode - lose on error
vocabulary mode - learn the entire dictionary 
reading comprehension mode
maintain speed mode
debug mode
QA mode 
- type to reveal answer
anki mode - study while typing
distraction free on
enable newlines and textarea
filter only math
filter only arrow keys - Dance Dance Revolution
filter only punctuation

reading levels - practice words at reading level
view replay // done
view game history
smooth caret
show caret in text
key bindings
consistency
get histogram 
look up popular themes
show floating point numbers on hover
show errors on word history
color scale previous characters based on speed
color scale characters based on accuracy 
alternate keyboard layouts
alerts
language generator
profile - total number of races
typing with autocomplete
fuzzy search settings
celebrate contributors
add easter eggs
keystrokes per minute
total keystrokes
avenues to monetization - ads, donations, subscriptions, merch, email list
how to contact - mail, github, discord
sporcle-esq
play ghost on repeat
enable hints
dont look down - eye tracking
show virtual keyboard
https://color.adobe.com/create/color-wheel
selection test 
printable award
share link to game 
take off the handlebars (customize dangerously)	
show syntax highlighting
enable locked features for reaching milestones 
game type - word count - not sure what this is
leaderboards

Issues:
1. last_i must be the first thing set as it represents the state of the last correctly typed letter
*/
