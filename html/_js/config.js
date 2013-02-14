var BOO_SHOW_DEBUG = false;

var BOO_FAKE_MOBILE = false;

// Whether or not to show an alert with unhandled events. Useful at build time unless a given event is rarely listened too.
var BOO_ALERT_UNHANDLED_EVENTS = true;

var STR_CABAL_SEPERATOR = "&&";
var STR_MEMBER_SEPERATOR = "##";
var STR_PAIR_SEPERATOR = "||";
var STR_VALUE_SEPERATOR = "==";

// Used to determine the difficulty as
var FLO_DIFFICULTY_CONSTANT = 0.2;

// Mitigates / increases death and injury based on number of dead cabals and action iteration
var FLO_KILL_COUNT_VIOLENCE_RATIO_PER_STEP = 0.025;
var FLO_ACTION_COUNT_VIOLENCE_RATIO_PER_STEP = 0.025;

// Adds a base min value to the above.
var FLO_MIN_VIOLENCE_RATIO = 0.1;

var INT_REQUIRED_GOAL_PIPS = 5;