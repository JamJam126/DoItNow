export default defineEventHandler(async (event) => {
  const { id } = await getValidatedRouterParams(event, idParamSchema.parse)
  const changes = await readValidatedBody(event, cardChangesSchema.parse)
  const userId = await currentUserId(event)
  const sql = useDb()

  const [card] = await sql`
    update cards
    set title        = coalesce(${changes.title ?? null}, title),
        description  = coalesce(${changes.description ?? null}, description),
        priority     = case when ${changes.priority !== undefined}::boolean
                         then ${changes.priority ?? null}::text else priority end,
        due_date     = case when ${changes.dueDate !== undefined}::boolean
                         then ${changes.dueDate ?? null}::date else due_date end
    where id = ${id}
      and column_id in (
        select columns.id
        from columns
        join boards on boards.id = columns.board_id
        where boards.owner_id = ${userId}
      )
    returning id
  `
  if (!card) throw notFound('Card')

  return sendNoContent(event)
})
