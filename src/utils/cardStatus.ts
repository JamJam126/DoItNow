import type { Column } from '#shared/types/board'

export type CardStatus = 'todo' | 'in-progress' | 'done'

export function statusOf(column: Pick<Column, 'isDone' | 'isInProgress'>): CardStatus {
  if (column.isDone) return 'done'
  if (column.isInProgress) return 'in-progress'
  return 'todo'
}

export const statusLabel: Record<CardStatus, string> = {
  'todo':         'To do',
  'in-progress':  'In progress',
  'done':         'Done',
}

export const statusStyle: Record<CardStatus, string> = {
  'todo':         'text-text-sub',
  'in-progress':  'text-info',
  'done':         'text-success',
}
