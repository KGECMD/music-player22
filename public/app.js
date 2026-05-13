// Player State
let queue = JSON.parse(localStorage.getItem("harmonyQueue") || "[]");
let currentIndex = -1;
let isPlaying = false;
let repeatMode = 0;
let currentQuality = "320";
let currentSource = "all";
let lastSearchResults = [];

const audio = document.getElementById("audioPlayer");
const resultsDiv = document.getElementById("results");
const searchInput = document.getElementById("searchInput");
const themeSelect = document.getElementById("themeSelect");
const qualitySelect = document.getElementById("qualitySelect");

// Load Settings
const savedTheme = localStorage.getItem("harmonyTheme") || "monochrome";
const savedQuality = localStorage.getItem("harmonyQuality") || "320";
setTheme(savedTheme);
setQuality(savedQuality);
themeSelect.value = savedTheme;
qualitySelect.value = savedQuality;

// Audio Events
audio.addEventListener("ended", () => {
  if (repeatMode === 2) {
    audio.currentTime = 0;
    audio.play();
  } else {
    nextTrack();
  }
});
audio.addEventListener("timeupdate", updateProgress);
audio.addEventListener("play", () => { isPlaying = true; updatePlayButton(); });
audio.addEventListener("pause", () => { isPlaying = false; updatePlayButton(); });
audio.addEventListener("error", handleAudioError);

searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") performSearch();
});

// Keyboard Controls
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") { e.preventDefault(); togglePlay(); }
  if (e.code === "ArrowRight") nextTrack();
  if (e.code === "ArrowLeft") previousTrack();
  if (e.code === "ArrowUp") setVolume(Math.min(100, parseInt(audio.volume * 100) + 10));
  if (e.code === "ArrowDown") setVolume(Math.max(0, parseInt(audio.volume * 100) - 10));
});

// Error Handler
function handleAudioError() {
  console.error("Audio error:", audio.error);
  if (currentIndex < queue.length - 1) {
    nextTrack();
  } else {
    alert("Could not play track. Trying next...");
  }
}

// Theme System
function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("harmonyTheme", theme);
}

// Quality System
function setQuality(quality) {
  currentQuality = quality;
  localStorage.setItem("harmonyQuality", quality);
  const display = quality === "hifi" ? "HiFi FLAC" : quality + " kbps";
  console.log(`🔊 Quality: ${display}`);
}

// Source Selection
function setSource(source) {
  currentSource = source;
  document.querySelectorAll(".source-pill").forEach(p => p.classList.remove("active"));
  document.querySelector(`[data-source="${source}"]`).classList.add("active");
}

// Volume Control
function setVolume(value) {
  audio.volume = Math.min(100, Math.max(0, value)) / 100;
  document.getElementById("volumeSlider").value = value;
  localStorage.setItem("harmonyVolume", value);
}

const savedVolume = localStorage.getItem("harmonyVolume") || 70;
setVolume(savedVolume);

// View Switching
function switchView(view) {
  document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
  document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
  
  document.getElementById(view + "View").classList.add("active");
  event.target.classList.add("active");
  
  if (view === "queue") renderQueue();
  else if (view === "trending") loadTrending();
  else if (view === "settings") showSettings();
}

// Search
function performSearch() {
  const query = searchInput.value.trim();
  if (!query) return;
  
  const status = document.getElementById("searchStatus");
  status.textContent = "🔍 Searching...";
  resultsDiv.innerHTML = "";
  
  const apiUrl = currentSource === "all" 
    ? "/api/search"
    : `/api/search/${currentSource}`;
  
  fetch(`${apiUrl}?q=${encodeURIComponent(query)}`)
    .then(r => r.json())
    .then(data => {
      status.textContent = "";
      resultsDiv.innerHTML = "";
      
      if (!data.data || data.data.length === 0) {
        resultsDiv.innerHTML = '<div class="no-results">No results found</div>';
        return;
      }
      
      lastSearchResults = data.data;
      data.data.forEach((track, idx) => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
          <div class="card-inner">
            <div class="card-info">
              <div class="card-title">${escapeHtml(track.title)}</div>
              <div class="card-artist">${escapeHtml(track.artist || "Unknown")}</div>
              <div class="card-meta">${track.source.toUpperCase()} • ${track.quality || "192kbps"}</div>
            </div>
            <button class="card-btn" onclick="addToQueue(${idx})">+ Add</button>
          </div>
        `;
        resultsDiv.appendChild(card);
      });
    })
    .catch(err => {
      console.error("Search error:", err);
      status.textContent = "❌ Search failed";
    });
}

// Trending
function loadTrending() {
  const trendingDiv = document.getElementById("trendingResults");
  trendingDiv.innerHTML = '<div class="loading">⏳ Loading...</div>';
  
  fetch("/api/trending")
    .then(r => r.json())
    .then(data => {
      trendingDiv.innerHTML = "";
      
      if (!data.data || data.data.length === 0) {
        trendingDiv.innerHTML = '<div class="no-results">No trending tracks</div>';
        return;
      }
      
      lastSearchResults = data.data;
      data.data.forEach((track, idx) => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
          <div class="card-inner">
            <div class="card-info">
              <div class="card-title">${escapeHtml(track.title)}</div>
              <div class="card-artist">${escapeHtml(track.artist || "Unknown")}</div>
            </div>
            <button class="card-btn" onclick="addToQueue(${idx})">▶️</button>
          </div>
        `;
        trendingDiv.appendChild(card);
      });
    })
    .catch(err => {
      console.error("Trending error:", err);
      trendingDiv.innerHTML = '<div class="error">Failed to load</div>';
    });
}

