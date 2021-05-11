const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
const sp1 = document.getElementById('sp1')
const sp2 = document.getElementById('sp2')
const div1 = document.getElementById('div1')
const div2 = document.getElementById('div2')
const div3 = document.getElementById('div3')
const startGame = document.getElementById('startGame')
const gameOverScore = document.getElementById('gameOverScore')
const gameOverScoreText = document.getElementById('gameOverScoreText')

const startsound = new Audio('start.mp3')
const gamesound = new Audio('game.mp3')
const smallsound = new Audio('smallsound.mp3')
const blastsound = new Audio('blast.mp3')
const oversound = new Audio('over.mp3')

canvas.width = innerWidth
canvas.height = innerHeight

setTimeout(() => {
    startsound.play()
    startsound.loop = true
}, 1000)

//circle--
let ball = {
    position: V(canvas.width / 2, canvas.height / 2),
}
let dx = Math.random() < 0.5 ? 3 : -3
let dy = Math.random() < 0.5 ? 2 : -2
let ds = 1.05
let dq;
//paddle/player--
let velocity = 0
let dt = 10
let minY = 5
let maxY = 470

class Circle {
    constructor(x, y, r, color) {
        this.x = x
        this.y = y
        this.r = r
        this.color = color
    }
    draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false)
        ctx.fillStyle = this.color
        ctx.fill()
    }
    update() {
        this.draw()
        if (this.y + this.r > innerHeight || this.y - this.r < 0) {
            dy = -dy
        }
        this.x += dx
        this.y += dy
    }
}

class Paddle {
    constructor(x, y, width, height, upKey, downKey, velocity) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.upKey = upKey
        this.downKey = downKey
        this.velocity = velocity
    }
    draw() {
        ctx.fillStyle = 'white'
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }
    move() {
        this.draw()
        this.y += this.velocity * dt
    }
}

let circle = new Circle(ball.position.x, ball.position.y, 30, 'red')
circle.draw()

// Players--
let player1 = new Paddle(50, 220, 20, 80, 'w', 's', velocity)
player1.draw()
let player2 = new Paddle(1170, 220, 20, 80, 'ArrowUp', 'ArrowDown', velocity)
player2.draw()

function movePlayer() {
    if (player1.y >= maxY) {
        player1.velocity = 0
        player1.downKey = '8'
        setTimeout(() => {
            player1.downKey = 's'
        }, 1000)
    }
    if (player1.y <= minY) {
        player1.velocity = 0
        player1.upKey = '7'
        setTimeout(() => {
            player1.upKey = 'w'
        }, 1000)
    }
    if (player2.y >= maxY) {
        player2.velocity = 0
        player2.downKey = '6'
        setTimeout(() => {
            player2.downKey = 'ArrowDown'
        }, 1000)
    }
    if (player2.y <= minY) {
        player2.velocity = 0
        player2.upKey = '5'
        setTimeout(() => {
            player2.upKey = 'ArrowUp'
        }, 1000)
    }
    else {
        window.addEventListener('keydown', (e) => {
            let key = e.key
            if (key === player1.upKey) {
                player1.velocity = -0.5
            }
            else if (key === player1.downKey) {
                player1.velocity = 0.5
            }
            else if (key === player2.upKey) {
                player2.velocity = -0.5
            }
            else if (key === player2.downKey) {
                player2.velocity = 0.5
            }
        })
    }
}

window.addEventListener('keyup', (e) => {
    let key = e.key
    if (key === player1.upKey || key === player1.downKey) {
        player1.velocity = 0
    }
    else if (key === player2.upKey || key === player2.downKey) {
        player2.velocity = 0
    }
})

let animationId;
let sp1t = 0;
let sp2t = 0;

function collide() {
    if (player1.x + player1.width >= circle.x - circle.r && player1.y < circle.y + circle.r + 8 && player1.y + player1.height > circle.y - circle.r - 8) {
        dq = -dx * ds
        dx = Math.abs(dq) <= 17 ? dx = -dx * ds : dx = -dx;
        sp1t += 10
        sp1.innerHTML = sp1t
        smallsound.play()
    }
    if (player2.x <= circle.x + circle.r && player2.y < circle.y + circle.r + 8 && player2.y + player2.height > circle.y - circle.r - 8) {
        dq = -dx * ds
        dx = Math.abs(dq) <= 17 ? dx = -dx * ds : dx = -dx;
        sp2t += 10
        sp2.innerHTML = sp2t
        smallsound.play()
    }
}


function animate() {
    animationId = requestAnimationFrame(animate)
    ctx.fillStyle = 'rgba(53, 53, 53,0.4)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    circle.update()
    player1.move()
    player2.move()
    movePlayer()
    collide()

    if (circle.x + circle.r + 2 > innerWidth || circle.x - circle.r - 2 < 0) {
        setTimeout(() => {
            cancelAnimationFrame(animationId)
            blastsound.play()
            gamesound.pause()
            oversound.play()
            
            if (sp1t > sp2t) { w = 1 }
            else if (sp1t < sp2t) { w = 2 }
            else {
                if (canvas.width / 2 > circle.x) { w = 2 }
                else { w = 1 }
            }
            div1.style.display = 'none'
            div2.style.display = 'none'
            div3.style.display = 'block'
            gameOverScore.innerHTML = `Player ${w} Wins!`
            gameOverScoreText.innerHTML = `Congrats! 👏`
            startGame.innerHTML = 'Play Again!'
            setTimeout(() => {
                startsound.play()
            }, 3000)
            gamesound.currentTime = 0

        }, 0)
    }

}

function init() {
    sp1t = 0;
    sp1.innerHTML = 0;
    sp2t = 0;
    sp2.innerHTML = 0;
    circle = new Circle(ball.position.x, ball.position.y, 30, 'red')
    player1 = new Paddle(50, 220, 20, 80, 'w', 's', velocity)
    player2 = new Paddle(1170, 220, 20, 80, 'ArrowUp', 'ArrowDown', velocity)
}

startGame.addEventListener('click', () => {
    init()
    animate()
    startsound.pause()
    startsound.currentTime = 0
    gamesound.play()
    gamesound.loop = true
    div1.style.display = 'block'
    div2.style.display = 'block'
    div3.style.display = 'none'
})

