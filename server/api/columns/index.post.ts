export default defineEventHandler(async (event) => {
  const { id, boardId, title } = await readValidatedBody(event, newColumnSchema.parse)
  const userId = await currentUserId(event)
  const sql = useDb()

  const [column] = await sql`
    insert into columns (id, board_id, title, position)
    select
      ${id},
      boards.id,
      ${title},
      (select coalesce(max(position), -1) + 1 from columns where board_id = boards.id)
    from boards
    where boards.id = ${boardId} and boards.owner_id = ${userId}
    returning id
  `
  if (!column) throw notFound('Board')

  return sendNoContent(event, 201)
})
