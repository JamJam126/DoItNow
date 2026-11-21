import type { Card, Column, Priority } from '#shared/types/board'
import { daysUntil, dueStateOf } from './dueDate'

export type PriorityFilter = Priority | 'none'
export type DueFilter = 'any' | 'overdue' | 'week' | 'none'

export interface TableFilter {
  search:      string
  priorities:  PriorityFilter[]
  due:         DueFilter
}

export const emptyFilter: TableFilter = { search: '', priorities: [], due: 'any' }

export const dueFilterLabels: Record<DueFilter, string> = {
  any:      'Any time',
  overdue:  'Overdue',
  week:     'Due this week',
  none:     'No due date',
}

const weekDays = 7

function matchesDue(card: Card, column: Column, due: DueFilter) {
  if (due === 'any') return true
  if (due === 'none') return !card.dueDate
  if (!card.dueDate) return false
  if (due === 'overdue') return dueStateOf(card.dueDate, column.isDone) === 'overdue'

  const days = daysUntil(card.dueDate)
  return days >= 0 && days <= weekDays
}

export function matchesFilter(card: Card, column: Column, filter: TableFilter) {
  const search = filter.search.trim().toLowerCase()
  const text = `${card.title} ${card.description}`.toLowerCase()

  if (search && !text.includes(search)) return false
  if (filter.priorities.length && !filter.priorities.includes(card.priority ?? 'none')) return false
  return matchesDue(card, column, filter.due)
}

export function activeFilterCount(filter: TableFilter) {
  return (filter.priorities.length ? 1 : 0) + (filter.due === 'any' ? 0 : 1)
}
