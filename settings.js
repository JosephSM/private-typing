const speed_update_options = ["ON_TYPE", "ON_WORD", "TIME_ELAPSE", "ON_CLOCK", "CONSTANT"]

let settings = {
    word_length: 5, // done
    speed_update: "CONSTANT", // done
    speed_update_interval: 50, 
    // random, disappearing text, moving text, 
    // flashing text
    // hack the formatter
    // insert your own snippets
    // insert language grammar to generate 
    // go easy on hands (easier letter combos = less pain)
    // edit mode 
    // diff mode
    // RANDOM IDEA : search engine that accounts for your history 
    game_type: "NORMAL", 
    has_countdown: false, //done
    show_elapsed: false,
    show_total_elapsed: false,
    show_paused: false,
    show_pause_icon: false,
    pause_timer_between_words: false,
    auto_contrast_colors: false , 
    allow_errors: false, 
    countdown_time: 30, // done
    game_width: "NORMAL",
    show_lines:"",
    show_line_numbers: "",
    indent_paragraph: "",
    max_lines: "",
    text_source: "quote.js",
    show_preview: true, // done
    show_punctuation: true, // done
    show_capitalization: true, // done
    alternate_quoting:false, // redistribute "" '' and () {} []
    split_syllables: false, //
    show_speed: true, // done
    speed_label: "wpm:", // done 
    auto_restart: true, // done
    auto_restart_clock: false, // done
    replay_on_condition: false, // didn't reach a threshold speed, 
    auto_capitalize: false, //done
    auto_punctuate: false, 
    auto_quote: false,
    auto_scroll: true,
    auto_remove_untypables: true,
    text_area_height: "Normal",
    text_area_color: "Normal",
    text_area_top_margin: "Normal",
    pause_on_mouseout: true, // done
    only_happy_quotes: false,
    font: "NORMAL",
    font_size: "NORMAL",
    font_color: "NORMAL",
    type_font_size:"",
    type_font_color:"",
    line_spacing: "NORMAL",
    word_spacing: "NORMAL",
    preview_length: 3,
    preview_color: "Normal",
    vim_mode: false,
}