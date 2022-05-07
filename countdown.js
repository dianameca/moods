var started = 0;
/* pause by default */
document.querySelector('#toggleAudio').innerHTML = "PLAY";
document.querySelector('#selected-mood').innerHTML = "Choose a mood, then press" 
                                          + "<span style=\"color:red;font-size:120%;\">" 
                                          + " PLAY</span>";

var m = 1;
document.querySelector('#mode').addEventListener("click", function() {
  if(m % 3 === 0) {
    document.querySelector('#mode').innerHTML = "☀️";
  } else if (m % 3 === 1) {
    document.querySelector('#mode').innerHTML = "🌈";
  } else if (m % 3 === 2) {
    document.querySelector('#mode').innerHTML = "🌑";
  }
  ++m;
});

/* toggle stick man animations */
var counter = 0;
document.querySelector('#hide').addEventListener("click", function() {
  var bonhomme = document.querySelectorAll('#head, #torso, #leftleg, #rightleg, #rightarm, #leftarm, #rightfoot, #leftfoot');
  counter += 1;
  if(counter === 1) {
    document.querySelector('#rightarm').classList.add("click1R");
    document.querySelector('#leftarm').classList.add("click1L");
    document.querySelector('#rightfoot').classList.add("none");
    document.querySelector('#hide').innerHTML += "!";
  } else if(counter === 2) {
    document.querySelector('#rightarm').classList.replace("click1R", "none");
    document.querySelector('#leftarm').classList.replace("click1L", "none");
    //document.querySelector('#rightleg').classList.add("click2R");
    document.querySelector('#leftleg').classList.add("click1L");
    //document.querySelector('#rightfoot').classList.add("click2R");
    document.querySelector('#leftfoot').classList.add("click1L");
    document.querySelector('#rightfoot').classList.add("none");
    //document.querySelector('#head').classList.add("click2R");
    //document.querySelector('#torso').classList.add("click2R");
    document.querySelector('#hide').innerHTML += "!";
  } else if(counter > 2) {
    document.querySelector('#bonhomme').innerHTML = 
                            "<div style = \"margin-top: 40px;font-size: 15px;\">Okay 😅</div>"
                            + "<img src=\"assets/img/dove.svg\"></img>";
  }
});

var mood;
var audio;
function reset() {
  audio.pause();
  document.querySelector('#toggleAudio').innerHTML = "PLAY";
}

function playMood(mood) {
  let path = "assets/audio/" + mood;
  let title =  "<u>MOOD</u><br>";
  if (started) {
    reset();
  }
  switch(mood) {
        case 'nostalgic':
          audio = new Audio(path);
          document.querySelector('#selected-mood').innerHTML = title + "Nostalgic";
          document.querySelector('footer').innerHTML = "<!--Compact - Fata din vis • Vama Veche - Epilog-->";
          break;
        case 'party':
          audio = new Audio(path);
          document.querySelector('#selected-mood').innerHTML = title + "Party";
          document.querySelector('footer').innerHTML = "Ms. Triniti - Let's Celebrate";
          break;
        case 'pensive':
          audio = new Audio(path);
          document.querySelector('#selected-mood').innerHTML = title + "Pensive";
          document.querySelector('footer').innerHTML = "Tina Turner & Eros Ramazzotti - Cose Della Vita";
          break;
        case 'beachy':
          audio = new Audio(path);
          document.querySelector('#selected-mood').innerHTML = title + "Beachy";
          document.querySelector('footer').innerHTML = "UB40 - Red Red Wine";
          break;
        case 'motivated':
          audio = new Audio(path);
          document.querySelector('#selected-mood').innerHTML = title + "Motivated";
          document.querySelector('footer').innerHTML = "Michael Jackson - Man in the Mirror";
          break;
        case 'happy':
          audio = new Audio(path);
          document.querySelector('#selected-mood').innerHTML = title + "Happy";
          document.querySelector('footer').innerHTML = "King Harvest - Dancing in the Moonlight";
          break;
        case 'romantic':
          audio = new Audio(path);
          document.querySelector('#selected-mood').innerHTML = title + "Romantic";
          document.querySelector('footer').innerHTML = "Cyndi Lauper - Time After Time";
          break;
        case 'doowop':
          audio = new Audio(path);
          document.querySelector('#selected-mood').innerHTML = title + "Doo wop";
          document.querySelector('footer').innerHTML = "Dion - Runaround Sue";
          break;
        case 'taylor':
          audio = new Audio(path);
          document.querySelector('#selected-mood').innerHTML = title + "Taylor Swift";
          document.querySelector('footer').innerHTML = "Taylor Swift - All Too Well";
          break;
        case 'soulful':
          audio = new Audio(path);
          document.querySelector('#selected-mood').innerHTML = title + "Soulful";
          document.querySelector('footer').innerHTML = "Aretha Franklin - I Say A Little Prayer";
        break;
        case 'rockandroll':
          audio = new Audio(path);
          document.querySelector('#selected-mood').innerHTML = title + "Let's rock";
          document.querySelector('footer').innerHTML = "Elvis Presley - Jailhouse Rock";
        break;
        case 'hopeful':
          audio = new Audio(path);
          document.querySelector('#selected-mood').innerHTML = title + "Hopeful";
          document.querySelector('footer').innerHTML = "Louis Armstrong - What A Wonderful World";
        break;
        default:
          break;
  }
  ++started;
};

/* play/pause listener */
document.querySelector('#toggleAudio').addEventListener("click", function() {
  if (audio.paused) {
    audio.play();
    document.querySelector('#toggleAudio').innerHTML = "PAUSE";
  } else {
    reset();
  }
  audio.loop = true;
});

/* countdown */
var nextYear = new Date().getFullYear() + 1;
var nextNewYear = new Date(nextYear, 0, 1, 1, 0, 0);

var i = setInterval(function() {
  var now = new Date().getTime();
  var d = nextNewYear - now;
  var days = Math.floor(d/(1000*60*60*24));
  var hours = Math.floor((d%(1000*60*60*24))/(1000*60*60));
  var minutes = Math.floor((d%(1000*60*60))/(1000*60));
  var seconds = Math.floor((d%(1000*60))/1000);
  document.querySelector("#countdown").innerHTML = 
                    "<u>Countdown to " + nextYear + "</u>" 
                    + "<br><br>" 
                    + "<table class=\"center\">"
                        + "<tr>" 
                            + "<th>" + days + "</th>" 
                            + "<th>day(s)</th>"
                        + "</tr>"
                        + "<tr>"
                            + "<th>" + hours + "</th>"
                            + "<th>hour(s)</th>"
                        + "</tr>" 
                        + "<tr>"
                            + "<th>" + minutes + "</th>"
                            + "<th>minute(s)</th>"
                        + "</tr>" 
                        + "<tr>" 
                            + "<th>" + seconds + "</th>"
                            + "<th>second(s)</th>"
                        + "</tr>"
                    + "</table>";
  if (d < 0) {
    clearInterval(i);
    document.querySelector('#countdown').innerHTML = 
                      "We made it!<br>Happy New Year 🎊 💖";
    }
}, 1000);