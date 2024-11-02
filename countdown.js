document.addEventListener("DOMContentLoaded", () => {
  console.log("script loaded");

  // state variables
  let currentMood = null;
  // set up theme 
  // options: light(0), color(1), dark(2)
  let currentThemeIndex = 0; 
  let animationToggleCount = 0;
  let currentAudio = null; // holds current audio
  let isAutoPlayEnabled = false; // flag to see if playback is enabled after the first press

  // html element references
  const audioToggleButton = document.querySelector('#toggleAudio');
  const moodDisplay = document.querySelector('#selected-mood');
  const themeToggleButton = document.querySelector('#theme');
  const hideStickmanButton = document.querySelector('#hide');
  const countdownDisplayElement = document.querySelector("#countdown");

  // initial ui
  audioToggleButton.innerHTML = "PLAY"; // set initial button text to PLAY
  moodDisplay.innerHTML = "Choose a mood, then press <span style='color:red;font-size:120%;'>PLAY</span>";

  /* GETTERS */

  function getCurrentMood() {
    return currentMood;
  }

  function getCurrentTheme() {
    const themes = ["☀️", "🌈", "🌑"];
    return themes[currentThemeIndex];
  }

  /* SETTERS */

  function setCurrentMood(mood) {
    currentMood = mood;
  }

  function setCurrentTheme(index) {
    const themes = ["☀️", "🌈", "🌑"];
    currentThemeIndex = index % themes.length;
    themeToggleButton.innerHTML = themes[currentThemeIndex];
    console.log(`updated to ${themes[currentThemeIndex]}`);
  }
  
  themeToggleButton.addEventListener("click", () => {
      console.log("theme toggle button clicked");
      setCurrentTheme(currentThemeIndex + 1);
  });

  // toggle stickman animations based on button presses
  function toggleStickmanAnimation() {
      console.log("hide stickman button clicked");
      // select all the parts
      const stickmanParts = document.querySelectorAll('#head, #torso, #leftleg, #rightleg, #rightarm, #leftarm, #rightfoot, #leftfoot');
      animationToggleCount++; // increment with each button press

      // 1st toggle - add animations to arms and hide feet
      if (animationToggleCount === 1) {
          document.querySelector('#rightarm').classList.add("click1R"); // animate right arm
          document.querySelector('#leftarm').classList.add("click1L"); // animate left arm
          document.querySelector('#rightfoot').classList.add("none");
          hideStickmanButton.innerHTML += "!";

      // 2nd toggle - change animation and add to legs
      } else if (animationToggleCount === 2) {
          document.querySelector('#rightarm').classList.replace("click1R", "none"); // right arm still
          document.querySelector('#leftarm').classList.replace("click1L", "none"); // left arm still
          document.querySelector('#leftleg').classList.add("click1L"); // animate left leg
          document.querySelector('#leftfoot').classList.add("click1L"); // animate left foot
          document.querySelector('#rightfoot').classList.add("none");
          hideStickmanButton.innerHTML += "!";

      // 2nd+ toggle: display dove
      } else if (animationToggleCount > 2) {
          document.querySelector('#stickman').innerHTML = 
              "<div style='margin-top: 40px;font-size: 15px;'>Okay 😅</div>" +
              "<img src='assets/img/dove.svg'>";
      }
  }
  // attach event listener to hide button for toggling animations
  hideStickmanButton.addEventListener("click", toggleStickmanAnimation);

  // stop audio, reset audio state
  function stopAudio() {
      if (currentAudio) {
          currentAudio.pause();
          audioToggleButton.innerHTML = "PLAY";
      }
  }

  function updateMoodDisplay(title, footer) {
      moodDisplay.innerHTML = `<u>MOOD</u><br>${title}`; 
      document.querySelector('footer').innerHTML = footer;
  }

  // play the audio for the selected mood
  function playMoodAudio(mood) {
      stopAudio();
      const moodConfigurations = {
          nostalgic: { title: "Nostalgic", footer: "<!--Compact - Fata din vis &nbsp • &nbsp Vama Veche - Epilog-->" },
          party: { title: "Party", footer: "Ms. Triniti - Let's Celebrate" },
          pensive: { title: "Pensive", footer: "Neil Young - Heart of Gold" },
          beachy: { title: "Beachy", footer: "Bob Marley and the Wailers - No Woman, No Cry" },
          motivated: { title: "Motivated", footer: "Michael Jackson - Man in the Mirror" },
          happy: { title: "Happy", footer: "King Harvest - Dancing in the Moonlight" },
          romantic: { title: "Romantic", footer: "Cyndi Lauper - Time After Time" },
          doowop: { title: "Doo wop", footer: "Gene Chandler - Duke Of Earl &nbsp • &nbsp Dion - Runaround Sue" },
          taylor: { title: "Taylor Swift", footer: "Taylor Swift - All Too Well" },
          soulful: { title: "Soulful", footer: "Aretha Franklin - I Say A Little Prayer &nbsp • &nbsp Ben E. King - Stand by Me" },
          rockandroll: { title: "Rock 'n roll", footer: "Fats Domino - Blueberry Hill &nbsp • &nbsp Little Richard - Good Golly, Miss Molly" },
          hopeful: { title: "Hopeful", footer: "Louis Armstrong - What A Wonderful World" }
      };

      const moodDetails = moodConfigurations[mood]; // get mood details based on selection
      if (moodDetails) {
          currentAudio = new Audio(`assets/audio/${mood}`);
          updateMoodDisplay(moodDetails.title, moodDetails.footer);
          if (isAutoPlayEnabled) {
              currentAudio.play(); // play the audio automatically if enabled
              audioToggleButton.innerHTML = "PAUSE"; // change button text to PAUSE when playing
          }
      }
  }

  // play/pause listener for the audio toggle button
  audioToggleButton.addEventListener("click", () => {
      console.log("audio toggle button clicked");
      if (!getCurrentMood()) {
        console.log("no mood selected");
        moodDisplay.innerHTML = "<span style='font-size:180%;'>⚠️</span>" + 
                                " Choose a mood before pressing" + 
                                " <span style='color:red;font-size:120%;'>PLAY</span>";
        return;
      }
      if (currentAudio) {
          if (currentAudio.paused) { // if audio is currently paused, play it
              currentAudio.play();
              audioToggleButton.innerHTML = "PAUSE";
              isAutoPlayEnabled = true; // enable auto play after the first press
          } else { // if audio is currently playing, stop
              stopAudio();
              isAutoPlayEnabled = false;
          }
          currentAudio.loop = true; // loop audio indefinitely
      }
  });

  // set up mood button click listeners to play corresponding audio
  document.querySelectorAll("#moods button").forEach(button => {
      button.addEventListener("click", () => {
          console.log(`${button.id} mood button clicked`);
          setCurrentMood(button.id);
          playMoodAudio(button.id);
      });
  });

  // update countdown display until the new year
  function updateCountdownDisplay() {
      const nextYear = new Date().getFullYear() + 1; // get the next year
      const nextNewYear = new Date(nextYear, 0, 1, 1, 0, 0); // set date for the next new year
      const currentTime = new Date().getTime(); // get current time in milliseconds
      const timeRemaining = nextNewYear - currentTime; // calculate time remaining until the new year

      // calculate days, hours, minutes, and seconds remaining
      const daysLeft = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
      const hoursLeft = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutesLeft = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
      const secondsLeft = Math.floor((timeRemaining % (1000 * 60)) / 1000);

    // format countdown dispaly
    countdownDisplayElement.innerHTML = `
        <div style="text-align: center; text-decoration: underline;">Countdown to ${nextYear}</div>
        <table style="margin: auto; text-align: left;">
        <br>
            <tr>
                <td class="number">${daysLeft}</td>
                <td class="label">Days</td>
            </tr>
            <tr>
                <td class="number">${hoursLeft}</td>
                <td class="label">Hours</td>
            </tr>
            <tr>
                <td class="number">${minutesLeft}</td>
                <td class="label">Minutes</td>
            </tr>
            <tr>
                <td class="number">${secondsLeft}</td>
                <td class="label">Seconds</td>
            </tr>
        </table>
    `;
  }
  setInterval(updateCountdownDisplay, 1000); // update display every second
});