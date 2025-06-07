// const slidertext = document.querySelector(".txt");
var songList = document.getElementById("songList");
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
let selectedGenre = "all"; // Declare this globally at the top

songList.addEventListener("wheel", (e) => {
  e.preventDefault(); // prevent horizontal scroll

  // Adjust width based on scroll direction
  const delta = e.deltaY;
  blockWidth -= delta * 0.2; // scale sensitivity
  blockWidth = Math.max(minWidth, Math.min(maxWidth, blockWidth)); // clamp
  // slider.value(blockWidth); // keep slider in sync

  updateBlockWidths(blockWidth); // apply new width
}, { passive: false }); // passive must be false to use preventDefault


let genreOrder = [
  "soul",
  "rap/hip hop",
  "easy listening/country",
  "jazz/funk",
  "pop/rock",
  "female-vocal/RnB",
  "country",
  "dance/electronic",
  "classic rock",
  "love song/slow jams",
  "blues/funk",
  "RnB/soul",
  "hard rock"
];

let genreOrderLegende = [
  "soul",
  "rap/hip hop",
  "easy listening/country",
  "jazz/funk",
  "pop/rock",
  "female-vocal/RnB",
  "country",
  "dance/electronic",
  "classic rock",
  "love song/slow jams",
  "blues/funk",
  "RnB/soul",
  "hard rock",
  "all"
];




