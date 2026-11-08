export function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('en', {
    month:  'short',
    day:    'numeric',
    year:   'numeric',
  })
}
