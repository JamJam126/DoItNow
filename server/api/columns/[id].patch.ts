export default defineEventHandler(async (event) => {
  const { id } = await getValidatedRouterParams(event, idParamSchema.parse)
  const changes = await readValidatedBody(event, columnChangesSchema.parse)
  const userId = await currentUserId(event)
  const sql = useDb()

  const [column] = await sql`
    update columns
    set title           = coalesce(${changes.title ?? null}, title),
        is_done         = coalesce(${changes.isDone ?? null}, is_done),
        is_in_progress  = coalesce(${changes.isInProgress ?? null}, is_in_progress),
        is_collapsed    = coalesce(${changes.isCollapsed ?? null}, is_collapsed)
    where id = ${id}
      and board_id in (select id from boards where owner_id = ${userId})
    returning board_id
  `
  if (!column) throw notFound('Column')

  if (changes.isDone) {
    await sql`
      update columns
      set is_done         = (id = ${id}),
          is_in_progress  = case when id = ${id} then false else is_in_progress end
      where board_id = ${column.board_id}
    `
  }

  if (changes.isInProgress) {
    await sql`
      update columns
      set is_in_progress  = (id = ${id}),
          is_done         = case when id = ${id} then false else is_done end
      where board_id = ${column.board_id}
    `
  }

  return sendNoContent(event)
})
