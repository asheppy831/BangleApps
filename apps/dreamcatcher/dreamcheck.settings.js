(function(back) {
  var FILE = "dreamcheck.json";
  // Load settings
  var settings = Object.assign({
    onoroff: "Off",
    period_in_minutes: 60,
    checks_per_period: 2,
  }, require('Storage').readJSON(FILE, true) || {});

  function writeSettings() {
    require('Storage').writeJSON(FILE, settings);
    //if (WIDGETS["dreamcheck"]) WIDGETS["dreamcheck"].reload()
  }

  function turn_on(){
    if(WIDGETS["dreamcheck"]) WIDGETS["dreamcheck"].turn_on();    
  }

  function turn_off(){
    if(WIDGETS["dreamcheck"]) WIDGETS["dreamcheck"].turn_off();    
  }  
  
  function dream_cue(){
    if(WIDGETS["dreamcheck"]) WIDGETS["dreamcheck"].dream_cue();    
  }  


  // Show the menu
  E.showMenu({
    "" : { "title" : "Dream Check" },
    "< Back" : () => back(),
    'On or off?': {
      value: !!settings.onoroff,  // !! converts undefined to false
      format: v => v?"On":"Off",
      onchange: v => {
        settings.onoroff = v;
        writeSettings();
        if(settings.onoroff){
          turn_on();
          dream_cue();
        }
        else{
          turn_off();
        }
      }
    },
    'Period in min': {
      value: 0|settings.period_in_minutes,  // 0| converts undefined to 0
      min: 0, max: 1440,
      onchange: v => {
        settings.period_in_minutes = v;
        writeSettings();
        turn_off();
        turn_on();
      }
    },
    'Num per period?': {
      value: 0|settings.checks_per_period,  // 0| converts undefined to 0
      min: 0, max: 1440,
      onchange: v => {
        settings.checks_per_period = v;
        writeSettings();
        turn_off();
        turn_on();
      }
    },
  });
})