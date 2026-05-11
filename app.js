let queue = [];

function view(v){
  document.querySelectorAll(".view")
    .forEach(x => x.classList.remove("active"));

  document.getElementById(v).classList.add("active");
}

async function search(){
  const q = document.getElementById("q").value;

  const res = await fetch("/api/audius?q=" + q);
  const data = await res.json();

  const results = document.getElementById("results");
  results.innerHTML = "";

  data.forEach(t => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `${t.title} - ${t.artist}`;

    div.onclick = () => play(t);

    results.appendChild(div);
  });
}

function play(t){
  document.getElementById("now").innerText = t.title;

  const audio = document.getElementById("audio");
  audio.src = t.stream;
  audio.play();

  queue.push(t);
  renderQueue();
}

function renderQueue(){
  const q = document.getElementById("queueList");
  q.innerHTML = "";

  queue.forEach(t => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerText = t.title;
    q.appendChild(div);
  });
}
