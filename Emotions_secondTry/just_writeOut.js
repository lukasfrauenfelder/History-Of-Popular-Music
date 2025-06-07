const slidertext = document.querySelector(".txt");
const songList = document.getElementById("songList");
const Legende = document.getElementById("Legende");
songList.innerHTML = ""; // Clear previous entries
Legende.innterHTML = "";

let slider;
let cnv
let currentEmotions = null;
let mouseXInSongList = 0;
const minWidth = 38.25;
const maxWidth = 500;
const hundert = 500;
let blockWidth = minWidth; // starting width
let selectedEmotion = "all"; // Declare this globally at the top


songList.addEventListener("wheel", (e) => {
  e.preventDefault(); // prevent horizontal scroll

  // Adjust width based on scroll direction
  const delta = e.deltaY;
  blockWidth -= delta * 0.2; // scale sensitivity
  blockWidth = Math.max(minWidth, Math.min(maxWidth, blockWidth)); // clamp
  slider.value(blockWidth); // keep slider in sync

  updateBlockWidths(); // apply new width
}, { passive: false }); // passive must be false to use preventDefault


let genreOrder = ["shrimps"]

let emotionOrder = [
  "sadness",
  "fear",
  "anger",
  "joy",
  "disgust",
  
]

let emotionOrderLegende = [
  "sadness",
  "fear",
  "anger",
  "joy",
  "disgust",
  "all"
  
]



