export type TableField = 'description' | 'due' | 'priority' | 'created'

export const tableFields: { key: TableField, label: string }[] = [
  { key: 'description',  label: 'Description' },
  { key: 'due',          label: 'Due date' },
  { key: 'priority',     label: 'Priority' },
  { key: 'created',      label: 'Created' },
]

interface FieldSettings {
  order:    TableField[]
  visible:  TableField[]
}

const allFields = tableFields.map((field) => field.key)
const defaultSettings: FieldSettings = { order: allFields, visible: ['description', 'due', 'priority'] }
const storageKey = 'doitnow:table-columns'

function onlyKnown(value: unknown): TableField[] {
  return Array.isArray(value) ? allFields.filter((key) => value.includes(key)) : []
}

function readSettings(): FieldSettings {
  try {
    const saved = JSON.parse(readStorage(storageKey) ?? 'null')
    if (!saved) return defaultSettings

    const order = Array.isArray(saved.order) ? saved.order.filter((key: TableField) => allFields.includes(key)) : []
    return {
      order:    [...order, ...allFields.filter((key) => !order.includes(key))],
      visible:  onlyKnown(saved.visible),
    }
  } catch {
    return defaultSettings
  }
}

const settings = ref<FieldSettings>(readSettings())

function saveSettings(next: FieldSettings) {
  settings.value = next
  writeStorage(storageKey, JSON.stringify(next))
}

const orderedFields = computed(() =>
  settings.value.order.map((key) => tableFields.find((field) => field.key === key)!),
)

const visibleFields = computed(() => settings.value.order.filter((key) => settings.value.visible.includes(key)))

const visibleFieldOptions = computed(() => orderedFields.value.filter((field) => isVisible(field.key)))

function isVisible(field: TableField) {
  return settings.value.visible.includes(field)
}

function toggleField(field: TableField) {
  const visible = isVisible(field)
    ? settings.value.visible.filter((key) => key !== field)
    : [...settings.value.visible, field]

  saveSettings({ ...settings.value, visible })
}

function setFieldOrder(order: TableField[]) {
  saveSettings({ ...settings.value, order })
}

export function useTableFields() {
  return { orderedFields, visibleFields, visibleFieldOptions, isVisible, toggleField, setFieldOrder }
}
