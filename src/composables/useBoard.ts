import type { Board, Card, CardChanges, Column, ColumnChanges } from '#shared/types/board'

type Status = 'loading' | 'ready' | 'not-found' | 'error'

const board = ref<Board>({ id: '', name: '', columns: [] })
const status = ref<Status>('loading')
const hasSaveError = ref(false)

let saving: Promise<unknown> = Promise.resolve()

function statusCodeOf(error: unknown) {
  return (error as { statusCode?: number }).statusCode
}

function isLoggedOut(error: unknown) {
  return statusCodeOf(error) === 401
}

function goToLogin() {
  window.location.assign('/login')
}

function save(request: () => Promise<unknown>) {
  saving = saving.then(request).catch((error) => {
    if (isLoggedOut(error)) return goToLogin()

    hasSaveError.value = true
    console.warn('Could not save a change.', error)
  })
}

async function load(boardId: string) {
  status.value = 'loading'
  hasSaveError.value = false

  try {
    board.value = await boardApi.loadBoard(boardId)
    status.value = 'ready'
  } catch (error) {
    if (isLoggedOut(error)) return goToLogin()
    status.value = statusCodeOf(error) === 404 ? 'not-found' : 'error'
  }
}

function renameBoard(name: string) {
  if (board.value.name === name) return

  board.value.name = name

  const boardId = board.value.id
  save(() => boardApi.renameBoard(boardId, name))
}

const doneColumn = computed(() => board.value.columns.find((column) => column.isDone))

function newId() {
  return crypto.randomUUID()
}

function hasChanges<T extends object>(target: T, changes: Partial<T>) {
  return Object.entries(changes).some(([key, value]) => target[key as keyof T] !== value)
}

function idsOf(items: { id: string }[]) {
  return items.map((item) => item.id)
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
  const card: Card = { id: newId(), title, description: '', createdAt: new Date().toISOString() }

  findColumn(columnId)?.cards.push(card)
  save(() => boardApi.addCard(card.id, columnId, title))
}

function updateCard(cardId: string, changes: CardChanges) {
  const found = findCard(cardId)
  if (!found || !hasChanges(found.card, changes)) return

  Object.assign(found.card, changes)
  save(() => boardApi.updateCard(cardId, changes))
}

function deleteCard(cardId: string) {
  const found = findCard(cardId)
  if (!found) return

  found.column.cards = found.column.cards.filter((card) => card.id !== cardId)
  save(() => boardApi.deleteCard(cardId))
}

function moveCard(cardId: string, columnId: string) {
  const found = findCard(cardId)
  const target = findColumn(columnId)
  if (!found || !target || found.column.id === target.id) return

  found.column.cards = found.column.cards.filter((card) => card.id !== cardId)
  target.cards.push(found.card)

  const cardIds = idsOf(target.cards)
  save(() => boardApi.saveCardOrder(columnId, cardIds))
}

function setCards(columnId: string, cards: Card[]) {
  const column = findColumn(columnId)
  if (!column) return

  column.cards = cards

  const cardIds = idsOf(cards)
  save(() => boardApi.saveCardOrder(columnId, cardIds))
}

function setColumns(columns: Column[]) {
  board.value.columns = columns

  const boardId = board.value.id
  const columnIds = idsOf(columns)
  save(() => boardApi.saveColumnOrder(boardId, columnIds))
}

function addColumn(title: string) {
  const column: Column = { id: newId(), title, isDone: false, cards: [] }

  board.value.columns.push(column)

  const boardId = board.value.id
  save(() => boardApi.addColumn(column.id, boardId, title))
}

function updateColumn(columnId: string, changes: ColumnChanges) {
  const column = findColumn(columnId)
  if (!column || !hasChanges(column, changes)) return

  Object.assign(column, changes)
  save(() => boardApi.updateColumn(columnId, changes))
}

function renameColumn(columnId: string, title: string) {
  updateColumn(columnId, { title })
}

function toggleCollapsed(columnId: string) {
  const column = findColumn(columnId)
  if (column) updateColumn(columnId, { isCollapsed: !column.isCollapsed })
}

function setDoneColumn(columnId: string | null) {
  const previous = doneColumn.value

  for (const column of board.value.columns) {
    column.isDone = column.id === columnId
  }

  if (columnId) save(() => boardApi.updateColumn(columnId, { isDone: true }))
  else if (previous) save(() => boardApi.updateColumn(previous.id, { isDone: false }))
}

function deleteColumn(columnId: string) {
  board.value.columns = board.value.columns.filter((column) => column.id !== columnId)
  save(() => boardApi.deleteColumn(columnId))
}

export function useBoard() {
  return {
    board,
    status,
    hasSaveError,
    load,
    renameBoard,
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
    toggleCollapsed,
    setDoneColumn,
    deleteColumn,
  }
}
