export type BoardView = 'board' | 'table'

export function useBoardView(boardId: string) {
  const key = `doitnow:view:${boardId}`
  const view = ref<BoardView>(readStorage(key) === 'table' ? 'table' : 'board')

  watch(view, (value) => writeStorage(key, value))

  return view
}
