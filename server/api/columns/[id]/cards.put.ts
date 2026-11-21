export default defineEventHandler(async (event) => {
  const { id } = await getValidatedRouterParams(event, idParamSchema.parse)
  const { ids } = await readValidatedBody(event, idListSchema.parse)
  const userId = await currentUserId(event)
  const sql = useDb()

  const [column] = await sql`
    select columns.id
    from columns
    join boards on boards.id = columns.board_id
    where columns.id = ${id} and boards.owner_id = ${userId}
  `
  if (!column) throw notFound('Column')

  await sql`
    update cards
    set column_id = ${id}, position = ordered.position
    from unnest(${ids}::text[]) with ordinality as ordered (id, position)
    where cards.id = ordered.id
      and cards.column_id in (
        select columns.id
        from columns
        join boards on boards.id = columns.board_id
        where boards.owner_id = ${userId}
      )
  `

  return sendNoContent(event)
})
