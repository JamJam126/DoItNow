import type { Board, Card, Column } from '#shared/types/board'

type CardChanges = Partial<Pick<Card, 'title' | 'description'>>

const board = ref<Board>(loadBoard() ?? structuredClone(sampleBoard))

watch(board, () => saveBoard(board.value), { deep: true })

const doneColumn = computed(() => board.value.columns.find((column) => column.isDone))

function newId() {
  return crypto.randomUUID()
}

function findColumn(columnId: string) {
  return board.value.columns.find((column) => column.id === columnId)
}

function findCard(cardId: string) {
  for (const column of board.value.columns) {
    const card = column.cards.find((card) => card.id === cardId)
    if (card) return { card, column }
  }

  return undefined
}

function addCard(columnId: string, title: string) {
  findColumn(columnId)?.cards.push({
    id: newId(),
    title,
    description: '',
    createdAt: new Date().toISOString(),
  })
}

function updateCard(cardId: string, changes: CardChanges) {
  const found = findCard(cardId)
  if (found) Object.assign(found.card, changes)
}

function deleteCard(cardId: string) {
  const found = findCard(cardId)
  if (!found) return

  found.column.cards = found.column.cards.filter((card) => card.id !== cardId)
}

function moveCard(cardId: string, columnId: string) {
  const found = findCard(cardId)
  const target = findColumn(columnId)
  if (!found || !target || found.column.id === target.id) return

  found.column.cards = found.column.cards.filter((card) => card.id !== cardId)
  target.cards.push(found.card)
}

function setCards(columnId: string, cards: Card[]) {
  const column = findColumn(columnId)
  if (column) column.cards = cards
}

function setColumns(columns: Column[]) {
  board.value.columns = columns
}

function addColumn(title: string) {
  board.value.columns.push({ id: newId(), title, isDone: false, cards: [] })
}

function renameColumn(columnId: string, title: string) {
  const column = findColumn(columnId)
  if (column) column.title = title
}

function deleteColumn(columnId: string) {
  board.value.columns = board.value.columns.filter((column) => column.id !== columnId)
}

function setDoneColumn(columnId: string | null) {
  for (const column of board.value.columns) {
    column.isDone = column.id === columnId
  }
}

export function useBoard() {
  return {
    board,
    doneColumn,
    findCard,
    addCard,
    updateCard,
    deleteCard,
    moveCard,
    setCards,
    setColumns,
    addColumn,
    renameColumn,
    deleteColumn,
    setDoneColumn,
  }
}