function preload() {
    data = loadJSON("songs_by_year-2.json");
  }

  function setup(){
    console.log(data)
    noCanvas()
    // cnv = createCanvas(150,150)
    // background("red")
    // cnv.style("z-index:","1")

    genreDropdown = createSelect();
    genreDropdown.position(360, 55);
    genreDropdown.option('all');
    for (let g of genreOrder) {
      genreDropdown.option(g);
      
    }
    
    genreDropdown.changed(renderSongList);
    genreDropdown.hide() // redraw when selection changes
    

    // slider = createSlider(18,500)
    // slider.position(220,20)
    // slider.input(updateBlockWidths); // call when slider changes
    
    renderSongList()
  }

  function renderSongList(){
    songList.innerHTML = "";
    Legende.innerHTML = "";
    // selectedGenre = genreDropdown.value(); // get currently selected genre
    
    for (g in genreOrderLegende){
      let Genre = genreOrderLegende[g]
      const legendeContent = document.createElement("a");
      legendeContent.classList.add("legendeContent");
      if (Genre === "all"){
        legendeContent.textContent = "select all"
      } else{      legendeContent.textContent = genreOrderLegende[g]
      }
      legendeContent.classList.add("genre-" + Genre.replace(/\s|\/|-/g, "_").toLowerCase());

          // ✅ Apply highlight if this is the selected genre
      if (Genre === selectedGenre&& Genre!== "all") {
        legendeContent.classList.add("selected-emotion");
      }
        // ✅ Add this click listener
      legendeContent.addEventListener("click", () => {
        selectedGenre = Genre; // Set the selected emotion
        console.log("Selected Genre:", selectedGenre);

        renderSongList()

      }); 


      if (selectedGenre === "all") {
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
      
  

      

      Legende.appendChild(legendeContent)
    }

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

  // Add songs
  for (let genre of genreOrder) {

    let songs = genreGroups[genre];
    
    const year_length = year.length
    let genre_length = songs.length
    const genre_prozent = genre_length/year_length *100
          // Skip if selectedGenre is active and not matching
          if (selectedGenre !== "all" && genre !== selectedGenre) {
            continue;
          }
    
    for (let songData of songs) {
    const text = songData["Artist"] + " – " + songData["Song"];
    const artist = songData["Artist"] 
    const track = songData["Song"]
    const spotifyLink = songData["Spotify_uri"];
    const Emotions = songData["Emotions"]
    const Genre = songData["Genre"]
  //   console.log(Emotions)

    const songItem = document.createElement("a");
    songItem.classList.add("song-link");
    songItem.href = spotifyLink || "#";
    songItem.target = "_blank"; // open in new tab
    songItem.rel = "noopener noreferrer"; // security best practice

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
songFlex.classList.add("genre-" + Genre.replace(/\s|\/|-/g, "_").toLowerCase());
const yearVisualHeight = 850; // total visual height per year block (adjust as needed)
const genreHeight = (genre_length / year_length) * yearVisualHeight;
const songHeight = genreHeight / genre_length;

songFlex.style.height = `${songHeight}px`;

//Hover
const hoverDetails = document.createElement("div");
hoverDetails.classList.add("hover-details");
hoverDetails.textContent = artist //+ " – " + track;

// Genretag on the left
const genreSpan = document.createElement("span");
// genreSpand.textContent = artist;
genreSpan.classList.add("genre-tag");
genreSpan.classList.add("Fullgenre-" + Genre.replace(/\s|\/|-/g, "_").toLowerCase());


// Artist on the left
const artistSpan = document.createElement("span");
artistSpan.textContent = artist;
artistSpan.classList.add("artist-name");

// Track on the right
const trackSpan = document.createElement("span");
trackSpan.textContent =   track;
trackSpan.classList.add("track-name");

// Add to flex container
// songFlex.appendChild(genreSpan);
songFlex.appendChild(artistSpan);
songFlex.appendChild(trackSpan);



// Append flex container to link
songItem.appendChild(hoverDetails);
songItem.appendChild(songFlex);

yearDiv.appendChild(songItem);


    }
  //   yearDiv.appendChild(document.createElement("br"));
  }

  // Add this year block to the main song list
  songList.appendChild(yearDiv);

  updateBlockWidths(blockWidth);
  }
  }

  songList.addEventListener("mousemove", (e) => {
    const bounds = songList.getBoundingClientRect();
    mouseXInSongList = e.clientX - bounds.left;
  });

  // function updateBlockWidths() {
  //   drawEmotions()
  //   const blocks = document.querySelectorAll(".year-block");
  //   const width = `${slider.value()}px`;

    
  //   blocks.forEach(block => {
  //     block.style.width = width;


  //     const songFlexElements = block.querySelectorAll(".song-flex");
  //     songFlexElements.forEach(flex => {
  //       if (slider.value() < 250) {
  //         flex.classList.add("stacked");
  //       } else {
  //         flex.classList.remove("stacked");
  //       }
  //     });

  //     const songLinks = block.querySelectorAll(".song-link");
  //     songLinks.forEach(link => {
  //       if (slider.value() < 130) {
  //         link.classList.add("rect-mode");
  //         block.classList.add("rect-mode")
  //       } else {
  //         link.classList.remove("rect-mode");
  //         block.classList.remove("rect-mode");
  //       }
  //     });


  //   });
  // }

  function updateBlockWidths(blockWidth) {
    const songListWidth = songList.scrollWidth;
    const viewWidth = songList.clientWidth;
    const scrollLeftBefore = songList.scrollLeft;
  
    // % position of mouse in scroll container
    const relativeMouseX = mouseXInSongList / viewWidth;
    const totalScroll = songListWidth - viewWidth;
  
    // Width update
    const newWidth = blockWidth
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
      });
      

      const songFlexElements = block.querySelectorAll(".song-flex");
      songFlexElements.forEach(flex => {
        if (blockWidth < 130) {
          flex.classList.add("rect-mode");
        } else {
          flex.classList.remove("rect-mode");
        }

        if (blockWidth > 130) {
          flex.classList.add("absolute-mode");
        } else {
          flex.classList.remove("absolute-mode");
        }

        const genreTag = flex.querySelector(".genre-tag");
          if (!genreTag) return;
          // console.log(genreTag)
          if (blockWidth > 130) {
            genreTag.classList.add("rect-mode");
          } else {
            genreTag.classList.remove("rect-mode");
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
  


  