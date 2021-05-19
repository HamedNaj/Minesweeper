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
  "beginner": {fontSize: '4rem', boardSizeX: 6, boardSizeY: 8, mines: 10},
  "intermediate": {fontSize: '2rem', boardSizeX: 9, boardSizeY: 12, mines: 20},
  "hard": {fontSize: '2rem', boardSizeX: 12, boardSizeY: 16, mines: 30},
  "expert": {fontSize: '1.7rem', boardSizeX: 18, boardSizeY: 24, mines: 60},
  "professional": {fontSize: '1.2rem', boardSizeX: 24, boardSizeY: 32, mines: 99}
}

export let LOCK_GAME = false
let board
const boardElement = document.querySelector('.board')
const refresh = document.querySelector('.refresh')
const boardSizeElement = document.getElementById('boardSize')
const numberOfMines = document.getElementById('numberOfMines')
const startBtn = document.querySelector('#startBtn')

let BOARD_SIZE = {x: SIZES[boardSizeElement.value].boardSizeX, y: SIZES[boardSizeElement.value].boardSizeY}
let NUMBER_OF_MINES = SIZES[boardSizeElement.value].mines
numberOfMines.value = NUMBER_OF_MINES

boardSizeElement.addEventListener('change', () => {
  NUMBER_OF_MINES = SIZES[boardSizeElement.value].mines
  numberOfMines.value = NUMBER_OF_MINES
})
refresh.addEventListener('click', () => {
  refreshBoard()
})
startBtn.addEventListener('click', () => {

  if (numberOfMines.value < 1 || numberOfMines < 1) {
    window.alert('inputs are wrong')
    return
  }
  BOARD_SIZE = {x: SIZES[boardSizeElement.value].boardSizeX, y: SIZES[boardSizeElement.value].boardSizeY}
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
  minesLeftText.textContent = numberOfMines.value - markedTilesCount
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
  boardElement.style.setProperty('--fontSize', SIZES[key].fontSize)
  minesLeftText.textContent = numberOfMines.value
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
  }, numberOfMines.value)
  board.forEach(row => {
    row.forEach(tile => {
      boardElement.append(tile.element)
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
