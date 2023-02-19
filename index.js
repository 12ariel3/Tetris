const grid = document.querySelector(".grid")
let squares = Array.from(document.querySelectorAll('.grid div'))
const scoreDisplay = document.querySelector('#score-span')
const startBtn = document.querySelector('#start-button')
const paused = document.querySelector('.paused')
const gameOverContainer = document.querySelector('.gameOverContainer')
const width = 10
let nextRandom = 0
let score = 0
let gameOverValue = false

//The Tetrominoes
const lTetromino = [
    [1, 2, 1+width, 1+(width*2)],
    [width, 1+width, 2+width, 2+(width*2)],
    [width*2, 1, 1+width,  1+(width*2)],
    [width, width*2, 1+(width*2), 2+(width*2)]
]

const zTetromino = [
    [0,width,width+1,width*2+1],
    [width+1, width+2,width*2,width*2+1],
    [0,width,width+1,width*2+1],
    [width+1, width+2,width*2,width*2+1]
]

const tTetromino = [
    [1,width,width+1,width+2],
    [1,width+1,width+2,width*2+1],
    [width,width+1,width+2,width*2+1],
    [1,width,width+1,width*2+1]
]

const oTetromino = [
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1]
]

const iTetromino = [
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3],
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3]
]

const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]


let currentPosition = 4
let currentRotation = 0


//randomly select a tetromino and its first rotation

let random = Math.floor(Math.random()*theTetrominoes.length)
let current = theTetrominoes[random][currentRotation]


//draw the tetromino

function draw(){
    if(!gameOverValue){
        if(random == 0){
            current.forEach(index => {
                squares[currentPosition + index].classList.add('lTetromino')
            })
        }
        if(random == 1){
            current.forEach(index => {
                squares[currentPosition + index].classList.add('zTetromino')
            })
        }
        if(random == 2){
            current.forEach(index => {
                squares[currentPosition + index].classList.add('tTetromino')
            })
        }
        if(random == 3){
            current.forEach(index => {
                squares[currentPosition + index].classList.add('oTetromino')
            })
        }
        if(random == 4){
            current.forEach(index => {
                squares[currentPosition + index].classList.add('iTetromino')
            })
        }
    }
}

draw()

//undraw the tetromino

function undraw(){
    current.forEach(index => {
        squares[currentPosition + index].classList.remove('lTetromino', 'zTetromino', 'tTetromino', 'oTetromino', 'iTetromino')
    })
}


//make the tetromino move down every second



// timerId = setInterval(moveDown, 1000)

//assign functions to keyCodes

function control(e){
    if(e.keyCode == 37){
        moveLeft()
    }
    if(e.keyCode == 38){
        rotate()
    }
    if(e.keyCode == 39){
        moveRight()
    }
    if(e.keyCode == 40){
        acelerate()
    }
}

function moveDown(){
    freeze()
    undraw()
    currentPosition += width
    draw()
    freeze()
    addScore()
}

//freeze function 

function freeze(){
    if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))){
        current.forEach(index => squares[currentPosition + index].classList.add('taken'))
        
        //start new tetromino falling
        random = nextRandom
        nextRandom = Math.floor(Math.random()* theTetrominoes.length)
        current = theTetrominoes[random][currentRotation]
        currentPosition = 4
        displayShape()
        gameOver()
        draw()
    }
}

//move the tetromino left, unless is at the edge or there is a blockage

function moveLeft(){
    undraw()
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
    
    if(!isAtLeftEdge) currentPosition -= 1
    
    if(current.some(index => squares[currentPosition + index].classList.contains('taken')))
    currentPosition += 1
    
    draw()
}


//move the tetromino right, unless is at the edge or there is a blockage

function moveRight(){
    undraw()
    const isAtRightEdge = current.some(index => (currentPosition + index) % width === width -1)
    
    if(!isAtRightEdge) currentPosition += 1
    
    if(current.some(index => squares[currentPosition + index].classList.contains('taken')))
    currentPosition -= 1
    
    draw()
}


function acelerate(){
    if(currentPosition > 19){
        undraw()
        currentPosition += width
        
        if(current.some(index => squares[currentPosition + index].classList.contains('taken')))
        currentPosition -= width
        
        draw()
    }
}

function rotate(){
    undraw()
    currentRotation ++
    if(currentRotation == current.length){
        currentRotation = 0
    }
    current = theTetrominoes[random][currentRotation]
    draw()
}

//show up-next tetromino in mini-grid display

const displaySquares = document.querySelectorAll('.mini-grid div')
const displayWidth = 4
let displayIndex = 0

//the tetrominos without rotations

const upNextTetrominoes = [
    [1, displayWidth+1, (displayWidth*2)+1, 2], //lTetromino
    [0, displayWidth, displayWidth+1, (displayWidth*2)+1], //zTetromino
    [1, displayWidth, displayWidth+1, displayWidth+2], //tTetromino
    [0, 1, displayWidth, displayWidth+1], //oTetromino
    [1, displayWidth+1, (displayWidth*2)+1, (displayWidth*3)+1] //iTetromino
]


//display the shape in the mini-grid display

function displayShape(){
    //remove any trace of a tetromino from the entire mini-grid
    displaySquares.forEach(square =>{
        square.classList.remove('lTetromino', 'zTetromino', 'tTetromino', 'oTetromino', 'iTetromino')
    })
    if(nextRandom == 0){
        upNextTetrominoes[nextRandom].forEach(index =>{
            displaySquares[displayIndex + index].classList.add('lTetromino')
        })
    }
    if(nextRandom == 1){
        upNextTetrominoes[nextRandom].forEach(index =>{
            displaySquares[displayIndex + index].classList.add('zTetromino')
        })
    }
    if(nextRandom == 2){
        upNextTetrominoes[nextRandom].forEach(index =>{
            displaySquares[displayIndex + index].classList.add('tTetromino')
        })
    }
    if(nextRandom == 3){
        upNextTetrominoes[nextRandom].forEach(index =>{
            displaySquares[displayIndex + index].classList.add('oTetromino')
        })
    }
    if(nextRandom == 4){
        upNextTetrominoes[nextRandom].forEach(index =>{
            displaySquares[displayIndex + index].classList.add('iTetromino')
        })
    }
}

//add functionality to the button

startBtn.addEventListener('click', ()=>{
    if(startBtn.innerHTML == "Pause"){
        clearInterval(timerId)
        document.removeEventListener('keyup', control)
        startBtn.innerHTML = "Continue"  
        paused.style.display = "block"
    }else if(startBtn.innerHTML == "Continue" || startBtn.innerHTML == "Start"){
        timerId = setInterval(moveDown, 1000)
        document.addEventListener("keyup", control)
        startBtn.innerHTML = "Pause"
        paused.style.display = "none"
    } 
})


//add score

function addScore(){
     for(let i = 0; i < 199; i += width){
        const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

        if(row.every(index => squares[index].classList.contains('taken'))){
            score += 10
            scoreDisplay.innerHTML = score
            row.forEach(index=>{
                squares[index].classList.remove('taken')
                squares[index].classList.remove('lTetromino', 'zTetromino', 'tTetromino', 'oTetromino', 'iTetromino')
            })

            const squaresRemoved = squares.splice(i, width)
            squares = squaresRemoved.concat(squares)
            squares.forEach(cell => grid.appendChild(cell))
        }
     }
}

//game over

function gameOver(){
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
        clearInterval(timerId)
        document.removeEventListener('keyup', control)
        gameOverContainer.style.display = 'grid'
        gameOverValue = true
    }
}

draw()
displayShape()