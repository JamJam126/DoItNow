export default defineEventHandler(async (event) => {
  const { id } = await getValidatedRouterParams(event, idParamSchema.parse)
  const userId = await currentUserId(event)

  const board = await readBoard(id, userId)
  if (!board) throw notFound('Board')

  return board
})
