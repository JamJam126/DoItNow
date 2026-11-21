export default defineEventHandler(async (event) => {
  const { id } = await getValidatedRouterParams(event, idParamSchema.parse)
  const { ids } = await readValidatedBody(event, idListSchema.parse)
  const userId = await currentUserId(event)
  const sql = useDb()

  const [card] = await sql`
    select cards.id
    from cards
    join columns on columns.id = cards.column_id
    join boards on boards.id = columns.board_id
    where cards.id = ${id} and boards.owner_id = ${userId}
  `
  if (!card) throw notFound('Card')

  await sql`
    update subtasks
    set position = ordered.position
    from unnest(${ids}::text[]) with ordinality as ordered (id, position)
    where subtasks.id = ordered.id and subtasks.card_id = ${id}
  `

  return sendNoContent(event)
})
