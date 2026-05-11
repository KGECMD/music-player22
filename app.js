let queue = [];
let current = null;

function view(v){
  document.querySelectorAll(".view").forEach(x => x.classList.remove("active"));
  document.getElementById(v+"View").classList.add("active");
}

async function search(){
  const q = document.getElementById("q").value;

  const res = await fetch("/api/audius?q="+q);
  const data = await res.json();

  const results = document.getElementById("results");
  results.innerHTML = "";

  data.data.slice(0,10).forEach(track => {
    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <b>${track.title}</b><br/>
      <small>${track.user?.name || ""}</small>
    `;

    div.onclick = () => play(track);

    results.appendChild(div);
  });
}

function play(track){
  current = track;

  document.getElementById("now").innerText =
    track.title;

  // Audius full playback (REAL audio)
  document.getElementById("audius").src =
    "https://audius.co/embed/track/"+track.id;

  queue.push(track);
  renderQueue();
}

function renderQueue(){
  const q = document.getElementById("queue");
  q.innerHTML = "";

  queue.forEach(t => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerText = t.title;
    q.appendChild(div);
  });
}
