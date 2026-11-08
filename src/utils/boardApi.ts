import type { Board } from '#shared/types/board'

export function fetchBoard() {
  return $fetch<Board>('/api/board')
}

export async function saveBoard(board: Board) {
  try {
    await $fetch('/api/board', { method: 'PUT', body: board })
  } catch (error) {
    console.warn('Could not save the board.', error)
  }
}
