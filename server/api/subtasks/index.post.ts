export default defineEventHandler(async (event) => {
  const { id, cardId, title } = await readValidatedBody(event, newSubtaskSchema.parse)
  const userId = await currentUserId(event)
  const sql = useDb()

  const [subtask] = await sql`
    insert into subtasks (id, card_id, title, position)
    select
      ${id},
      cards.id,
      ${title},
      (select coalesce(max(position), -1) + 1 from subtasks where card_id = cards.id)
    from cards
    join columns on columns.id = cards.column_id
    join boards on boards.id = columns.board_id
    where cards.id = ${cardId} and boards.owner_id = ${userId}
    returning id
  `
  if (!subtask) throw notFound('Card')

  return sendNoContent(event, 201)
})
