// Player state
let queue = JSON.parse(localStorage.getItem("harmonyQueue") || "[]");
let currentIndex = -1;
let isPlaying = false;

const audio = document.getElementById("audioPlayer");
const resultsDiv = document.getElementById("results");
const searchInput = document.getElementById("searchInput");

// Initialize event listeners
audio.addEventListener("ended", nextTrack);
audio.addEventListener("timeupdate", updateProgress);
audio.addEventListener("play", () => {
  isPlaying = true;
  updatePlayButton();
});
audio.addEventListener("pause", () => {
  isPlaying = false;
  updatePlayButton();
});

searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") performSearch();
});

// View switching
function switchView(view) {
  // Hide all views
  document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
  document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
  
  // Show selected view
  document.getElementById(view + "View").classList.add("active");
  event.target.classList.add("active");
  
  // Render queue when switching to queue view
  if (view === "queue") renderQueue();
}

// Search functionality
function performSearch() {
  const query = searchInput.value.trim();
  if (!query) return;
  
  resultsDiv.innerHTML = '<div class="loading">Searching...</div>';
  
  fetch(`/api/search?q=${encodeURIComponent(query)}`)
    .then(r => r.json())
    .then(data => {
      resultsDiv.innerHTML = "";
      
      if (!data.data || data.data.length === 0) {
        resultsDiv.innerHTML = '<div class="no-results">No results found</div>';
        return;
      }
      
      data.data.forEach((track, idx) => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
          <div class="card-inner">
            <div class="card-info">
              <div class="card-title">${escapeHtml(track.title)}</div>
              <div class="card-artist">${escapeHtml(track.artist || "Unknown")}</div>
            </div>
            <button class="card-btn" onclick="addToQueue(${idx})">+</button>
          </div>
        `;
        resultsDiv.appendChild(card);
      });
      
      // Store search results globally
      window.lastSearchResults = data.data;
    })
    .catch(err => {
      console.error("Search failed:", err);
      resultsDiv.innerHTML = '<div class="error">Search failed. Try again.</div>';
    });
}

// Queue management
function addToQueue(index) {
  if (!window.lastSearchResults || !window.lastSearchResults[index]) return;
  
  const track = window.lastSearchResults[index];
  queue.push(track);
  saveQueue();
  
  // Auto-play if nothing is playing
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
        <div class="queue-artist">${escapeHtml(track.artist || "Unknown")}</div>
      </div>
      <div class="queue-actions">
        <button onclick="playIndex(${i})" class="play-btn">▶</button>
        <button onclick="removeFromQueue(${i})" class="remove-btn">✕</button>
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
  if (currentIndex >= queue.length) {
    currentIndex = queue.length - 1;
  }
  
  saveQueue();
  renderQueue();
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

// Playback control
function playTrack(track) {
  if (!track.stream_url) {
    alert("No playable URL available for this track");
    return;
  }
  
  audio.src = track.stream_url;
  document.getElementById("currentTrackDisplay").textContent = 
    `${track.title} - ${track.artist}`;
  document.getElementById("miniTitle").textContent = track.title;
  document.getElementById("miniArtist").textContent = track.artist || "Unknown";
  document.getElementById("nowTitle").textContent = track.title;
  document.getElementById("nowArtist").textContent = track.artist || "Unknown";
  
  audio.play();
  isPlaying = true;
  updatePlayButton();
}

function playIndex(index) {
  currentIndex = index;
  playTrack(queue[index]);
  renderQueue();
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
  renderQueue();
}

function previousTrack() {
  if (queue.length === 0) return;
  currentIndex = (currentIndex - 1 + queue.length) % queue.length;
  playTrack(queue[currentIndex]);
  renderQueue();
}

function updatePlayButton() {
  const btn = document.getElementById("mainPlayBtn");
  const btn2 = document.getElementById("playBtn");
  btn.textContent = isPlaying ? "⏸" : "▶";
  if (btn2) btn2.textContent = isPlaying ? "⏸ Pause" : "▶ Play";
}

function updateProgress() {
  const current = audio.currentTime || 0;
  const duration = audio.duration || 0;
  
  if (duration > 0) {
    const percent = (current / duration) * 100;
    document.getElementById("progressFill").style.width = percent + "%";
  }
  
  document.getElementById("currentTime").textContent = formatTime(current);
  document.getElementById("duration").textContent = formatTime(duration);
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

// Initialize
renderQueue();
