import type { Card } from '#shared/types/board'
import type { TableField } from '~/composables/useTableFields'

export type SortKey = 'title' | TableField

export interface TableSort {
  key:         SortKey
  descending:  boolean
}

const priorityRank = { urgent: 0, high: 1, medium: 2, low: 3 }

const sortValues: Record<SortKey, (card: Card) => string | number | null> = {
  title:        (card) => card.title.toLowerCase(),
  description:  (card) => card.description.toLowerCase() || null,
  due:          (card) => card.dueDate,
  priority:     (card) => (card.priority ? priorityRank[card.priority] : null),
  created:      (card) => card.createdAt,
}

export function sortRows<Row extends { card: Card }>(rows: Row[], sort: TableSort) {
  const valueOf = sortValues[sort.key]
  const direction = sort.descending ? -1 : 1
  const order = new Map(rows.map((row, index) => [row.card.id, index]))

  return [...rows].sort((a, b) => {
    const left = valueOf(a.card)
    const right = valueOf(b.card)

    if (left === right) return (order.get(a.card.id) ?? 0) - (order.get(b.card.id) ?? 0)
    if (left === null) return 1
    if (right === null) return -1
    return (left < right ? -1 : 1) * direction
  })
}

export function findMovedIndex(before: string[], after: string[]) {
  const added = after.findIndex((id) => !before.includes(id))
  if (added !== -1) return added
  if (before.length !== after.length) return -1

  const first = before.findIndex((id, index) => id !== after[index])
  if (first === -1) return -1

  let last = before.length - 1
  while (before[last] === after[last]) last--

  return after[first] === before[last] ? first : last
}
