let queue = JSON.parse(localStorage.getItem("queue") || "[]");
let currentIndex = 0;

function save(){
  localStorage.setItem("queue", JSON.stringify(queue));
}

function search(){
  const q = document.getElementById("q").value;

  fetch("/api/audius?q=" + q)
    .then(r => r.json())
    .then(data => {
      const results = document.getElementById("results");
      results.innerHTML = "";

      data.data.slice(0,10).forEach(t => {
        const div = document.createElement("div");
        div.className = "card";
        div.innerHTML = `${t.title}`;

        div.onclick = () => {
          queue.push(t);
          save();
          play(t);
          renderQueue();
        };

        results.appendChild(div);
      });
    });
}

function play(t){
  const audio = document.getElementById("audio");

  document.getElementById("now").innerText = t.title;

  audio.src = t.stream_url || "";
  audio.play();
}

function renderQueue(){
  const q = document.getElementById("queueList");
  if(!q) return;

  q.innerHTML = "";

  queue.forEach((t,i) => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerText = t.title;

    div.onclick = () => play(t);

    q.appendChild(div);
  });
}
