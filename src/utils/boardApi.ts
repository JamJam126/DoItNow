import type { Board, BoardSummary, CardChanges, ColumnChanges } from '#shared/types/board'

export const boardApi = {
  listBoards() {
    return $fetch<BoardSummary[]>('/api/boards')
  },

  createBoard(id: string, name: string) {
    return $fetch('/api/boards', { method: 'POST', body: { id, name } })
  },

  loadBoard(id: string) {
    return $fetch<Board>(`/api/boards/${id}`)
  },

  renameBoard(id: string, name: string) {
    return $fetch(`/api/boards/${id}`, { method: 'PATCH', body: { name } })
  },

  deleteBoard(id: string) {
    return $fetch(`/api/boards/${id}`, { method: 'DELETE' })
  },

  saveColumnOrder(boardId: string, columnIds: string[]) {
    return $fetch(`/api/boards/${boardId}/columns`, { method: 'PUT', body: { ids: columnIds } })
  },

  addColumn(id: string, boardId: string, title: string) {
    return $fetch('/api/columns', { method: 'POST', body: { id, boardId, title } })
  },

  updateColumn(id: string, changes: ColumnChanges) {
    return $fetch(`/api/columns/${id}`, { method: 'PATCH', body: changes })
  },

  deleteColumn(id: string) {
    return $fetch(`/api/columns/${id}`, { method: 'DELETE' })
  },

  saveCardOrder(columnId: string, cardIds: string[]) {
    return $fetch(`/api/columns/${columnId}/cards`, { method: 'PUT', body: { ids: cardIds } })
  },

  addCard(id: string, columnId: string, title: string) {
    return $fetch('/api/cards', { method: 'POST', body: { id, columnId, title } })
  },

  updateCard(id: string, changes: CardChanges) {
    return $fetch(`/api/cards/${id}`, { method: 'PATCH', body: changes })
  },

  deleteCard(id: string) {
    return $fetch(`/api/cards/${id}`, { method: 'DELETE' })
  },
}
