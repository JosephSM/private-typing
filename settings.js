const wpm_update_options = ["ON_TYPE", "ON_WORD", "TIME_ELAPSE", "ON_CLOCK", "CONSTANT"]

let settings = {
    quote_collection:"Benjamin Franklin",
    word_length: 5, // done
    wpm_update: "ON_CLOCK", // done - change "onclock"
    wpm_update_interval: 50, // done
    advance_on_space: true, // done
    show_upcoming_letter: true, // done
    show_countdown: false, //done
    pause_countdown_on_pause: true, // done
    keep_completed_letters: false,
    show_word_history: true, // done
    show_elapsed: true, // done
    show_wpm: true, //done
    elapsed_label: "", // done
    show_total_elapsed: false, // done
    pause_timer_between_words: false, // done 
    advance_with_errors: false, // done //aka allow_errors
    allow_incorrect_letters: true, // done
    countdown_time: 30, // done
    show_preview: true, // done
    show_punctuation: false, // done
    show_capitalization: true, // done
    no_spaces: false, // done
    wpm_label: "", // done 
    auto_restart: true, // done
    auto_restart_clock: false, // done
    auto_capitalize: false, //done
    auto_punctuate: false, //done
    pause_on_mouseout: true, // done
    preview_length: 3, //done
    alternate_quoting: true, // quasi-done
    split_syllables_naive: false, // quasi-done
    // random, disappearing text, moving text, 
    // flashing text
    // hack the formatter
    // insert your own snippets
    // insert language grammar to generate 
    // go easy on hands (easier letter combos = less pain)
    // edit mode 
    // diff mode
    // RANDOM IDEA : search engine that accounts for your history 
    // show_paused: false, // ?
    // show_pause_icon: false,
    // auto_contrast_colors: false , 
    // auto_quote: false,
    game_type: "NORMAL",
    replay_on_condition: false, // didn't reach a threshold wpm, 
    win_on_space:true,
    win_on_enter:true,
    show_error_history: false,
    game_width: "NORMAL",
    max_width: "", //
    show_ledger_lines: "",
    show_line_numbers: "",
    indent_paragraph: "",
    max_lines: "",
    text_source: "quote.js",
    auto_scroll: true,
    auto_remove_untypables: true,
    text_area_height: "Normal",
    text_area_color: "Normal",
    text_area_top_margin: "Normal",
    only_happy_quotes: false,
    font: "NORMAL",
    font_size: "NORMAL",
    font_color: "NORMAL",
    type_font_size: "",
    type_font_color: "",
    line_spacing: "NORMAL",
    word_spacing: "NORMAL",
    preview_color: "Normal",
    vim_mode: false,
    min_wpm: false,
    min_accuracy: false,
    disable_backspace: false,
}