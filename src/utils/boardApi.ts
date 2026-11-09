import type { Board, CardChanges, ColumnChanges } from '#shared/types/board'

export const boardApi = {
  load() {
    return $fetch<Board>('/api/board')
  },

  addColumn(id: string, title: string) {
    return $fetch('/api/columns', { method: 'POST', body: { id, title } })
  },

  updateColumn(id: string, changes: ColumnChanges) {
    return $fetch(`/api/columns/${id}`, { method: 'PATCH', body: changes })
  },

  deleteColumn(id: string) {
    return $fetch(`/api/columns/${id}`, { method: 'DELETE' })
  },

  saveColumnOrder(columnIds: string[]) {
    return $fetch('/api/columns/order', { method: 'PUT', body: { ids: columnIds } })
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
