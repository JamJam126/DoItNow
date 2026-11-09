export default defineEventHandler(async (event) => {
  const { id } = await getValidatedRouterParams(event, idParamSchema.parse)

  const board = await readBoard(id)
  if (!board) throw notFound('Board')

  return board
})
