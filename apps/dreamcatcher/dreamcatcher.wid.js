//dream.widget.js  widdream.wid.js
//WIDGETS = {}; // <-- for development only
//WIDGETS["dreamcheck"].dream_cue()

(() => {

    var on; 
    var period_in_minutes; 
    var checks_per_period;  
    var reality_check_time = 0;
    var current_time=0;
    var milliseconds_in_period;
    var milliseconds_in_minute = 60000;
    var minute_check_times = new Array();
    var check_handle = 0;
    var wait_time_minutes;
    var wait_time_milliseconds;
  

    var num_buzzes=5;
    var buzz_delay = 600;
    //time - [optional] Time in ms (default 200)
    //strength - [optional] Power of vibration from 0 to 1 (Default 1)
    var buzz_time = 200;
    var buzz_strength = 0.8; 

    var num_buzz_cycles = 1;
    var buzz_cycle_delay = 2000; 

     var width = 40; // width of the widget 
  
    function reload(){
      // read settings file, or if it doesn't exist use {}
      settings = require('Storage').readJSON("dreamcheck.json", true) || {};
      // Use the setting, or a default value if undefined
      on = settings.onoroff!==undefined ? settings.onoroff : false;
      period_in_minutes = settings.period_in_minutes!==undefined ? settings.period_in_minutes : 60; 
      checks_per_period = settings.checks_per_period!==undefined ? settings.checks_per_period : 2;
      milliseconds_in_period = milliseconds_in_minute * period_in_minutes;
      //draw();
    } 

  
    function buzz(){
      Bangle.buzz(buzz_time,buzz_strength);
    }

    function dream_cue(){
          for (let j = 0; j < num_buzz_cycles; j++) {
            for (let i = 0; i < num_buzzes; i++) {
              setTimeout(buzz, i * buzz_delay + (j * buzz_cycle_delay) + 200);        
            
          }
        }
      }
  
   function dream_cue_check(){
        reload();
        if (on){
          dream_cue();        
        }
    } 

    
    function init_new_period(){
     if (check_handle != 0){
       // clearTimeout(check_handle);
        check_handle = 0;
      }
      minute_check_times = new Array();
      current_time = 0;
      reality_check_time = 0;
      //returns a random number between 0 (inclusive) and 60 (exclusive)
        while (minute_check_times.length < checks_per_period) {
          let x = Math.floor((Math.random() * period_in_minutes) + 1);
          if (minute_check_times.includes(x) == false){
            minute_check_times.push(x);
          }
        }
      //sort from last check to first check, popping from lowest to highest
      minute_check_times.sort(function(a, b){return b-a;});  
    }
    

    function reality_check(){
        if(reality_check_time > 0){
          current_time = reality_check_time;
          Bangle.setLCDPower(1);
          dream_cue_check();
          }
          if(minute_check_times.length != 0){ 
            reality_check_time = minute_check_times.pop();
            wait_time_minutes = reality_check_time - current_time;
            wait_time_milliseconds = wait_time_minutes * milliseconds_in_minute;
            check_handle = setTimeout(reality_check,wait_time_milliseconds);
          }
          else{
            reality_check_time = 0;
            wait_time_minutes = period_in_minutes - current_time;
            wait_time_milliseconds = wait_time_minutes * milliseconds_in_minute;
            init_new_period(); 
            check_handle = setTimeout(reality_check,wait_time_milliseconds);
          }
        Bangle.drawWidgets();
      }

  
      reload();
      if ((on==true) && (check_handle==0)){    
        init_new_period();
        reality_check();
      } 
  

  
    // add your widget
  
      function turn_off(){
        if (check_handle != 0){
        clearTimeout(check_handle);
        }  
        minute_check_times = new Array();
        check_handle = 0;
        reload();
        on = false;
        Bangle.drawWidgets();
       }

      function turn_on(){
        reload();
        on = true;
        init_new_period();
        reality_check();

       } 
  
 
     function draw() {
        settings = require('Storage').readJSON("dreamcheck.json", true) || {};
        // Use the setting, or a default value if undefined
        on = settings.onoroff!==undefined ? settings.onoroff : "On";
        var text = " ";
        g.reset(); // reset the graphics context to defaults (color/font/etc)
        g.setFontAlign(0,0); // center fonts    
        g.setFont("6x8",2.5);
        g.setColor(.1,.1, 1);
        g.setColor(.5,.5, .5); //gray
        g.setColor(1,0.87,0.68); //gray
        //var text = "Dreaming?:" + reality_check_time;
        if (on==true){   

          //g.drawString(text, this.x+width/2+15, this.y+12);
          g.drawImage(atob("PUQBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/wAAAAAAAP//AAAAAAA/AD8AAAAAB8AAPgAAAABwP/A4AAAABw//8OAAAADh9zvhwAAADjwww8cAAABjgwMHGAAABj4YGHxgAABj/MDP8YAABzh8A+HOAAAzgOAcBzAAAxwDgcA4wAAZsB4eA2YAAY2A+fAbGAAMxgb9gYzAAGYwE8gMZgAGYMDMwMGYADMf/mf/jMABn//////mAAz4cf+OHzAAZwHH+OA5gAMwB//8AMwAGYAf/+AGYADMAf//gDMABnAcf44DmAAz8cf+OPzAAZv/////ZgAMw/+Z/8MwADMcDewOMwABmMDPMDGYAAzMBs2AzMAAM2A+fAbMAAGfAeHgPmAABnAOBwDmAAAxgeAeBjAAAMY/gfxjAAAHP8wM/zgAABxwYGDjgAAAccOHDjgAAAHHjDHjgAAADw/z/DwAAAB+H/+H4AAAAzwHgPMAAAAY+AAfGAAAAMD/P8DAAAAGAf/4BgAAADAAMAAwAAABgAPAAYAAAAwAPwAMAAAAcAGYAOAAAAfAD8APgAAANgA8AGwAAAMwAMADMAAAGIAPABGAAADMAHgAzAAAA2ADwAbAAAAbAB4ANgAAAPgA8AHwAAADgAeABwAAAAgAGAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"), this.x+66, this.y-40);
        }
       
      }     
  
  
    WIDGETS["dreamcheck"]={
      area:"bl", // tl (top left), tr (top right), bl (bottom left), br (bottom right)
      width: width, // how wide is the widget? You can change this and call Bangle.drawWidgets() to re-layout
      draw:draw, // called to draw the widget
      turn_off:turn_off, //called to turn off widget
	    turn_on:turn_on,
      dream_cue:dream_cue,
      buzz:buzz
    }; 
  

  
  })()  
  
  //Bangle.drawWidgets(); // <-- for development only
