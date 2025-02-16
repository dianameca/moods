document.addEventListener("DOMContentLoaded", () => {
  console.log("script loaded");
  localStorage.clear();

  /********************************
   *         UI ELEMENTS
   ********************************/
  const audioToggleButton = document.querySelector('#toggleAudio');
  const moodDisplay = document.querySelector('#selected-mood');
  const themeToggleButton = document.querySelector('#theme');
  
  // init display
  audioToggleButton.innerHTML = "PLAY";
  moodDisplay.innerHTML = "Choose a mood, then press PLAY";

  /********************************
   *        AUDIO CONTROLS
   ********************************/
  let currentMood = null;
  let currentAudio = null;
  // check if playback is enabled after the first press
  let isAutoPlayEnabled = false;

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
          resetStickman();  // stop the stickman when audio is paused
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

      const moodDetails = moodConfigurations[mood];
      if (moodDetails) {
          currentAudio = new Audio(`assets/audio/${mood}`);
          updateMoodDisplay(moodDetails.title);

        // explicitly restart audio
        currentAudio.addEventListener("ended", () => {
          if (isAutoPlayEnabled) {
              currentAudio.play();
          }
        });

        if (isAutoPlayEnabled) {
          currentAudio.play(); // play the audio automatically if enabled
          audioToggleButton.innerHTML = "PAUSE";
          applyMoodDance(mood); // only trigger the dance when the audio is playing
        }
      }
  }

  // play/pause listener for the audio toggle button
  audioToggleButton.addEventListener("click", () => {
      console.log("audio toggle button clicked");
      if (!getCurrentMood()) {
        console.log("no mood selected");
        moodDisplay.innerHTML = "<span style='font-size:180%;'>‼️</span>" + 
                                " Choose a mood before pressing" + 
                                " PLAY";
        return;
      }
      if (currentAudio) {
          currentAudio.loop = false; // force false, handle manually
          if (currentAudio.paused) {
              currentAudio.play();
              audioToggleButton.innerHTML = "PAUSE";
              isAutoPlayEnabled = true;
              // edge case : stickman is hidden
              applyMoodDance(getCurrentMood()); // trigger dance when audio starts playing
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

  const hideStickmanButton = document.querySelector('#hide');
  const hideStickmanWrapper = document.querySelector('#stickman');
  const stickmanParts = document.querySelectorAll('#head, #torso, #leftleg, #rightleg, #rightarm, #leftarm, #rightfoot, #leftfoot');
  const stickmanDanceParts = document.querySelectorAll('#leftleg, #rightleg, #rightarm, #leftarm');

  function initialize() {
    hideStickmanButton.innerHTML = "Make it stop";
    document.querySelector('#rightfoot').classList.add("foot-bopping");
    document.querySelector('#head').classList.add("head-bopping");
  }

  function louder() {
    hideStickmanButton.innerHTML += "!"
  }

  function resetStickman() {
    stickmanParts.forEach(part => {
      part.classList.remove("fast-tempo", "medium-tempo", "slow-tempo", "foot-bopping");

      part.classList.forEach(cls => {
          if (cls.startsWith("dance-")) {
              part.classList.remove(cls);
          }
      });
    });
  }

  function applyMoodDance(mood) {
    document.querySelector('#rightleg').classList.add("dance-right-leg");
    document.querySelector('#leftleg').classList.add("dance-left-leg");

    if (mood === "party" || mood === "doowop" || mood === "rockandroll") {
      resetStickman();
      addTempoToDanceParts("fast");
    }
  }

  function addTempoToDanceParts(tempo) {
    stickmanDanceParts.forEach(part => {
        // add tempo class: slow, medium, fast
        part.classList.add(`${tempo}-tempo`);
    });
  }

  function animateStickman(step) {
    resetStickman();
    switch(step) {
        case 1:
            addTempoToDanceParts("medium");
            louder();
            break;
        case 2:
            addTempoToDanceParts("fast");
            document.querySelector('#stickman').classList.add("area-spin");
            louder();
            break;
        case 3:
            clearDisplayFinalMessage();
            break;
    }
  }

  function clearDisplayFinalMessage() {
    stickman.className = '';
    hideStickmanButton.style.display = "none";
    hideStickmanWrapper.style.display = "none";
    document.querySelector('#dove').innerHTML = 
        "<div class='dialog'>Okay 😅</div>" +
        "<img src='assets/img/dove.svg'>";
  }

  /******************************** 
   *           WILDCARD 
   ********************************/
  let wildcardAudio = new Audio('assets/audio/wildcard');
  let wildcardAudioPlaying = false;

  hideStickmanButton.addEventListener("click", () => {
    animationToggleCount++;
    animateStickman(animationToggleCount);

    if (animationToggleCount === 2) {
        if (!wildcardAudioPlaying) {
            audioToggleButton.disabled = true;
            document.querySelectorAll("#moods button").forEach(button => {
              button.disabled = true;
            });
            wildcardAudio.play();
            wildcardAudio.loop = true;
            wildcardAudioPlaying = true;
            stopAudio();
            applyMoodDance("party");
        }
    } else if (animationToggleCount === 3) {
        if (wildcardAudioPlaying) {
            audioToggleButton.disabled = false;
            document.querySelectorAll("#moods button").forEach(button => {
              button.disabled = false;
            });
            wildcardAudio.pause();
            wildcardAudio.currentTime = 0;
            wildcardAudioPlaying = false;
            currentAudio.play();
            audioToggleButton.innerHTML = "PAUSE";
        }
    }
  });

  initialize();

  /******************************** 
   *        THEME CONTROLS
   ********************************/

  // options: light(0), color(1), dark(2)
  let currentThemeIndex = 2; 

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
  const maxSwitches = 6;
  
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
      }, 400);
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
  const timezoneElement = document.querySelector('#timezone');

  const newYearMessage = "We made it! 🎊<br>Happy New Year! 🎉";

  const msInSecond = 1000;
  const msInMinute = msInSecond * 60;
  const msInHour = msInMinute * 60;
  const msInDay = msInHour * 24;

  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  timezoneElement.innerHTML = `<u>Time Zone</u><br> ${userTimeZone}`;

  function updateCountdownDisplay() {
    const currentTime = new Date();
    const timeRemaining = nextNewYear - currentTime;

    if (timeRemaining <= 0) {
        // set flag and end time to 24 hours later
        newYearCelebration = true;
        celebrationEndTime = new Date(currentTime.getTime() + msInMinute);
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
