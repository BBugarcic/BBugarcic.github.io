$("document").ready(function() {
    /*
     *
     * global variables
     */
    
    var pomodoroValue = $("#pomodoroValue");
    var pauseValue = $("#pauseValue");
    var timer = $("#timer");
    var allPlusMinusButtons = $("#plusPomodoro, #minusPomodoro, #plusPause, #minusPause");
    
    var timerIntervalId;
    
    var circleSize;
    
    var progressStep;
    var counterOfProgressSteps = 0;
    var progressEverySecond = 1000;

    // object to store time from timer
    var currentTimer = {
        stopProgress: false
    };
    
    /**
      *  Functions: playSound and functions related  to setting pomodoro and pause interval
      *
      *
      **/
     function playSound() {
        var wav = "http://oringz.com/oringz-uploads/sounds-727-good-morning.mp3";
         var audio = new Audio(wav);
        audio.play();
    }

    // get duration of pomodoro or pause
    function getTimerMinutes() {
        if(timer.hasClass("pomodoro")) {   
            return parseInt(pomodoroValue.text());
        } else {
            return parseInt(pauseValue.text());
        }
    }
    
    // display pomodoro in center of circle
    function setPomodoro() {
        var currentPomodoro = pomodoroValue.text();
        var displayPomodoro = currentPomodoro + ":00";
        timer.text(displayPomodoro);
    }
    
    function setPomodoroAfterPause() {
        var currentPomodoro = pomodoroValue.text() - 1;
        var displayPomodoro = currentPomodoro + ":59";
        timer.text(displayPomodoro);
    }
    // display pause in center od circle
    function setPause() {
        var currentPause = parseInt(pauseValue.text()) - 1;
        var displayPause = currentPause + ":59";
        timer.text(displayPause);        
    }
    
    /**
      * Functions related with rendering animation
      *
      *
      **/
    
    // render progress animation
    function renderProgress(progressStep) {
        progressStep = Math.floor(progressStep);
        
        circleSize = getTimerMinutes() * 60;
        
        
        if(progressStep<circleSize/4){
            var angle = -90 + (progressStep/circleSize)*360;
            $(".animate-0-25-b").css("transform","rotate("+angle+"deg)");
        
        } else if(progressStep>=circleSize/4 && progressStep<circleSize/2){
            var angle = -90 + ((progressStep-circleSize/4)/circleSize)*360;
            $(".animate-0-25-b").css("transform","rotate(0deg)");
            $(".animate-25-50-b").css("transform","rotate("+angle+"deg)");
        
        } else if(progressStep>=circleSize/2 && progressStep<3*circleSize/4 ){
            var angle = -90 + ((progressStep-circleSize/2)/circleSize)*360;
            $(".animate-25-50-b, .animate-0-25-b").css("transform","rotate(0deg)");
            $(".animate-50-75-b").css("transform","rotate("+angle+"deg)");
        
        } else if(progressStep>=3*circleSize/4 && progressStep<=circleSize){
            var angle = -90 + ((progressStep-3*circleSize/4)/circleSize)*360;
            $(".animate-50-75-b, .animate-25-50-b, .animate-0-25-b").css("transform","rotate(0deg)");
            $(".animate-75-100-b").css("transform","rotate("+angle+"deg)");
        }
    }
    
    function clearProgress() {
        $(".animate-75-100-b, .animate-50-75-b, .animate-25-50-b, .animate-0-25-b").css("transform","rotate(90deg)");
    }
    
    function resetProgress() {
       $(".animate-75-100-b, .animate-50-75-b, .animate-25-50-b, .animate-0-25-b").css("transform","rotate(-90deg)");
        counterOfProgressSteps = 0;

    }
    
    function makeProgress() {
            
            if(currentTimer.stopProgress === false) {
                counterOfProgressSteps++;
                
                if(counterOfProgressSteps >= circleSize){
                    counterOfProgressSteps = 0;
                    clearProgress();
                } 
                renderProgress(counterOfProgressSteps);
            } 
    }
    


    /**
      * Functions related with counter
      *
      *
      **/
     
    function countdown() { 
        function setValues() {
            var time = timer.text().split(":");
            currentTimer.minutes = parseInt(time[0]);
            currentTimer.seconds = parseInt(time[1]);            
        }

        function updateTimer() {
            var seconds = currentTimer.seconds;
            if (seconds < 10) {
                seconds = "0" + seconds;
            }
            var minutes = currentTimer.minutes;

            if (minutes < 10) {
                minutes = "0" + minutes;
            }
            
            if(minutes === "00" && seconds === "00") {
                    playSound();
            }
            
            if(minutes === "0-1" && seconds === 59) {
                if(timer.hasClass("pomodoro")) {
                    timer.removeClass("pomodoro").addClass("pause");
                    setPause();
                } else {
                    timer.removeClass("pause").addClass("pomodoro");
                    setPomodoroAfterPause();
                }
            } else {
               timer.text(minutes + ":" + seconds); 
            }
        }
        
        // executed every second
        function tick() {
             setValues();

            if (currentTimer.seconds >= 0 || currentTimer.minutes > 0) {
                if (currentTimer.seconds === 0) {
                    currentTimer.minutes = currentTimer.minutes - 1;
                    currentTimer.seconds = 59;
                } else {
                    currentTimer.seconds = currentTimer.seconds - 1;
                }
            }
            
            if(timer.hasClass("pomodoro")) {
                $("#pause").removeClass("animated pulse");
                $("#pomodoro").addClass("animated pulse");
            } else {
                $("#pomodoro").removeClass("animated pulse");
                $("#pause").addClass("animated pulse");
            }
            updateTimer();
            makeProgress();
        }
        
        timerIntervalId = setInterval(tick, 1000);
    }

    function stop() {
        clearInterval(timerIntervalId);
    }
    
    function reset() {
        setPomodoro();
        resetProgress();
    }
    
    // handle change of starting values
    function editValue(edited, type) {
        if (edited >= 10 && edited <= 60) {
            if (type === "POMODORO") {
                pomodoroValue.text(edited);
                setPomodoro();
            } else {
                pauseValue.text(edited);
            }

        } else if (edited < 10 && edited >= 1) {
            edited = "0" + edited;
            if (type === "POMODORO") {
                pomodoroValue.text(edited);
                setPomodoro();
            } else {
                pauseValue.text(edited);
                setPomodoro();
            }
        }
    }



    /**
      * Functionality: handling clik on buttons for setting starting values of pomodoro and pause
      * handling click on start, pause and reset button
      *
      *
      **/
    setPomodoro();

    // handle click on pluses and minusies
    $("#plusPomodoro").click(function() {
        var type = $("#pomodoro").text();
        var current = parseInt(pomodoroValue.text());
        var edited = current + 1;
        editValue(edited, type);
    });

    $("#minusPomodoro").click(function() {
        var type = $("#pomodoro").text();
        var current = parseInt(pomodoroValue.text());
        var edited = current - 1;
        editValue(edited, type);
    });

    $("#plusPause").click(function() {
        var type = $("#pause").text();
        var current = parseInt(pauseValue.text());
        var edited = current + 1;
        editValue(edited, type);
    });

    $("#minusPause").click(function() {
        var type = $("#pause").text();
        var current = parseInt(pauseValue.text());
        var edited = current - 1;
        editValue(edited, type);
    });



    $("#start").click(function() {
        countdown();
        allPlusMinusButtons.attr('disabled', true);
        $("#start").attr('disabled', true);
        currentTimer.stopProgress = false;   
    });
    
    $("#stop").click(function() {
        stop();
        allPlusMinusButtons.prop("disabled", true);
        $("#start").attr("disabled", false);
        currentTimer.stopProgress = true;
    });
    
    $("#reset").click(function() {
        if(timer.hasClass("pause")) {
            timer.removeClass("pause").addClass("pomodoro");
        }
        stop();
        currentTimer.stopProgress = true;
        reset();
        allPlusMinusButtons.attr("disabled", false);
        $("#pomodoro").removeClass("animated pulse");
        $("#pause").removeClass("animated pulse");
        $("#start").attr("disabled", false);
        
    });
    

});