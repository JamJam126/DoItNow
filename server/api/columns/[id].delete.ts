export default defineEventHandler(async (event) => {
  const { id } = await getValidatedRouterParams(event, idParamSchema.parse)
  const sql = useDb()

  const [column] = await sql`delete from columns where id = ${id} returning id`
  if (!column) throw notFound('Column')

  return sendNoContent(event)
})
