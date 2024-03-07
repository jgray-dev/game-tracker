const URL = "http://67.164.191.36:3000";

const defaultDisplay = {
  title: "Game Tracker",
  short_description: "A place to track your video game progress.",
  developer: "",
  publisher: "pub",
  thumbnail:
    "https://images.freeimages.com/clg/images/29/296330/red-down-arrow_f",
  release_date: "3/7/2024",
  platform: "Web",
};

//
// descP.innerHTML = `<b>Description</b>: ${game["short_description"]}<br><br>
//   <b>Release date</b>: ${game["release_date"]}<br><br>
//   <b>Platform</b>: ${game["platform"]}<br><br>
//   <b>Developer</b>: ${game["developer"]}<br><br>
//   <b>Publisher</b>: ${game["publisher"]}<br><br><br>
//   <b>Your comments</b>: ${game["comments"]}<br><br>`;

document.addEventListener("DOMContentLoaded", async () => {
  await buildPage();
  buildNav();
  gameForm();
});

async function getAllGames() {
  const response = await fetch(`${URL}/games`);
  return await response.json();
}

async function getLibraryGames() {
  const response = await fetch(`${URL}/library`);
  return await response.json();
}

async function buildPage() {
  // Loop all library games and call the displaygame function on them to add to page
  const library = await getLibraryGames();
  library.forEach((game) => {
    displayGame(game);
  });
  if (library.length === 0) {
    displayGame(defaultDisplay);
  }
}

async function buildNav() {
  let games = await getLibraryGames();
  const navbar = document.querySelector("#navbar");
  navbar.innerHTML = "";
  games.forEach((game) => {
    const newLink = document.createElement("a");
    newLink.href = `#game-${game.id}`;
    newLink.textContent = game.title;
    newLink.classList.add("link");
    navbar.append(newLink);
  });
  const addGameNav = document.createElement("a");
  addGameNav.href = "#new-game";
  addGameNav.textContent = "Add game";
  navbar.append(addGameNav);

  document.querySelectorAll("#navbar a").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      let targetId = this.getAttribute("href");
      let targetElement = document.querySelector(targetId);
      let position = targetElement.offsetTop - 110;
      window.scrollTo({
        top: position,
        left: 0,
        behavior: "smooth",
      });
    });
  });
}

async function gameForm() {
  const allGames = await getAllGames();
  const libraryGames = await getLibraryGames();
  const form = document.querySelector("#new-game");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (
      e.target.progress.value !== "" &&
      e.target.progress.value !== "" &&
      e.target["game-name"].value !== ""
    ) {
      // Check the form is filled out
      let targetGame;
      allGames.forEach((game) => {
        // Loop all games to check titles against the title submitted in the form
        const title = game.title;
        if (
          title
            .toLowerCase()
            .includes(e.target["game-name"].value.toLowerCase()) // To lowercase everything so case doesnt matter
        ) {
          targetGame = game; // if found, set the target game and break the loop using return
          return 0;
        }
      });
      if (targetGame) {
        const libraryNames = libraryGames.map((game) => {
          return game.title;
        });
        if (!libraryNames.includes(targetGame.title)) {
          const data = { ...targetGame }; // Close targetGame into new data to prevent memory reference issues
          data.progress = e.target.progress.value;
          data.comments = e.target.comments.value; // Manually add progress & comment fields to the data
          displayGame(data); // Add to our screen
          buildNav(); // rebuild our navbar to account for the new game
          fetch(`${URL}/library`, {
            // Post to library
            method: "post",
            body: JSON.stringify(data),
          }).then((r) => {
            console.log("Posted ", r);
          });
        } else {
          // User already has the game added
          alert("You already have that game added!");
          return -1;
        }
      } else {
        // Title search didn't return anything
        alert("No games were found with that title. Please try another");
        return -1;
      }
    } else {
      // Form isn't filled out, alert & return
      alert("Please fill out the form entirely before submitting!");
      return -1;
    }
  });
}

function displayGame(game) {
  const div = document.querySelector("#displaygames");
  const outerDiv = document.createElement("div");
  outerDiv.classList.add("section", "display", "row");
  outerDiv.id = `game-${game.id}`;
  const innerDiv = document.createElement("div");
  innerDiv.classList.add("col-12", "row");
  const displayDiv = document.createElement("div");
  displayDiv.classList.add("col-6");
  displayDiv.classList.add("displaydiv");
  const displaydiv = document.createElement("div");
  const displayh2 = document.createElement("h2");
  if (game["title"]) {
    displayh2.textContent = game["title"]; //WORKING
  }
  const displayimg = document.createElement("img");
  displayimg.src = game["thumbnail"];
  displayimg.addEventListener("click", () => {
    console.log("img clicked");
  });
  const descDiv = document.createElement("div");
  descDiv.classList.add("col-6", "row");
  const descP = document.createElement("p");
  descP.innerHTML = `<b>Description</b>: ${game["short_description"]}<br><br>
  <b>Release date</b>: ${game["release_date"]}<br><br>
  <b>Platform</b>: ${game["platform"]}<br><br>
  <b>Developer</b>: ${game["developer"]}<br><br>
  <b>Publisher</b>: ${game["publisher"]}<br><br><br>
  <b>Your comments</b>: ${game["comments"]}<br><br>`;
  displayDiv.append(displayh2);
  displayDiv.append(displayimg);
  innerDiv.append(displayDiv);
  if (game.id) {
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete game";
    deleteButton.addEventListener("click", () => {
      console.log("delete button clicked");
      deleteGame(game);
      location.reload();
    });
    displayDiv.append(deleteButton);
  }
  descDiv.append(descP);

  innerDiv.append(descDiv);
  const progressOuterDiv = document.createElement("div");
  progressOuterDiv.classList.add("progressbarouter");
  const progressInnerDiv = document.createElement("div");
  progressInnerDiv.classList.add("progressbar");
  progressInnerDiv.textContent = `${game["progress"]}%`; // JAVASCRIPT PROGRESS BAR HERE
  progressOuterDiv.append(progressInnerDiv);
  outerDiv.append(innerDiv);
  outerDiv.append(progressOuterDiv);
  div.append(outerDiv);
  // handleHover(progressInnerDiv, "Click to visit fortnite webpage");
  buildProgressbar(game, progressInnerDiv);
}

// TODO: Add a delete button to each element being displayed, and delete from library if clicked.
// TODO: Finish the progress bar
// TODO: Clean up

function deleteGame(game) {
  console.log(game.id);
  console.log(`${URL}/library/${game.id}`);
  fetch(`${URL}/library/${game.id}`, {
    method: "DELETE",
  }).catch((e) => {
    console.log("error:", e);
  });
}

function buildProgressbar(game, element) {
  console.log(element);
  const progress = parseInt(game.progress);
  element.style.width = `${progress}%`;
}

function handleHover(element, message) {
  console.log("handle hover called");
  element.addEventListener("mousemove", (event) => {
    const tooltip = document.getElementById("tooltip");
    tooltip.style.visibility = "visible";
    tooltip.classList.add("tooltip");
    tooltip.innerHTML = message;
    let x = event.clientX + window.scrollX;
    let y = event.clientY + window.scrollY;

    tooltip.style.left = x + 20 + "px";
    tooltip.style.top = y - 15 + "px";
    console.log(tooltip.style.left, tooltip.style.top);
  });
  element.addEventListener("mouseout", () => {
    // Mouse is off element, remove tooltip
    const tooltip = document.getElementById("tooltip");
    tooltip.style.visibility = "hidden";
  });
}