function preload() {
    data = loadJSON("songs_by_year-2.json");

    console.log(data)
  }

  function setup(){
    console.log(data)
    // noCanvas()
    // cnv = createCanvas(150,150)
    emotionValueDisplay = document.createElement("h3");
    emotionValueDisplay.id = "emotionValueDisplay";
    document.body.appendChild(emotionValueDisplay);

    genreDropdown = createSelect();
    genreDropdown.position(-20, -50);
    genreDropdown.option('all');
    for (let g of genreOrder) {
      genreDropdown.option(g);
    }

    emotionDropdown = createSelect();
    emotionDropdown.position(1690, 70);
    emotionDropdown.option('all');
    for (let e of emotionOrder) {
      emotionDropdown.option(e);
    }
    
    genreDropdown.changed(renderSongList); // redraw when selection changes
    emotionDropdown.changed(renderSongList)

    slider = createSlider(0,100,0)
    // slider.position(1090,52)
    slider.style('z-index', '100'); // 👈 Set z-index here
     // Add a class
    slider.class('my-slider');

    slider.input(() => {
      // const values = document.querySelectorAll(".value");
      
      // values.forEach(el => {
      //   el.style.opacity = "1";
      // });
    
      // setTimeout(() => {
      //   values.forEach(el => {
      //     el.style.opacity = "0.5";
      //   });
      // }, 2000); // after 2 seconds
    
      renderSongList();
    });
    
    renderSongList()
    // setInterval(updateText); // Call every 3 seconds
  }

  function renderSongList(){
    songList.innerHTML = ""; 
    Legende.innerHTML = "";

    selectedGenre = genreDropdown.value(); // get currently selected genre
    // selectedEmotion = emotionDropdown.value()
    Schwellenwert = map(slider.value(),0,100,0,1)

    const emotionThresholds = {
      sadness: 0.4+Schwellenwert,
      anger: 0.3+Schwellenwert,
      fear: 0.3+Schwellenwert,
      disgust: 0.21+Schwellenwert,
      joy: 0.5+Schwellenwert
    };



    // for (e in emotionOrder){
    //   let emotion = emotionOrder[e]
    //   const legendeflex = document.createElement("span");
    //   legendeflex.classList.add("emotion-group", `emotion-${emotion}`);

    //   const legendeContent = document.createElement("p");
    //   legendeContent.classList.add("legendeContent");
    //   legendeContent.textContent = emotion
    //   legendeContent.classList.add(`emotion-${emotion}`);
      

    //   const emotionvalue = document.createElement("p");
    //   emotionvalue.classList.add("value");
    //   emotionvalue.textContent = emotionThresholds[emotion].toFixed(2);
    //   // emotionvalue.classList.add("emotion-group", `emotion-${emotion}`);

    //   legendeflex.appendChild(emotionvalue)

    //   legendeflex.appendChild(legendeContent)
    //   Legende.appendChild(legendeflex)
    // }

    for (e in emotionOrderLegende){
      let emotion = emotionOrderLegende[e] 
      const legendeflex = document.createElement("span");
      legendeflex.classList.add("emotion-group", `emotion-${emotion}`);

      const legendeContent = document.createElement("a");
      legendeContent.classList.add("legendeContent");
      if (emotion === "all"){
        legendeContent.textContent = "select all"
      } else{      legendeContent.textContent = emotionOrderLegende[e]
      }
      legendeContent.classList.add("emotion-" + emotion.replace(/\s|\/|-/g, "_").toLowerCase());

      const emotionvalue = document.createElement("p");
      emotionvalue.classList.add("value");
      if(emotion!== "all"){
      emotionvalue.textContent = emotionThresholds[emotion].toFixed(2);      
      }else if(emotion ==="all"){
      emotionvalue.textContent = "0.00";
      emotionvalue.style.opacity = "0";
 
      }
      emotionvalue.classList.add("emotion-group", `emotion-${emotion}`);


          // ✅ Apply highlight if this is the selected genre
      if (emotion === selectedEmotion&& emotion!== "all") {
        legendeContent.classList.add("selected-emotion");
      }
        // ✅ Add this click listener
      legendeContent.addEventListener("click", () => {
        selectedEmotion = emotion; // Set the selected emotion
        console.log("Selected Emotion:", selectedEmotion);

        renderSongList()

      }); 


      if (selectedEmotion === "all") {
        document.body.classList.remove("genre-selected");
      } else {
        document.body.classList.add("genre-selected");
      }

      // // ✅ Highlight all others on hover
      legendeContent.addEventListener("mouseenter", () => {
        document.querySelectorAll(".legendeContent").forEach(el => {
          if (el !== legendeContent) {
            el.classList.add("faded");
          }
        });
      });

      legendeContent.addEventListener("mouseleave", () => {
        document.querySelectorAll(".legendeContent").forEach(el => {
          el.classList.remove("faded");
        });
      });
      
  
      legendeflex.appendChild(emotionvalue)

      legendeflex.appendChild(legendeContent)
      Legende.appendChild(legendeflex)

      

      // Legende.appendChild(legendeContent)
    }

    
    let x = 20
    let y = windowHeight-20



    for(yearKey in data){
      let year = data[yearKey]
      let selectedSongs = [];
      let otherSongs = [];

          // First group the songs of this year by genre
      let genreGroups = {};
      for (let genre of genreOrder) {
      genreGroups[genre] = [];
      }

    for (let songData of year) {
      let genre = songData["Genre"];
      if (genreGroups.hasOwnProperty(genre)) {
        genreGroups[genre].push(songData);
      }
    }

    let emotionGroups = {};
    for (let emotion of emotionOrder) {
      emotionGroups[emotion] = [];
      const emotionContainer = document.createElement("div");
      emotionContainer.classList.add("emotion-container", `emotion-${emotion}`);
      
    }


    emotionValueDisplay.textContent = `Change Threshold`;
    

    
    for (let songData of year) {
      let emotions = songData["Emotions"];
      if (emotions) {
        for (let emotion of emotionOrder) {
          const threshold = emotionThresholds[emotion];
          if (emotions[emotion] && emotions[emotion] > threshold) {
            emotionGroups[emotion].push(songData);
          }
        }
      }
    }
    




       // Create a container for this year
  const yearDiv = document.createElement("div");
  yearDiv.classList.add("year-block");
  yearDiv.style.marginBottom = "20px";
  

  // Add a heading for the year
  const yearHeader = document.createElement("h3");
  const yearHeaderContent = document.createElement("span");
  yearHeaderContent.textContent = yearKey;
  yearHeaderContent.classList.add("yearHeaderContent");
  yearHeader.appendChild(yearHeaderContent);
  yearDiv.appendChild(yearHeader);

  let emotionBandHeight = 150; // space per emotion
  let emotionSpacing = 20;     // space between emotion bands

  let bandTop = 60; // starting Y position for drawing emotions
  let rh = 9

  // Add songs
  for (let i = 0; i < emotionOrder.length; i++) {
    let emotion = emotionOrder[i];
  
    let songs = emotionGroups[emotion];

    // Create a container for the emotion group
    const emotionGroup = document.createElement("div");
    emotionGroup.classList.add("emotion-group", `emotion-${emotion}`);
    
    
    
    const year_length = year.length
    let genre_length = songs.length
    // Skip if selectedGenre is active and not matching
    if (selectedEmotion !== "all" && emotion !== selectedEmotion) {
      continue;
    }

  

    let songCount = songs.length;

    // Get Y range for this emotion band
    let bandYStart = bandTop + i * (emotionBandHeight + emotionSpacing);

    // Calculate space needed for this emotion’s songs
    let blockHeight = songCount * rh;

    // Calculate start Y so that rects are vertically centered in the band
    let yOffset = bandYStart + (emotionBandHeight - blockHeight) / 2;




    
    for (let songData of songs) {
    const text = songData["Artist"] + " – " + songData["Song"];
    const artist = songData["Artist"] 
    const track = songData["Song"]
    const spotifyLink = songData["Spotify_uri"];
    const Emotions = songData["Emotions"]
    const Genre = songData["Genre"]
    const Lyrics = songData["Lyrics"]
    const lyricsSnippet = Lyrics.split(" ")[floor(random(1,100))];
    // console.log(lyricsSnippet)

    const songItem = document.createElement("a");
    songItem.classList.add("song-link");
    songItem.href = spotifyLink || "#";
    songItem.target = "_blank"; // open in new tab
    songItem.rel = "noopener noreferrer"; // security best practice

    songItem.style.position = "absolute";
    // songItem.style.left = `${x}px`;
    songItem.style.top = `${yOffset}px`;

    yOffset += rh;

    songItem.addEventListener("click", (e) => {
      e.preventDefault();
    
      let songUri = songData["Spotify_uri"];
    
      if (window.spotifyDeviceId && window.spotifyToken && songUri) {
        playSong(window.spotifyDeviceId, window.spotifyToken, songUri);
      } else {
        console.warn("Fehlende Daten für playSong()");
      }
    });
    
    // Create a flex wrapper
const songFlex = document.createElement("div");
songFlex.classList.add("song-flex");
songFlex.classList.add("emotion-" + emotion.replace(/\s|\/|-/g, "_").toLowerCase());
// songFlex.classList.add("genre-" + Genre.replace(/\s|\/|-/g, "_").toLowerCase());

const yearVisualHeight = 1200; // total visual height per year block (adjust as needed)
const genreHeight = (genre_length / year_length) * yearVisualHeight;
const songHeight = genreHeight / genre_length;

// songFlex.style.height = `${songHeight}px`;
songFlex.style.height = `20px`;
// Artist on the left
const artistSpan = document.createElement("span");
artistSpan.textContent = artist;
artistSpan.classList.add("artist-name");
artistSpan.classList.add("emotion-" + emotion.replace(/\s|\/|-/g, "_").toLowerCase());


// Track on the right
const trackSpan = document.createElement("span");
trackSpan.textContent =   track;
trackSpan.classList.add("track-name");

const lyricsSpan = document.createElement("span");
lyricsSpan.textContent =  lyricsSnippet
lyricsSpan.classList.add("lyrics");

// Add to flex container
songFlex.appendChild(artistSpan);
songFlex.appendChild(trackSpan);
// songFlex.appendChild(lyricsSpan);

// Append flex container to link
songItem.appendChild(songFlex);
emotionGroup.appendChild(songItem);
yearDiv.appendChild(emotionGroup);

    // if (spotifyLink) {
    //   // songItem.style.textDecoration = "underline";
    //   songItem.addEventListener("mouseover", () => {
    //       currentEmotions = JSON.parse(songItem.dataset.emotions);
    //       drawEmotions(currentEmotions)
    //     });
        
    //     songItem.addEventListener("mouseout", () => {
    //       currentEmotions = null;
    //     });
    // }

    // yearDiv.appendChild(songItem);
    }
  //   yearDiv.appendChild(document.createElement("br"));
  }

  // Add this year block to the main song list
  songList.appendChild(yearDiv);

  updateBlockWidths();
  }
  }

  songList.addEventListener("mousemove", (e) => {
    const bounds = songList.getBoundingClientRect();
    mouseXInSongList = e.clientX - bounds.left;
  });



  function updateBlockWidths() {
    const songListWidth = songList.scrollWidth;
    const viewWidth = songList.clientWidth;
    const scrollLeftBefore = songList.scrollLeft;
  
    // % position of mouse in scroll container
    const relativeMouseX = mouseXInSongList / viewWidth;
    const totalScroll = songListWidth - viewWidth;
  
    // Width update
    const newWidth = slider.value();
    document.querySelectorAll(".year-block").forEach(block => {
      block.style.width = `${blockWidth}px`;

      if (blockWidth < 130) {
        block.classList.add("rect-mode");
      } else {
        block.classList.remove("rect-mode");
      }

      const songLinks = block.querySelectorAll(".song-link");
      songLinks.forEach(link => {
        if (blockWidth < 130) {
          link.classList.add("rect-mode");
        } else {
          link.classList.remove("rect-mode");
        }

        // if (blockWidth > 130) {
        //   link.classList.add("list-mode");
        // } else {
        //   link.classList.remove("list-mode");
        // }
      });
      

      const songFlexElements = block.querySelectorAll(".song-flex");
      songFlexElements.forEach(flex => {
        const lyricsSpan = flex.querySelectorAll("lyrics")
        if (blockWidth < 130) {
          flex.classList.add("rect-mode");
          lyricsSpan.forEach(l => {
            l.textContent = "gugugs"
          })
        } else {
          flex.classList.remove("rect-mode");
        }

        
     
      });

    });
  
    // Wait for DOM layout to update, then adjust scroll
    requestAnimationFrame(() => {
      const newScrollWidth = songList.scrollWidth;
      const newTotalScroll = newScrollWidth - viewWidth;
      songList.scrollLeft = relativeMouseX * newTotalScroll;
    });
  }
  

  



  function drawEmotions(currentEmotions){
    
    clear(); // clears canvas each frame
    fill(255)
    text(slider.value(),20,20) 
    if (currentEmotions) {
        fill("white");
        textSize(14);
        let y = 20;
        for (let key in currentEmotions) {
          const value = currentEmotions[key];
          text(`${key}: ${value.toFixed(2)}`, 10, y);
          
          rect(100,y-10,value*100,15)
          y += 20;
        }
      }

  }
  