//opens the settings Menu
document.addEventListener("DOMContentLoaded", function() {
  var dropdownTrigger = document.getElementById("dropdown-trigger");
  var dropdownContent = document.querySelector(".dropdown-content");
  dropdownTrigger.addEventListener("click", function() {
    dropdownContent.classList.toggle("active");
  });

});

document.addEventListener("DOMContentLoaded", function() {
  const searchInput = document.getElementById('searchInput');
  const songDetails = document.querySelector('.main');
  const lyricsContainer = document.querySelector('.lyricsContainer');
  const lyricsDisplay = document.getElementById('lyrics');
  const closeLyricsButton = document.getElementById("close-lyrics");
  const englishBtn = document.getElementById("englishBtn");
  const urduBtn = document.getElementById("urduBtn");

  let currentLanguage = 'English'; // Default language

  englishBtn.addEventListener('click', () => setLanguage('English'));
  urduBtn.addEventListener('click', () => setLanguage('Urdu'));

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
    songItem.style.background = 'rgba(10, 10, 10, 0.15)';
    songItem.style.border = '1px solid rgba(255, 255, 255, 0.05)';
    songItem.style.borderRadius = '10px';
    songItem.style.padding = '10px';
    songItem.style.backdropFilter = 'blur(20px)';
    songItem.style.boxShadow = '-6px 6px 6px rgba(10, 10, 10, 0.55)'
    songItem.style.marginBottom = '10px';

    const songName = document.createElement('p');
    songName.textContent = song.name;
    songName.className = 'name';
    songName.style.fontWeight = 'bold';
    songName.innerText = song.name;
    songName.style.fontFamily = 'M PLUS Rounded 1c, optima, sans-serif, Arial';
    songName.style.fontSize = '18px';
    songName.style.paddingBottom = '7px';

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
      fetchAndDisplayLyrics(song.lyricsFile);
    });
    songDetails.appendChild(songItem);
  }

  function fetchAndDisplayLyrics(lyricsFile) {
    fetch(`lyrics/${lyricsFile}`)
      .then(response => response.text())
      .then(lyricsText => {
        currentLyrics = lyricsText.split('\n');
        displayLyrics(currentLyrics);
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
        lyricLine.style.fontSize = '13px';
        lyricLine.style.lineHeight = '2.3';
    } else {
        lyricLine.style.fontFamily = "'Noto Nastaliq Urdu', serif, Arial, sans-serif";
        lyricLine.style.lineHeight = '2.3';
    }
}

  englishBtn.addEventListener('click', () => setLanguage('English'));
  urduBtn.addEventListener('click', () => setLanguage('Urdu'));

  closeLyricsButton.addEventListener("click", function() {
    lyricsContainer.classList.remove("active");
  });

  searchInput.addEventListener('input', function() {
    displaySongs();
  });

  displaySongs(); // Initially display all songs
});







