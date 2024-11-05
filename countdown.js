document.addEventListener("DOMContentLoaded", () => {
  console.log("script loaded");

  /********************************
   *         UI ELEMENTS
   ********************************/
  const audioToggleButton = document.querySelector('#toggleAudio');
  const moodDisplay = document.querySelector('#selected-mood');
  const themeToggleButton = document.querySelector('#theme');
  const hideStickmanButton = document.querySelector('#hide');
  
  // init display
  audioToggleButton.innerHTML = "PLAY";
  moodDisplay.innerHTML = "Choose a mood, then press " + 
                            "<span style='color:red;font-size:120%;'>PLAY</span>";

  /********************************
   *        AUDIO CONTROLS
   ********************************/

  let currentMood = null;
  let currentAudio = null; 
  let isAutoPlayEnabled = false; // flag to see if playback is enabled after the first press

  function getCurrentMood() {
    return currentMood;
  }

  function setCurrentMood(mood) {
    currentMood = mood;
  }

  // stop audio, reset audio state
  function stopAudio() {
      if (currentAudio) {
          currentAudio.pause();
          audioToggleButton.innerHTML = "PLAY";
      }
  }

  function updateMoodDisplay(title) {
      moodDisplay.innerHTML = `<u>MOOD</u><br>${title}`;
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
          currentAudio.loop = true; // loop audio indefinitely
          if (currentAudio.paused) {
              currentAudio.play();
              audioToggleButton.innerHTML = "PAUSE";
              isAutoPlayEnabled = true;
          } else {
              stopAudio();
              isAutoPlayEnabled = false;
          }
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

  /******************************** 
   *      STICKMAN ANIMATION
   ********************************/

  let animationToggleCount = 0;

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

  /******************************** 
   *        THEME CONTROLS
   ********************************/

  // options: light(0), color(1), dark(2)
  let currentThemeIndex = 0; 

  function getCurrentTheme() {
    const themes = ["☀️", "🎨", "🌃"];
    return themes[currentThemeIndex];
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

  /******************************** 
   *     THEME FAST SWITCHING
   ********************************/

  let isFastSwitching = false;
  let switchInterval;
  let themeSwitchCount = 0;
  const maxSwitches = 5;
  
  function startFastThemeSwitching() {
      if (isFastSwitching) 
        return; // false check
      isFastSwitching = true;
  
      switchInterval = setInterval(() => {
        if (themeSwitchCount < maxSwitches) {
            setCurrentTheme(currentThemeIndex + 1);
            themeSwitchCount++;
            
            console.log(`switch count: ${themeSwitchCount}`);
        } else {
            stopFastThemeSwitching();
        }
      }, 500); // tbd because headaches....
  }
  
  function stopFastThemeSwitching() {
      clearInterval(switchInterval);
      isFastSwitching = false;
  }

  /******************************** 
   *        COUNTDOWN TIMER
   * ******************************/
  
  const nextYear = new Date().getFullYear() + 1;
  let nextNewYear = new Date(nextYear, 0, 1);
  let celebrationEndTime; // track when to revert to the countdown
  let newYearCelebration = false;

  const daysElement = document.querySelector('#days');
  const hoursElement = document.querySelector('#hours');
  const minutesElement = document.querySelector('#minutes');
  const secondsElement = document.querySelector('#seconds');
  const yearElement = document.querySelector('#year');
  const footerElement = document.querySelector('footer');

  const newYearMessage = "We made it! 🎊<br>Happy New Year! 🎉";

  const msInSecond = 1000;
  const msInMinute = msInSecond * 60;
  const msInHour = msInMinute * 60;
  const msInDay = msInHour * 24;

  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  footerElement.textContent = `TIME ZONE: ${userTimeZone}`;

  function updateCountdownDisplay() {
    const currentTime = new Date();
    const timeRemaining = nextNewYear - currentTime;

    if (timeRemaining <= 0) {
        // set flag and end time to 24 hours later
        newYearCelebration = true;
        celebrationEndTime = new Date(currentTime.getTime() + msInDay);
        // display New Year message, skip countdown update
        document.querySelector('#countdownDisplay').innerHTML = newYearMessage;

        startFastThemeSwitching();
        return;
    }
    if (newYearCelebration && currentTime >= celebrationEndTime) {
        // check if 24 hours passed
        if (currentTime >= celebrationEndTime) {
            newYearCelebration = false;
            stopFastThemeSwitching();
            nextNewYear = new Date(nextYear + 1, 0, 1); // prep for the next New Year
            updateCountdownDisplay(); // restart countdown
            return;
        }
        document.querySelector('#countdownDisplay').innerHTML = newYearMessage;
        return;
    }

    const daysLeft = Math.floor(timeRemaining / msInDay);
    const hoursLeft = Math.floor((timeRemaining % msInDay) / msInHour);
    const minutesLeft = Math.floor((timeRemaining % msInHour) / msInMinute);
    const secondsLeft = Math.floor((timeRemaining % msInMinute) / msInSecond);

    daysElement.textContent = daysLeft;
    hoursElement.textContent = hoursLeft;
    minutesElement.textContent = minutesLeft;
    secondsElement.textContent = secondsLeft;
    yearElement.textContent = nextYear;
  }

  function update() {
    updateCountdownDisplay();
    requestAnimationFrame(update);
  }

  update();
});