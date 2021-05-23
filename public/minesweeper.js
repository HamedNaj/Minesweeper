import {LOCK_GAME} from './script.js'

export const TILE_STATUSES = {
  HIDDEN: 'hidden',
  MINE: 'mine',
  NUMBER: 'number',
  MARKED: 'marked'
}

export function createBoard({X,Y}, numberOfMines) {
  const board = []
  const minePositions = getMinePositions({X,Y}, numberOfMines)
  for (let x = 0; x < X; x++) {
    const row = []
    for (let y = 0; y < Y; y++) {
      const element = document.createElement('div')
      element.dataset.status = TILE_STATUSES.HIDDEN
      const tile = {
        x, y, mine: minePositions.some(positionMatch.bind(null, {x, y}))
        , element, get status() {
          return this.element.dataset.status
        }, set status(value) {
          this.element.dataset.status = value
        }
      }
      row.push(tile)
    }
    board.push(row)
  }
  return board
}

export function markTile(tile) {
  if (LOCK_GAME) return
  if (tile.status !== TILE_STATUSES.HIDDEN && tile.status !== TILE_STATUSES.MARKED) {
    return
  }
  if (tile.status === TILE_STATUSES.MARKED) {
    tile.status = TILE_STATUSES.HIDDEN
  } else {
    tile.status = TILE_STATUSES.MARKED
  }
}

export function revealTile(board, tile) {
  if (LOCK_GAME) return
  if (tile.status !== TILE_STATUSES.HIDDEN) {
    return
  }
  if (tile.mine) {
    tile.status = TILE_STATUSES.MINE
    return
  }
  tile.status = TILE_STATUSES.NUMBER
  const adjacentTile = nearbyTiles(board, tile)
  const mines = adjacentTile.filter(t => t.mine)
  if (!mines.length) {
    adjacentTile.forEach(revealTile.bind(null, board))
  } else {
    tile.element.textContent = mines.length
  }
}

export function revealAdjacentTile(board, tile) {
  if (LOCK_GAME) return
  if (tile.status !== TILE_STATUSES.NUMBER) {
    return
  }
  const adjacentTile = nearbyTiles(board, tile)
  const mines = adjacentTile.filter(t => t.mine)
  const marked = adjacentTile.filter(t => t.status === TILE_STATUSES.MARKED)
  if (mines.length === marked.length)
    adjacentTile.forEach(revealTile.bind(null, board))

}

function getMinePositions({X,Y}, numberOfMines) {
    const positions = []
  while (positions.length < numberOfMines) {
    const position = {x: randomNumber(X), y: randomNumber(Y)}
    if (!positions.some(p => positionMatch(p, position))) {
      positions.push(position)
    }
  }
  return positions
}

function randomNumber(size) {
  return Math.floor(Math.random() * size)
}

function positionMatch(a, b) {
  return a.x === b.x && a.y === b.y

}

function nearbyTiles(board, {x, y}) {
  const tiles = []
  for (let X = -1; X <= 1; X++) {
    for (let Y = -1; Y <= 1; Y++) {
      const tile = board[x + X] && board[x + X][y + Y]
      if (tile) tiles.push(tile)
    }
  }
  return tiles
}

export function checkWin(board) {
  return board.every(row => {
    return row.every(tile => {
      return tile.status === TILE_STATUSES.NUMBER ||
        (tile.mine && tile.status === TILE_STATUSES.HIDDEN ||
          tile.status === TILE_STATUSES.MARKED)
    })
  })
}

export function checkLose(board) {
  return board.some(row => {
    return row.some(tile => {
      return tile.status === TILE_STATUSES.MINE
    })
  })
}



















