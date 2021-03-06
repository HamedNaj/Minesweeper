import {
  TILE_STATUSES,
  createBoard,
  markTile,
  revealTile,
  checkWin,
  checkLose,
  revealAdjacentTile
} from './minesweeper.js'

const SIZES = {
  "beginner": {fontSize: '4rem', cellSize: '80px', boardSizeX: 7, boardSizeY: 10},
  "intermediate": {fontSize: '2rem', cellSize: '50px', boardSizeX: 9, boardSizeY: 15},
  "hard": {fontSize: '2rem', cellSize: '40px', boardSizeX: 12, boardSizeY: 20},
  "expert": {fontSize: '1.7rem', cellSize: '25px', boardSizeX: 15, boardSizeY: 30},
  "professional": {fontSize: '1.5rem', cellSize: '20px', boardSizeX: 20, boardSizeY: 40}
}

export let LOCK_GAME = false
let board
const boardElement = document.querySelector('.board')
const refresh = document.querySelector('.refresh')
const boardSizeElement = document.getElementById('boardSize')
const numberOfMines = document.getElementById('numberOfMines')
const startBtn = document.querySelector('#startBtn')

let BOARD_SIZE = {x: SIZES[boardSizeElement.value].boardSizeX, y: SIZES[boardSizeElement.value].boardSizeY}
let NUMBER_OF_MINES = 8

numberOfMines.value = NUMBER_OF_MINES

refresh.addEventListener('click', () => {
  refreshBoard()
})
startBtn.addEventListener('click', () => {

  if (numberOfMines.value < 1 || numberOfMines < 1) {
    window.alert('inputs are wrong')
    return
  }
  BOARD_SIZE = {x: SIZES[boardSizeElement.value].boardSizeX, y: SIZES[boardSizeElement.value].boardSizeY}
  NUMBER_OF_MINES = numberOfMines.value
  refreshBoard()
})


const minesLeftText = document.querySelector('[data-mine-count]')
refreshBoard()


boardElement.element, addEventListener('contextmenu', e => {
  e.preventDefault()
})


function listMinesLeft() {
  const markedTilesCount = board.reduce((count, row) => {
    return count + row.filter(tile => tile.status === TILE_STATUSES.MARKED).length
  }, 0)
  minesLeftText.textContent = NUMBER_OF_MINES - markedTilesCount
}

function checkGameEnd() {
  const win = checkWin(board)
  const lose = checkLose(board)
  if (win || lose) {
    LOCK_GAME = true
  }
  if (win) {
    refresh.textContent = '😎'
    board.forEach(row => {
      row.forEach(tile => {
        if (tile.mine) {
          tile.status = TILE_STATUSES.MARKED
        }
      })
    })
    listMinesLeft()
  }

  if (lose) {
    refresh.textContent = '☹'
    board.forEach(row => {
      row.forEach(tile => {
        if (tile.status === TILE_STATUSES.MARKED && !tile.mine) {
          tile.status = TILE_STATUSES.NUMBER
          tile.element.textContent = '❌'
          tile.element.style.color = 'red'
        }
        if (tile.mine) {
          tile.status = TILE_STATUSES.MINE
        }
      })
    })
  }
}


function refreshBoard() {
  const key = boardSizeElement.value
  boardElement.style.setProperty('--sizeX', SIZES[key].boardSizeX)
  boardElement.style.setProperty('--sizeY', SIZES[key].boardSizeY)
  boardElement.style.setProperty('--cellSize', SIZES[key].cellSize)
  boardElement.style.setProperty('--fontSize', SIZES[key].fontSize)
  minesLeftText.textContent = NUMBER_OF_MINES
  LOCK_GAME = false
  refresh.textContent = '😇'
  let child = boardElement.lastElementChild;
  while (child) {
    boardElement.removeChild(child);
    child = boardElement.lastElementChild;
  }
  board = createBoard({
    X: SIZES[boardSizeElement.value].boardSizeX,
    Y: SIZES[boardSizeElement.value].boardSizeY
  }, NUMBER_OF_MINES)
  board.forEach(row => {
    row.forEach(tile => {
      boardElement.append(tile.element)
      tile.element.style.fontSize = '70%'
      tile.element.addEventListener('click', () => {
        revealTile(board, tile)
        checkGameEnd()
      })
      tile.element.addEventListener('contextmenu', e => {
        e.preventDefault()
        markTile(tile)
        listMinesLeft()
      })
      tile.element.addEventListener('mouseup', e => {
        if (e.button === 1) {
          revealAdjacentTile(board, tile)
          checkGameEnd()
        }
      })
    })
  })
  listMinesLeft()
  return board
}
