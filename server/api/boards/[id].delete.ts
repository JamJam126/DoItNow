export default defineEventHandler(async (event) => {
  const { id } = await getValidatedRouterParams(event, idParamSchema.parse)
  const sql = useDb()

  const [board] = await sql`delete from boards where id = ${id} returning id`
  if (!board) throw notFound('Board')

  return sendNoContent(event)
})
