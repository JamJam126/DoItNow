export default defineEventHandler(async (event) => {
  const board = await readValidatedBody(event, boardSchema.parse)
  await writeBoard(board)

  setResponseStatus(event, 204)
  return null
})
