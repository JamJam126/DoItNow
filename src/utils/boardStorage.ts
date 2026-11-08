import type { Board } from '#shared/types/board'

const storageKey = 'doitnow:board'

export function loadBoard(): Board | null {
  try {
    const saved = localStorage.getItem(storageKey)
    if (!saved) return null

    const board = JSON.parse(saved) as Board
    return board.version === 1 ? board : null
  } catch {
    return null
  }
}

export function saveBoard(board: Board) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(board))
  } catch {
    console.warn('Could not save the board to browser storage.')
  }
}
