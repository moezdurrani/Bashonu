document.addEventListener("DOMContentLoaded", function() {
  // var dropdownTrigger = document.querySelector(".dropdown-trigger");
  // var dropdownContent = document.querySelector(".dropdown-content");
  // dropdownTrigger.addEventListener("click", function() {
  //   dropdownContent.classList.toggle("active");
  // });

  var dropdownTrigger = document.querySelector(".dropdown-trigger");
  var dropdownContent = document.querySelector(".dropdown-content");

  // Function to toggle dropdown visibility
  function toggleDropdown() {
    if (dropdownContent.style.display === 'block') {
        dropdownContent.style.display = 'none';
    } else {
        dropdownContent.style.display = 'block';
    }
  }

    // Event listener for the dropdown trigger
    dropdownTrigger.addEventListener("click", function(event) {
      toggleDropdown();
      event.stopPropagation(); // Prevent click from bubbling to document
  });

  // Event listener to close dropdown if clicking outside of it
  document.addEventListener("click", function(event) {
      var isClickInside = dropdownContent.contains(event.target) || dropdownTrigger.contains(event.target);

      if (!isClickInside) {
          dropdownContent.style.display = 'none';
      }
  });


    // dropdownTrigger.addEventListener("click", function() {
    //     if (dropdownContent.style.display === 'block') {
    //         dropdownityle.display = 'none';
    //     } else {
    //         dropdownContent.style.display = 'block';
    //     }
    // });

  

  const searchInput = document.getElementById('searchInput');
  const songDetails = document.querySelector('.main');
  const lyricsContainer = document.querySelector('.lyricsContainer');
  const lyricsDisplay = document.getElementById('lyrics');
  const closeLyricsButton = document.getElementById("close-lyrics");
  const englishBtn = document.getElementById("englishBtn");
  const urduBtn = document.getElementById("urduBtn");
  const audio = document.getElementById('myAudio');
  const audioSource = document.getElementById('audioSource');
  const progressBar = document.getElementById('progressBar');
  const playPauseBtn = document.getElementById('playPauseBtn');
  const playPauseIcon = document.getElementById('playPauseIcon');
  const progressContainer = document.getElementById('progressContainer');

  let currentLanguage = 'English'; // Default language
  let currentLyrics = [];

  englishBtn.addEventListener('click', () => setLanguage('English'));
  urduBtn.addEventListener('click', () => setLanguage('Urdu'));

  playPauseBtn.addEventListener('click', togglePlayPause);
  progressContainer.addEventListener('click', seekAudio);

  function setLanguage(language) {
    currentLanguage = language;
    if (currentLyrics && currentLyrics.length > 0) {
      displayLyrics(currentLyrics); // Redisplay the lyrics in the selected language
    }
  }

  function displaySongs() {
    songDetails.innerHTML = '';
    const searchTerm = searchInput.value.toLowerCase();

    // Sort the music by song name before filtering and displaying
    allMusic.sort((a, b) => a.name.localeCompare(b.name));

    allMusic.forEach((song) => {
      if (song.name.toLowerCase().includes(searchTerm) ||
          song.writer.toLowerCase().includes(searchTerm) ||
          song.singer.toLowerCase().includes(searchTerm)) {
        createSongItem(song);
      }
    });
  }

  function createSongItem(song) {
    const songItem = document.createElement('div');
    songItem.className = 'song';
    songItem.style.background = 'rgba(255, 255, 255, 0.15)';
    // songItem.style.border = '1px solid rgba(0, 0, 0, 0.5)';
    songItem.style.borderRadius = '0px';
    songItem.style.padding = '10px';
    // songItem.style.backdropFilter = 'blur(20px)';
    // songItem.style.boxShadow = '-6px 6px 6px rgba(10, 10, 10, 0.55)';
    songItem.style.marginBottom = '10px';

    const songName = document.createElement('p');
    songName.textContent = song.name;
    songName.className = 'name';
    songName.style.fontWeight = 'bold';
    songName.style.color = 'rgb(0,0,0)';
    songName.innerText = song.name;
    songName.style.fontFamily = 'M PLUS Rounded 1c, optima, sans-serif, Arial';
    songName.style.fontSize = '22px';
    songName.style.paddingBottom = '3px';

    const details = document.createElement('p');
    details.textContent = `Writer: ${song.writer} | Singer: ${song.singer}`;
    details.className = 'details';
    details.style.color = '#888';
    details.style.marginRight = '0.5em';
    details.style.fontFamily = 'Arial, sans-serif';
    details.style.fontSize = '16px';
    details.style.paddingBottom = '7px';

    songItem.appendChild(songName);
    songItem.appendChild(details);
    songItem.addEventListener('click', () => {
      fetchAndDisplayLyrics(song.lyricsFile, song.src);
    });
    songDetails.appendChild(songItem);
  }

  function fetchAndDisplayLyrics(lyricsFile, audioSrc) {
    fetch(`lyrics/${lyricsFile}`)
      .then(response => response.text())
      .then(lyricsText => {
        currentLyrics = lyricsText.split('\n');
        displayLyrics(currentLyrics);
        audioSource.src = audioSrc;
        audio.load();
        resetProgressBar();
        audio.pause();
        playPauseIcon.className = 'fas fa-play'; // Ensure the play icon is displayed
      })
      .catch(error => console.error('Error fetching the lyrics:', error));
  }

  function displayLyrics(lines) {
    lyricsDisplay.innerHTML = '';  // Clear the previous lyrics
    const nameLyrics = document.querySelector('.nameLyrics');
    nameLyrics.textContent = lines[0]; // Display the song name

    const urduIndex = lines.findIndex(line => line.trim() === "URDUONWARDS");
    let lyricsStartIndex = 4; 
    let lyricsEndIndex = urduIndex - 1; 
    if (currentLanguage === 'Urdu') {
      lyricsStartIndex = urduIndex + 1; 
      lyricsEndIndex = lines.length; 
    }

    // Display only the selected language lyrics
    for (let i = lyricsStartIndex; i < lyricsEndIndex; i++) {
      const lyricLine = document.createElement('p');
      if (lines[i].trim() === '') {
        // Check if the line is empty and ensure it renders as an empty space
        lyricLine.innerHTML = '&nbsp;'; // Use non-breaking space to ensure empty lines are visible
        lyricLine.style.height = '2em'; // Maintain line height for empty lines
      } else {
        lyricLine.textContent = lines[i];
      }

      // Apply font styles based on language
      applyFontStyles(lyricLine, i < urduIndex);
      lyricsDisplay.appendChild(lyricLine);
    }

    lyricsContainer.classList.add("active");
  }

  function applyFontStyles(lyricLine, isEnglish) {
    if (isEnglish) {
      lyricLine.style.fontFamily = "'Comfortaa', cursive, sans-serif";
      lyricLine.style.fontSize = '15px';
      lyricLine.style.lineHeight = '2.3';
      lyricLine.style.color = 'black';
    } else {
      lyricLine.style.fontFamily = "'Noto Nastaliq Urdu', serif, Arial, sans-serif";
      lyricLine.style.fontSize = '15px';
      lyricLine.style.fontWeight = '400';
      lyricLine.style.lineHeight = '2.3';
      lyricLine.style.color = 'black';
    }
  }

  closeLyricsButton.addEventListener("click", function() {
    lyricsContainer.classList.remove("active");
  });

  searchInput.addEventListener('input', function() {
    displaySongs();
  });

  displaySongs(); // Initially display all songs

  function togglePlayPause() {
    if (audio.paused || audio.ended) {
      audio.play();
      playPauseIcon.className = 'fas fa-pause';
    } else {
      audio.pause();
      playPauseIcon.className = 'fas fa-play';
    }
  }

  audio.ontimeupdate = function() {
    var percentage = (audio.currentTime / audio.duration) * 100;
    progressBar.style.width = percentage + '%';
  };

  function seekAudio(event) {
    var rect = event.currentTarget.getBoundingClientRect();
    var x = event.clientX - rect.left; // correct calculation for the click position
    var percent = x / rect.width;
    audio.currentTime = percent * audio.duration;
    progressBar.style.width = percent * 100 + '%';
    console.log('Click position: %d, Percent: %f', x, percent); // Debugging information
  }

  function resetProgressBar() {
    progressBar.style.width = '0%';
  }
});
