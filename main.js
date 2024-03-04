const URL = "http://67.164.191.36";

const wishListGame = () => {
  fetch(`${URL}/games`)
    .then((res) => res.json())
    .then((data) => {
      const result = data.filter((game) => {
        return game.title === "Diablo Immortal";
      });
      const img = document.querySelector("#wishlist-name");
      const name = document.querySelector("#wishlist-name");
      const developer = document.querySelector("#wishlist-developer");
      const release = document.querySelector("#wishlist-release");
      img.src = result[0].thumbnail;
      name.textContent = result[0].title;
      developer.textContent = result[0].developer;
      release.textContent = result[0].release_date;
      console.log(result[0]);
      console.log(developer);
    });
};

const addGame = () => {
  const form = document.querySelector("#new-game");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = {};
    data.name = e.target["game-name"].value;
    data.progress = e.target.progress.value;
    data.comments = e.target.comments.value;
    console.log(data);
    fetch(`${URL}/library`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
    }).then((r) => {
      console.log("posted?");
      console.log(r);
    });
  });
};

wishListGame();
addGame();
