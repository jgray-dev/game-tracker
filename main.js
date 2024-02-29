const wishListGame = () => {
    fetch('http://localhost:3000/games')
    .then(res => res.json())
    .then(data => {
        const result = data.filter((game) => {
            return game.title == 'Diablo Immortal'
        })
        const img = document.querySelector('#wishlist-name')
        const name= document.querySelector("#wishlist-name")
        const developer= document.querySelector("#wishlist-developer")
        const release = document.querySelector("#wishlist-release")
        img.src = result[0].thumbnail
        name.textContent = result[0].title
        developer.textContent = result[0].developer
        release.textContent = result[0].release_date
        console.log(result[0])
        console.log(developer)
    })
}

const addGame = () => {
    const form = document.querySelector('#new-game')
    form.addEventListener('submit', (e) => {
        e.preventDefault()
        const data = {}
        data.name = e.target.name.value
        data.progress = e.target.restaurant.value
        data.comments = e.target.image.value
        fetch('http://localhost:3000/library', {
            method: "post",
            body: JSON.stringify(data)
        })
  })
}

wishListGame()
addGame()