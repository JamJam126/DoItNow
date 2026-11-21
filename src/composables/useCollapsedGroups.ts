import type { CardStatus } from '~/utils/cardStatus'

export function useCollapsedGroups(boardId: string) {
  const key = `doitnow:table-collapsed:${boardId}`

  function readCollapsed(): CardStatus[] {
    try {
      const saved = JSON.parse(readStorage(key) ?? '[]')
      return Array.isArray(saved) ? saved : []
    } catch {
      return []
    }
  }

  const collapsed = ref<CardStatus[]>(readCollapsed())

  function isCollapsed(status: CardStatus) {
    return collapsed.value.includes(status)
  }

  function setCollapsed(status: CardStatus, value: boolean) {
    const others = collapsed.value.filter((item) => item !== status)
    collapsed.value = value ? [...others, status] : others
    writeStorage(key, JSON.stringify(collapsed.value))
  }

  return { isCollapsed, setCollapsed }
}
