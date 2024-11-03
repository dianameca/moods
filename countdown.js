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
  moodDisplay.innerHTML = "Choose a mood, then press " + 
                        "<span style='color:red;font-size:120%;'>PLAY</span>";

  /* GETTERS */

  function getCurrentMood() {
    return currentMood;
  }

  function getCurrentTheme() {
    const themes = ["☀️", "🎨", "🌃"];
    return themes[currentThemeIndex];
  }

  /* SETTERS */

  function setCurrentMood(mood) {
    currentMood = mood;
  }

  function setCurrentTheme(index) {
    const themes = ["light", "color", "dark"];
    currentThemeIndex = index % themes.length;

    const themeName = themes[currentThemeIndex];
    document.documentElement.setAttribute('data-theme', themeName);

    themeToggleButton.innerHTML = getCurrentTheme();
    console.log(`updated to ${themeName}`);
  }

  setCurrentTheme(currentThemeIndex);
  
  themeToggleButton.addEventListener("click", () => {
      console.log("theme toggle button clicked");
      setCurrentTheme(currentThemeIndex + 1);
  });

  // toggle stickman animations based on button presses
  function toggleStickmanAnimation() {
      console.log("hide stickman button clicked");
      // select all the parts
      const stickmanParts = document.querySelectorAll
                        ('#head, #torso, #leftleg, #rightleg, #rightarm, #leftarm, #rightfoot, #leftfoot');
      animationToggleCount++; // increment with each button press

      if (animationToggleCount === 1) {
          document.querySelector('#rightarm').classList.add("click1R");
          document.querySelector('#leftarm').classList.add("click1L");
          document.querySelector('#rightfoot').classList.add("none");
          hideStickmanButton.innerHTML += "!";
          console.log(animationToggleCount)

      } else if (animationToggleCount === 2) {
          document.querySelector('#rightarm').classList.add("none");
          document.querySelector('#leftarm').classList.add("none");
          document.querySelector('#leftleg').classList.add("click1L");
          document.querySelector('#leftfoot').classList.add("click1L");
          hideStickmanButton.innerHTML += "!";
          console.log(animationToggleCount)

      } else if (animationToggleCount === 3) {
          document.querySelector('#leftleg').classList.add("click1R");
          document.querySelector('#rightleg').classList.add("click1L");
          document.querySelector('#leftfoot').classList.replace("click1L", "none");
          hideStickmanButton.innerHTML += "!";
          console.log(animationToggleCount)
  
      } else if (animationToggleCount > 3) {
          document.querySelector('#stickman').innerHTML = 
              "<div style='margin-top: 40px;font-size: 20px;'>Okay 😅</div>" +
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

  function updateMoodDisplay(title) {
      moodDisplay.innerHTML = `<u>MOOD</u><br>${title}`; 
      // document.querySelector('footer').innerHTML = footer;
  }

  // play the audio for the selected mood
  function playMoodAudio(mood) {
      stopAudio();
      const moodConfigurations = {
          chill: { title: "Chill" },
          party: { title: "Party" },
          pensive: { title: "Pensive" },
          beachy: { title: "Beach" },
          motivated: { title: "Motivated" },
          happy: { title: "Happy" },
          romantic: { title: "Romantic" },
          doowop: { title: "Doo wop" },
          taylor: { title: "Taylor Swift" },
          soulful: { title: "Soulful" },
          rockandroll: { title: "Rock 'n roll" },
          hopeful: { title: "Hopeful" }
      };

      const moodDetails = moodConfigurations[mood]; // get mood details based on selection
      if (moodDetails) {
          currentAudio = new Audio(`assets/audio/${mood}`);
          updateMoodDisplay(moodDetails.title);
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
          if (currentAudio.paused) {
              currentAudio.play();
              audioToggleButton.innerHTML = "PAUSE";
              isAutoPlayEnabled = true;
          } else {
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
    const nextYear = new Date().getFullYear() + 1;
    const nextNewYear = new Date(nextYear, 0, 1);
    const currentTime = new Date();
    const timeRemaining = nextNewYear.getTime() - currentTime.getTime();

    const daysLeft = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hoursLeft = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutesLeft = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    const secondsLeft = Math.floor((timeRemaining % (1000 * 60)) / 1000);

    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    document.querySelector('footer').innerHTML = `TIME ZONE: ${userTimeZone}`;

    countdownDisplayElement.innerHTML = `
        <div style="text-align: center; font-size: 110%">Countdown to ${nextYear}</div>
        <table style="margin: auto; text-align: left;">
        <br>
            <tr>
                <td class="number">${daysLeft}</td>
                <td class="label">days</td>
            </tr>
            <tr>
                <td class="number">${hoursLeft}</td>
                <td class="label">hours</td>
            </tr>
            <tr>
                <td class="number">${minutesLeft}</td>
                <td class="label">minutes</td>
            </tr>
            <tr>
                <td class="number">${secondsLeft}</td>
                <td class="label">seconds</td>
            </tr>
        </table>
    `;
  }
  setInterval(updateCountdownDisplay, 1000);
});