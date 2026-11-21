export default defineEventHandler(async (event) => {
  const { id } = await getValidatedRouterParams(event, idParamSchema.parse)
  const userId = await currentUserId(event)
  const sql = useDb()

  const [column] = await sql`
    delete from columns
    where id = ${id}
      and board_id in (select id from boards where owner_id = ${userId})
    returning id
  `
  if (!column) throw notFound('Column')

  return sendNoContent(event)
})