// Queue
function addToQueue(index) {
  if (!lastSearchResults || !lastSearchResults[index]) return;
  const track = lastSearchResults[index];
  queue.push(track);
  saveQueue();
  if (currentIndex === -1) {
    currentIndex = queue.length - 1;
    playTrack(queue[currentIndex]);
  }
}

function renderQueue() {
  const queueList = document.getElementById("queueList");
  const emptyMsg = document.getElementById("emptyQueue");
  
  if (queue.length === 0) {
    queueList.innerHTML = "";
    emptyMsg.style.display = "block";
    return;
  }
  
  emptyMsg.style.display = "none";
  queueList.innerHTML = "";
  
  queue.forEach((track, i) => {
    const div = document.createElement("div");
    div.className = "queue-item" + (i === currentIndex ? " active" : "");
    div.innerHTML = `
      <div class="queue-info">
        <div class="queue-title">${escapeHtml(track.title)}</div>
        <div class="queue-artist">${escapeHtml(track.artist || "Unknown")} • ${track.source || "audius"}</div>
      </div>
      <div class="queue-actions">
        <button class="play-btn" onclick="playIndex(${i})">▶️</button>
        <button class="remove-btn" onclick="removeFromQueue(${i})">✕</button>
      </div>
    `;
    queueList.appendChild(div);
  });
}

function removeFromQueue(index) {
  if (index === currentIndex) {
    audio.pause();
    isPlaying = false;
  }
  queue.splice(index, 1);
  if (currentIndex >= queue.length) currentIndex = queue.length - 1;
  saveQueue();
  renderQueue();
}

function shuffleQueue() {
  for (let i = queue.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [queue[i], queue[j]] = [queue[j], queue[i]];
  }
  saveQueue();
  renderQueue();
}

function toggleRepeat() {
  repeatMode = (repeatMode + 1) % 3;
  const btn = document.getElementById("repeatBtn");
  if (repeatMode === 0) btn.style.opacity = "0.5";
  else if (repeatMode === 1) btn.style.opacity = "1";
  else btn.innerHTML = "🔂 Repeat One";
}

function clearQueue() {
  if (confirm("Clear entire queue?")) {
    queue = [];
    currentIndex = -1;
    audio.pause();
    isPlaying = false;
    saveQueue();
    renderQueue();
  }
}

function saveQueue() {
  localStorage.setItem("harmonyQueue", JSON.stringify(queue));
}

// Playback
function playTrack(track) {
  if (!track.url) {
    alert("No playable URL for this track");
    nextTrack();
    return;
  }
  
  audio.src = track.url;
  document.getElementById("currentTrackDisplay").textContent = `${track.title} - ${track.artist}`;
  document.getElementById("miniTitle").textContent = track.title;
  document.getElementById("miniArtist").textContent = track.artist || "Unknown";
  document.getElementById("miniQuality").textContent = track.quality || "192kbps";
  document.getElementById("nowTitle").textContent = track.title;
  document.getElementById("nowArtist").textContent = track.artist || "Unknown";
  document.getElementById("nowSource").textContent = (track.source || "audius").toUpperCase();
  document.getElementById("nowQuality").textContent = track.quality || "192kbps";
  
  audio.play().catch(err => {
    console.error("Playback error:", err);
    handleAudioError();
  });
  isPlaying = true;
  updatePlayButton();
  renderQueue();
}

function playIndex(index) {
  currentIndex = index;
  playTrack(queue[index]);
}

function togglePlay() {
  if (queue.length === 0) return;
  if (currentIndex === -1) {
    currentIndex = 0;
    playTrack(queue[0]);
  } else if (isPlaying) {
    audio.pause();
  } else {
    audio.play();
  }
}

function nextTrack() {
  if (queue.length === 0) return;
  currentIndex = (currentIndex + 1) % queue.length;
  playTrack(queue[currentIndex]);
}

function previousTrack() {
  if (queue.length === 0) return;
  if (audio.currentTime > 3) {
    audio.currentTime = 0;
  } else {
    currentIndex = (currentIndex - 1 + queue.length) % queue.length;
    playTrack(queue[currentIndex]);
  }
}

function updatePlayButton() {
  document.getElementById("mainPlayBtn").textContent = isPlaying ? "⏸️" : "▶️";
  document.getElementById("playBtn").textContent = isPlaying ? "⏸️ Pause" : "▶️ Play";
}

function updateProgress() {
  const current = audio.currentTime || 0;
  const duration = audio.duration || 0;
  
  if (duration > 0) {
    const percent = (current / duration) * 100;
    document.getElementById("progressFillMain").style.width = percent + "%";
  }
  
  document.getElementById("currentTime").textContent = formatTime(current);
  document.getElementById("duration").textContent = formatTime(duration);
  document.getElementById("currentTimeMain").textContent = formatTime(current);
  document.getElementById("durationMain").textContent = formatTime(duration);
}

function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// Settings
function showSettings() {
  const storageInfo = document.getElementById("storageInfo");
  const queueSize = (JSON.stringify(queue).length / 1024).toFixed(2);
  storageInfo.textContent = `Queue: ${queueSize} KB`;
}

function clearAllData() {
  if (confirm("Clear all data? (theme, quality, queue)")) {
    localStorage.clear();
    location.reload();
  }
}

// Initialize
renderQueue();
updatePlayButton();
showSettings();
