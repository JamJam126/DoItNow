export type DueState = 'overdue' | 'soon' | 'later' | 'done'

const soonDays = 2
const dayInMs = 24 * 60 * 60 * 1000

export const dueStyle: Record<DueState, string> = {
  overdue:  'text-error',
  soon:     'text-warning',
  later:    'text-text-sub',
  done:     'text-text-sub/60',
}

function toLocalDate(dueDate: string) {
  const [year = 0, month = 1, day = 1] = dueDate.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function daysUntil(dueDate: string) {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  return Math.round((toLocalDate(dueDate).getTime() - today.getTime()) / dayInMs)
}

export function dueStateOf(dueDate: string, isDone: boolean): DueState {
  if (isDone) return 'done'

  const days = daysUntil(dueDate)
  if (days < 0) return 'overdue'
  if (days <= soonDays) return 'soon'
  return 'later'
}

export function formatDueDate(dueDate: string) {
  return formatShortDate(toLocalDate(dueDate))
}

export function formatShortDate(date: Date) {
  const isThisYear = date.getFullYear() === new Date().getFullYear()

  return date.toLocaleDateString('en', {
    month:  'short',
    day:    'numeric',
    year:   isThisYear ? undefined : 'numeric',
  })
}

export function describeDueDate(dueDate: string) {
  const days = daysUntil(dueDate)

  if (days === 0) return 'due today'
  if (days === 1) return 'due tomorrow'
  if (days === -1) return 'overdue by 1 day'
  if (days < 0) return `overdue by ${-days} days`
  return `due in ${days} days`
}
