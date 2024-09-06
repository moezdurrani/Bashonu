document.addEventListener("DOMContentLoaded", function() {

  var dropdownTrigger = document.querySelector(".dropdown-trigger");
  var dropdownContent = document.querySelector(".dropdown-content");

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
  let firstSongLoaded = false; // Flag to check if the first song audio has been loaded

  // Function to display songs in the list
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

  // Add event listeners for language selection
  englishBtn.addEventListener('click', () => setLanguage('English'));
  urduBtn.addEventListener('click', () => setLanguage('Urdu'));

  // Add event listeners for play/pause and progress bar
  playPauseBtn.addEventListener('click', togglePlayPause);
  progressContainer.addEventListener('click', seekAudio);

  // Function to set the selected language for lyrics
  function setLanguage(language) {
    currentLanguage = language;
    if (currentLyrics && currentLyrics.length > 0) {
      displayLyrics(currentLyrics); // Redisplay the lyrics in the selected language
    }
  }

  // Function to create a song item in the list
  function createSongItem(song) {
    const songItem = document.createElement('div');
    songItem.className = 'song';
    songItem.style.background = 'rgba(255, 255, 255, 0.15)';
    songItem.style.borderRadius = '0px';
    songItem.style.padding = '10px';
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

  // Function to fetch and display lyrics, and start playing the song immediately
  function fetchAndDisplayLyrics(lyricsFile, audioSrc) {
    fetch(`lyrics/${lyricsFile}`)
      .then(response => response.text())
      .then(lyricsText => {
        currentLyrics = lyricsText.split('\n');
        displayLyrics(currentLyrics);
        audioSource.src = audioSrc;
        audio.load();
        resetProgressBar();
        playPauseIcon.className = 'fas fa-pause'; // Switch the icon to pause since we are playing the song
        audio.play(); // Automatically start playing the song once it is loaded
      })
      .catch(error => console.error('Error fetching the lyrics:', error));
  }

  // Function to display the lyrics
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

  // Function to apply font styles based on the language
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

  // Event listener to close the lyrics display
  closeLyricsButton.addEventListener("click", function() {
    lyricsContainer.classList.remove("active");
  });

  // Event listener to filter songs based on search input
  searchInput.addEventListener('input', function() {
    displaySongs();
  });

  // Play/Pause toggle function
  function togglePlayPause() {
    if (audio.paused || audio.ended) {
      audio.play();
      playPauseIcon.className = 'fas fa-pause';
    } else {
      audio.pause();
      playPauseIcon.className = 'fas fa-play';
    }
  }

  // Handle progress bar update
  audio.ontimeupdate = function() {
    var percentage = (audio.currentTime / audio.duration) * 100;
    progressBar.style.width = percentage + '%';
  };

  // Function to handle seek on progress bar
  function seekAudio(event) {
    var rect = event.currentTarget.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var percent = x / rect.width;
    audio.currentTime = percent * audio.duration;
    progressBar.style.width = percent * 100 + '%';
  }

  // Function to reset the progress bar
  function resetProgressBar() {
    progressBar.style.width = '0%';
  }

  // **New Function to load the first song audio without selecting it**
  function loadFirstSongAudio() {
    const firstSong = allMusic[0]; // Get the first song
    if (firstSong) {
      audioSource.src = firstSong.src; // Set the audio source to the first song's audio file
      audio.load(); // Load the audio without playing it
    }
  }

  // Initially display all songs and load the first song's audio in the background
  displaySongs();
  loadFirstSongAudio(); // Load the first song's audio but do not select it
});
