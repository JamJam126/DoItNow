export default defineEventHandler(async (event) => {
  const { id } = await getValidatedRouterParams(event, idParamSchema.parse)
  const userId = await currentUserId(event)
  const sql = useDb()

  const [board] = await sql`delete from boards where id = ${id} and owner_id = ${userId} returning id`
  if (!board) throw notFound('Board')

  return sendNoContent(event)
})
