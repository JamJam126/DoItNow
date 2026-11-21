import type { Priority } from '#shared/types/board'

export const priorityStyle: Record<Priority, string> = {
  low:     'border-text-sub/20 text-text-sub/70',
  medium:  'border-text-sub/40 text-text-sub',
  high:    'border-warning/40 text-warning',
  urgent:  'border-error/40 text-error',
}

export const priorityTextStyle: Record<Priority, string> = {
  low:     'text-text-sub/70',
  medium:  'text-text-sub',
  high:    'text-warning',
  urgent:  'text-error',
}
