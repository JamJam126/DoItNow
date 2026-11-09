export default defineEventHandler(async (event) => {
  const { id } = await getValidatedRouterParams(event, idParamSchema.parse)
  const sql = useDb()

  const [card] = await sql`delete from cards where id = ${id} returning id`
  if (!card) throw notFound('Card')

  return sendNoContent(event)
})
