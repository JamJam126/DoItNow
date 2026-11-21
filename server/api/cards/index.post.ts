export default defineEventHandler(async (event) => {
  const { id, columnId, title, priority = null, dueDate = null } = await readValidatedBody(event, newCardSchema.parse)
  const userId = await currentUserId(event)
  const sql = useDb()

  const [card] = await sql`
    insert into cards (id, column_id, title, priority, due_date, position)
    select
      ${id},
      columns.id,
      ${title},
      ${priority}::text,
      ${dueDate}::date,
      (select coalesce(max(position), -1) + 1 from cards where column_id = columns.id)
    from columns
    join boards on boards.id = columns.board_id
    where columns.id = ${columnId} and boards.owner_id = ${userId}
    returning id
  `
  if (!card) throw notFound('Column')

  return sendNoContent(event, 201)
})
