export default defineEventHandler(async () => {
  const board = await readBoard(defaultBoardId)
  if (board) return board

  await insertBoard(sampleBoard)
  return sampleBoard
})
