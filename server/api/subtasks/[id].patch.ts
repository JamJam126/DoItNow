export default defineEventHandler(async (event) => {
  const { id } = await getValidatedRouterParams(event, idParamSchema.parse)
  const changes = await readValidatedBody(event, subtaskChangesSchema.parse)
  const userId = await currentUserId(event)
  const sql = useDb()

  const [subtask] = await sql`
    update subtasks
    set title    = coalesce(${changes.title ?? null}, title),
        is_done  = coalesce(${changes.isDone ?? null}::boolean, is_done)
    where id = ${id}
      and card_id in (
        select cards.id
        from cards
        join columns on columns.id = cards.column_id
        join boards on boards.id = columns.board_id
        where boards.owner_id = ${userId}
      )
    returning id
  `
  if (!subtask) throw notFound('Subtask')

  return sendNoContent(event)
})
