// js/script.js

function updateClock(){

  const now = new Date();

  const days = [
    "Minggu",
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
    "Sabtu"
  ];

  const h = String(now.getHours()).padStart(2,'0');
  const m = String(now.getMinutes()).padStart(2,'0');
  const s = String(now.getSeconds()).padStart(2,'0');

  document.getElementById("clock").innerHTML =
  `${days[now.getDay()]}, ${h}.${m}.${s}`;

}

setInterval(updateClock,1000);

updateClock();

let views = localStorage.getItem("views");

if(!views){

  views = 1;

}else{

  views++;

}

localStorage.setItem("views",views);

document.getElementById("views").innerText = views;

const linksBox =
document.getElementById("links");

socialLinks.forEach(link=>{

  const a =
  document.createElement("a");

  a.href = link.url;

  a.className = "link-card";

  a.innerHTML = `
  
  <div class="link-left">

    ${
      link.icon
      ?
      `<i class="${link.icon}"></i>`
      :
      `<img src="${link.image}">`
    }

    <span>${link.name}</span>

  </div>

  <i class="fas fa-arrow-right"></i>
  
  `;

  linksBox.appendChild(a);

});

let quoteIndex = 0;

function changeQuote(){

  document.getElementById("quote").innerText =
  quotes[quoteIndex];

  quoteIndex++;

  if(quoteIndex >= quotes.length){

    quoteIndex = 0;

  }

}

changeQuote();

setInterval(changeQuote,3000);

const audio =
document.getElementById("audio");

const musicTitle =
document.getElementById("musicTitle");

const musicImage =
document.getElementById("musicImage");

const musicArtist =
document.getElementById("musicArtist");

const musicBio =
document.getElementById("musicBio");

const playBtn =
document.getElementById("play");

const lyricsBox =
document.getElementById("lyrics");

let currentMusic = 0;

let playing = true;

let lyricsData = {};

fetch("database/lyric/lyrics.json")

.then(res => res.json())

.then(data => {

  lyricsData = data;

  loadMusic(currentMusic);

});

function loadMusic(index){

  const song = musics[index];

  audio.src = song.audio;

  musicTitle.innerText =
  song.title;

  musicImage.src =
  song.image;

  musicArtist.innerText =
  song.artist;

  musicBio.innerText =
  song.bio;

  loadLyrics(song.id);

}

function loadLyrics(songId){

  lyricsBox.innerHTML = "";

  if(!lyricsData[songId]){

    lyricsBox.innerHTML =
    `<p class="no-lyrics">
      Lyrics not found...
    </p>`;

    return;

  }

  lyricsData[songId].forEach((line,index)=>{

    const p =
    document.createElement("p");

    p.className =
    "lyric-line";

    p.style.animationDelay =
    `${index * 0.15}s`;

    p.innerText = line;

    lyricsBox.appendChild(p);

  });

}

audio.volume = 1;

audio.play();

playBtn.onclick = ()=>{

  if(playing){

    audio.pause();

    playBtn.innerHTML =
    `<i class="fas fa-play"></i>`;

  }else{

    audio.play();

    playBtn.innerHTML =
    `<i class="fas fa-pause"></i>`;

  }

  playing = !playing;

};

document.getElementById("next").onclick = ()=>{

  currentMusic++;

  if(currentMusic >= musics.length){

    currentMusic = 0;

  }

  loadMusic(currentMusic);

  audio.play();

  playing = true;

  playBtn.innerHTML =
  `<i class="fas fa-pause"></i>`;

};

document.getElementById("prev").onclick = ()=>{

  currentMusic--;

  if(currentMusic < 0){

    currentMusic =
    musics.length - 1;

  }

  loadMusic(currentMusic);

  audio.play();

  playing = true;

  playBtn.innerHTML =
  `<i class="fas fa-pause"></i>`;

};

audio.addEventListener("ended",()=>{

  currentMusic++;

  if(currentMusic >= musics.length){

    currentMusic = 0;

  }

  loadMusic(currentMusic);

  audio.play();

});

const visualizer =
document.querySelectorAll(
".music-visualizer span"
);

const audioContext =
new AudioContext();

const analyser =
audioContext.createAnalyser();

const source =
audioContext.createMediaElementSource(audio);

source.connect(analyser);

analyser.connect(audioContext.destination);

analyser.fftSize = 256;

const bufferLength =
analyser.frequencyBinCount;

const dataArray =
new Uint8Array(bufferLength);

function animateVisualizer(){

  requestAnimationFrame(
    animateVisualizer
  );

  analyser.getByteFrequencyData(
    dataArray
  );

  visualizer.forEach((bar,index)=>{

    const value =
    dataArray[index];

    const height =
    Math.max(10,value);

    bar.style.height =
    `${height}px`;

  });

}

animateVisualizer();

const storiesBox =
document.getElementById("stories");

stories.forEach((story,index)=>{

  const div =
  document.createElement("div");

  div.className = "story";

  div.innerHTML = `
  
  <img src="${story.thumb}">
  
  <p>Status</p>
  
  `;

  div.onclick =
  ()=> openStory(index);

  storiesBox.appendChild(div);

});

const statusView =
document.getElementById("statusView");

const statusContent =
document.getElementById("statusContent");

const statusCaption =
document.getElementById("statusCaption");

function openStory(index){

  const story =
  stories[index];

  statusView.style.display =
  "flex";

  statusCaption.innerText =
  story.caption;

  /* IMAGE */

  if(story.type === "img"){

    statusContent.innerHTML =

    `
    <img
    src="${story.src}"
    class="story-media">
    `;

  }

  /* VIDEO */

  else if(story.type === "video"){

    statusContent.innerHTML =

    `
    
    <video
      autoplay
      playsinline
      controls
      controlsList="nodownload noplaybackrate"
      disablePictureInPicture
      class="story-media"
    >

      <source
      src="${story.src}"
      type="video/mp4">

    </video>
    
    `;

  }

}

document.getElementById(
"openStatus"
).onclick = ()=>{

  openStory(0);

};

document.getElementById(
"closeStatus"
).onclick = ()=>{

  statusView.style.display =
  "none";

  statusContent.innerHTML =
  "";

};

document.body.addEventListener(
"click",
()=>{

  if(audioContext.state ===
  "suspended"){

    audioContext.resume();

  }

},
{ once:true }
);