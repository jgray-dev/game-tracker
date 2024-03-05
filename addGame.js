document.addEventListener("DOMContentLoaded", () => {
  gameForm();
});

async function getAllGames() {
  const response = await fetch(`${URL}/games`);
  return await response.json();
}

async function gameForm() {
  const allGames = await getAllGames();
  console.log(allGames);
  const form = document.querySelector("#new-game");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = {};
    data.name = e.target["game-name"].value;
    data.progress = e.target.progress.value;
    data.comments = e.target.comments.value;
    let targetGame;
    allGames.forEach((game) => {
      const title = game.title;
      if (
        title.toLowerCase().includes(e.target["game-name"].value.toLowerCase())
      ) {
        targetGame = game;
        return 0;
      }
    });
    if (targetGame) {
      console.log(targetGame);
      data.name = targetGame.title;
    } else {
      console.log("No game found:");
    }
    fetch(`${URL}/library`, {
      method: "post",
      body: JSON.stringify(data),
    }).then((res) => res.json());
  });
}

function displayGame(game) {
  const div = document.querySelector("#displaygames");
  const outerDiv = document.createElement("div");
  outerDiv.classList.add("section", "display", "row");
  outerDiv.id = game.id;
  const innerDiv = document.createElement("div");
  innerDiv.classList.add("col-12", "row");
  const displayDiv = document.createElement("div");
  displayDiv.classList.add("col-5");
  const displaydiv = document.createElement("div");
  const displayh2 = document.createElement("h2");
  displayh2.textContent = game["title"];
  const displayimg = document.createElement("img");
  displayimg.src = game["thumbnail"];
  const descDiv = document.createElement("div");
  const descP = document.createElement("p");
  descP.textContent = game["description"];
  displayDiv.append(displayh2);
  displayDiv.append(displayimg);
  innerDiv.append(displayDiv);
  descDiv.append(descP);
  innerDiv.append(descDiv);
  const pbOuterDiv = document.createElement("div");
  const pbInnerDiv = document.createElement("div");
  pbOuterDiv.append(pbInnerDiv);
  outerDiv.append(innerDiv);
  outerDiv.append(pbOuterDiv);
}