import './style.css'
import { BLOCK_SIZE, BOARD_WIDTH, BOARD_HEIGHT, EVENT_MOVEMENTS} from './consts.js'

// 1. Inicializar el canvas y el contexto
const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')
const $score = document.querySelector('span')



let score = 0

canvas.width = BLOCK_SIZE * BOARD_WIDTH
canvas.height = BLOCK_SIZE * BOARD_HEIGHT

context.scale(BLOCK_SIZE, BLOCK_SIZE)

// 3. board
const board = createBoard(BOARD_WIDTH, BOARD_HEIGHT)
function createBoard(width, height) {
  return Array(height).fill().map(()=>Array(width).fill(0))

}


//  4 piezas
const piece= {
  position:{ x: 5, y: 5},
  shape: [
    [1,1],
    [1,1]
  ]
}

// 9 ramdom piece
const PIECES = [
  [
    [1,1],
    [1,1]
  ],
  [
    [0,1,0],
    [1,1,1]
  ],
  [
    [1,0],
    [1,0],
    [1,1]
  ],
 
  [
    [0,1],
    [0,1],
    [1,1]
  ],
  [
    [1,1,0],
    [0,1,1]
  ],
  [
    [1,1,1,1] 
  ], 
  [
    [0,1,1,],
    [1,1,0]
  ]
]
   


// 2. game loop
// function update() {
//  draw()
//  window.requestAnimationFrame(update)

// }

// 8. auto drop
let dropCounter = 0
let lastTime =0

function update(time=0){
  const deltaTime = time - lastTime
  lastTime = time
  dropCounter += deltaTime
  if (dropCounter > 1000){
    piece.position.y++
    dropCounter = 0
    if(checkCollision()){
      piece.position.y--
      solidifyPiece()
      removeLines()
    }
  }
  draw()
  window.requestAnimationFrame(update)
}

function draw(){
  context.fillStyle = '#000'
  context.fillRect(0, 0, canvas.width, canvas.height)

  board.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value === 1) {
        context.fillStyle = 'yellow'
        context.fillRect(x, y, 1, 1)
      }
    })
  })
  piece.shape.forEach((row, y)=>{
    row.forEach((value, x)=>{
      if (value === 1) {
        context.fillStyle = 'red'
        context.fillRect(piece.position.x + x, piece.position.y + y, 1, 1)
      }
    })
  })
  $score.innerText = score
}

document.addEventListener('keydown', event=>{
  if (event.key === EVENT_MOVEMENTS.LEFT) {
    piece.position.x--
    if(checkCollision()){
      piece.position.x++
    }
  }
  if (event.key === EVENT_MOVEMENTS.RIGHT) {
    piece.position.x++
    if(checkCollision()){
      piece.position.x--
    }
  }

  if (event.key === EVENT_MOVEMENTS.DOWN) {
    piece.position.y++
    if(checkCollision()){
      piece.position.y--
      solidifyPiece()
      removeLines()
    }
  }

  if (event.key === EVENT_MOVEMENTS.UP) {
    const rotated= []

    for (let i = 0; i < piece.shape[0].length; i++){
      const row =[]
      for (let j= piece.shape.length -1; j >=0; j--){

      row.push(piece.shape[j][i])
    }
   rotated.push(row)
  }
  const previousShape = piece.shape
  piece.shape = rotated
  if(checkCollision()){
    piece.shape = previousShape
  }
}

})

function checkCollision(){
  return piece.shape.find((row,y)=>{ 
    return row.find((value,x)=>{
      return (
        value !== 0 && 
      
        board[y + piece.position.y]?.[x + piece.position.x] !== 0)
    })
  }
)}

function solidifyPiece(){
  piece.shape.forEach((row,y)=>{
    row.forEach((value,x)=>{
      if (value === 1) {
        board[y + piece.position.y][x + piece.position.x] = 1
      }
    })
  })

 

  // Reset the piece position
  piece.position.x = Math.floor(BOARD_WIDTH / 2 -2)
  piece.position.y = 0
  
  // 5. random piece
  piece.shape = PIECES[ Math.floor(Math.random() * PIECES.length)]

  // Check for game over
  if (checkCollision()) {
    
    alert('Game Over')
    board.forEach((row, y) => {
      row.fill(0)
    })
  }
}

function removeLines(){
  const rowsToRemove =[]

  board.forEach((row,y)=>{
    if (row.every(value => value === 1)){
     rowsToRemove.push(y)
    }
  })
  rowsToRemove.forEach(y=>{
    board.splice(y, 1)
    const newRow= Array(BOARD_WIDTH).fill(0)
    board.unshift(newRow)
    score += 10
  })
}
const $section = document.querySelector('section')
$section.addEventListener('click', () =>{

update()
$section.remove()
const Audio = new window.Audio('./public/tetris.mp3')
Audio.volume = 0.1
Audio.play()

})