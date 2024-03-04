const wishListGame = () => {
    fetch('http://localhost:3000/games')
    .then(res => res.json())
    .then(data => {
        const result = data.filter((game) => {
            return game.title == 'Diablo Immortal'
        })
        const img = document.querySelector('#wishlist-image')
        const name= document.querySelector("#wishlist-name")
        const developer= document.querySelector("#wishlist-developer")
        const release = document.querySelector("#wishlist-release")
        img.src = result[0].thumbnail
        name.textContent = result[0].title
        developer.textContent = result[0].developer
        release.textContent = result[0].release_date
    })
}

const addGame = () => {
    const form = document.querySelector('#new-game')
    form.addEventListener('submit', (e) => {
        e.preventDefault()
        const data = {}
        data.name = e.target["game-name"].value
        data.progress = e.target.progress.value
        data.comments = e.target.comments.value
        fetch('http://localhost:3000/library', {
            method: "post",
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(data => console.log(data))
  })
}

wishListGame()
addGame()