const storageKey = 'doitnow:collapsed-subtasks'

function readCollapsed(): string[] {
  try {
    const saved = JSON.parse(readStorage(storageKey) ?? '[]')
    return Array.isArray(saved) ? saved : []
  } catch {
    return []
  }
}

const collapsed = ref<string[]>(readCollapsed())

function areSubtasksCollapsed(cardId: string) {
  return collapsed.value.includes(cardId)
}

function toggleSubtasks(cardId: string) {
  collapsed.value = areSubtasksCollapsed(cardId)
    ? collapsed.value.filter((id) => id !== cardId)
    : [...collapsed.value, cardId]

  writeStorage(storageKey, JSON.stringify(collapsed.value))
}

export function useCollapsedSubtasks() {
  return { areSubtasksCollapsed, toggleSubtasks }
}
