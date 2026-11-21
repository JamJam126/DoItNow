export type TableField = 'status' | 'priority' | 'due' | 'created' | 'description'

export const tableFields: { key: TableField, label: string }[] = [
  { key: 'status',       label: 'Status' },
  { key: 'priority',     label: 'Priority' },
  { key: 'due',          label: 'Due' },
  { key: 'created',      label: 'Created' },
  { key: 'description',  label: 'Description' },
]

const defaultFields: TableField[] = ['status', 'priority', 'due']
const storageKey = 'doitnow:table-fields'

function readFields(): TableField[] {
  try {
    const saved = JSON.parse(readStorage(storageKey) ?? 'null')
    if (Array.isArray(saved)) return tableFields.map((field) => field.key).filter((key) => saved.includes(key))
  } catch {}

  return defaultFields
}

const visibleFields = ref<TableField[]>(readFields())

function isVisible(field: TableField) {
  return visibleFields.value.includes(field)
}

function toggleField(field: TableField) {
  const wanted = isVisible(field)
    ? visibleFields.value.filter((key) => key !== field)
    : [...visibleFields.value, field]

  visibleFields.value = tableFields.map((option) => option.key).filter((key) => wanted.includes(key))
  writeStorage(storageKey, JSON.stringify(visibleFields.value))
}

export function useTableFields() {
  return { visibleFields, isVisible, toggleField }
}
