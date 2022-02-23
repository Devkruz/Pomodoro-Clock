
function App() {
     const [displaySeason, setDisplaySeason] = React.useState(25 * 60);
     const [sessionLength, setSessionLength] = React.useState(25 * 60);
     const [breakLength, setBreakLength] = React.useState(5 * 60);
     const [onBreak, setOnBreak] = React.useState(false);
     const [timerOn, setTimerOn] = React.useState(false);
     const beepRef = React.useRef(null);

    
     function playAudio() {
         beepRef.current.currentTime = 0;
         beepRef.current.play();
     };

     function stopAudio() {
         beepRef.current.pause();
         beepRef.current.currentTime = 0;
     };

    //  function playAudio() {
    //      beep.currentTime = 0;
    //      beep.play();
    //  };

     function formatTime(time) {
        let minutes = Math.floor(time / 60);
        let seconds = Math.floor(time % 60);
        return (
            (minutes < 10 ? "0" + minutes : minutes)
            + ":" +
            (seconds < 10 ? "0" + seconds : seconds)
        );
    };

    function resetTime() {
          clearInterval(localStorage.getItem("inId"));
          setSessionLength(25 * 60);
          setBreakLength(5 * 60);
          setDisplaySeason(25 * 60);
          stopAudio();
          if(timerOn) {
              setTimerOn(false)
          };
          if(onBreak) {
              setOnBreak(false)
          };
    };

    function handleTime(type, value) {
        if(!timerOn) {
            if (type == "session") {
                if(sessionLength <= 60 && value < 0) {
                    return;
                };
                if (sessionLength + value > 3600) {
                    return;
                };
                if (timerOn == false && onBreak == false) {
                    setDisplaySeason(sessionLength + value);
                   };
                   setSessionLength((pre)=> pre + value);
           };
           if (type == "break") {
                if(breakLength <= 60 && value < 0) {
                     return;
                };
                if (breakLength + value > 3600) {
                   return;
               };
               if (onBreak == true && timerOn == false) {
                  setDisplaySeason(breakLength + value);
               }

                setBreakLength((pre)=> pre + value);
           };
        };

    };

 
    function controlCountdown() {
       
       if (timerOn == false) {
           let interval = setInterval(()=> {
               setDisplaySeason(pre=> {
                   if (pre <= 0 && onBreak == false) {
                        setOnBreak(true);
                        // playAudio();
                        return breakLength;
                    };
                    if (pre <= 0 && onBreak == true) {
                       setOnBreak(false);
                    //    playAudio();
                       return sessionLength;
                   };
                    if (pre <= 1) {
                       playAudio();    
                   };
                   return pre - 1;
               })    
            },1000);
            localStorage.setItem("inId", interval);
            setTimerOn(true);
       };
       if (timerOn == true) {
           clearInterval(localStorage.getItem("inId"));
           setTimerOn(false);     
       }


    }

  

      return(
          <div className="app-wrapper
                          w-full
                          h-full
                          bg-stone-500
                          flex
                          justify-center
                          items-center
                          text-white
                          text-lg"               
          >
             <div className="app-container
                             bg-red-500 
                             mx-4
                             min-w-5/6 h-screan py-1 px-4
                             md:w-1/3
                             flex
                             flex-col
                             text-center
                             items-center
                             justify-start
                             "
             >
                    <h2 className="heading mt-6">Pomodoro Clock</h2>
                     <div className="timer-wrapper
                                     text-8xl w-full rounded-2xl 
                                     border-white border my-8 ">
                            <h4 id="timer-label">{onBreak ? "Break" : "Session"}</h4> 
                            <h1 id="time-left" className="my-0">
                            {formatTime(displaySeason)}
                            </h1>
                            {onBreak ? <span className="material-icons block text-7xl my-4">self_improvement</span> :  
                            <span className="material-icons block text-7xl my-4">rocket_launch</span>}
                        
                    </div>
                    <div className="time-control ">
                        <span id="start_stop" className="cursor-pointer">
                            {timerOn ? <span className="material-icons text-5xl" onClick={controlCountdown} title="Pause">pause</span> : <span className="material-icons text-5xl" onClick={controlCountdown} title="Play" >play_arrow</span>}
                        </span>
                        <span id="reset" className="cursor-pointer ml-2">
                          <span className="material-icons text-5xl" title="Reset" onClick={resetTime}>restart_alt</span>
                        </span>
                    </div>
                     <div className="length-wrapper w-full flex flex-row justify-center  items-center ">
                         <Length time={breakLength} type="break" formatTime={formatTime} handleTime={handleTime}/>
                         <Length time={sessionLength} type="session" formatTime={formatTime} handleTime={handleTime}/>
                     </div>
                     <audio ref={beepRef} id="beep" src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav" type="audio/wav"></audio>

               </div>
          </div>
      );
};


 
function Length({time, type, formatTime, handleTime}) {

    return(
         <div className="length-container w-50 flex flex-col mx-4 mb-6 justify-start items-center">
              <h6 id={type + "-label"}>{type[0].toUpperCase() + type.slice(1) + " " + "Length"}</h6>
                <div className="length-control flex flex-row justify-evenly items-center">
                    <span id={type + "-increment"}className="material-icons cursor-pointer text-3xl" onClick={()=>handleTime(type, +60)}>add_circle_outline</span>
                      <span id={type + "-length"} className="mx-4">{ Math.floor(time / 60)}</span>
                    <span  id={type + "-decrement"} className="material-icons cursor-pointer text-3xl" onClick={()=>handleTime(type, -60)}>remove_circle_outline</span>
                </div>
         </div>
     );
};


ReactDOM.render(<App/>, document.getElementById("root"))