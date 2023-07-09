fetch("info.txt")
      .then(response => response.text())
      .then(lyrics => {
        const lines = lyrics.split('\n');
        const lyricsContainer = document.getElementById('main');
  
        // Clear the lyrics container
        lyricsContainer.innerHTML = '';
  
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim(); // Remove leading/trailing whitespace
          
            if (line !== '') {
              const paragraph = document.createElement('p');
              paragraph.textContent = line;
              paragraph.style.fontFamily = "'Fira Sans', serif, Arial, sans-serif";
              paragraph.style.color = 'white'; // Set the text color
              paragraph.style.lineHeight = '2.5'; // Set the line height
              lyricsContainer.appendChild(paragraph);
            } else if (i > 0 && lines[i - 1].trim() !== '') {
              const blankLine = document.createElement('p');
              blankLine.style.marginBottom = '1em';
              lyricsContainer.appendChild(blankLine);
            }
          }
          


      })
      .catch(error => {
        console.error('Error fetching the lyrics:', error);
      });