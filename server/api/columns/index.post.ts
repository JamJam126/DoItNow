export default defineEventHandler(async (event) => {
  const { id, boardId, title } = await readValidatedBody(event, newColumnSchema.parse)
  const sql = useDb()

  await sql`
    insert into columns (id, board_id, title, position)
    values (
      ${id},
      ${boardId},
      ${title},
      (select coalesce(max(position), -1) + 1 from columns where board_id = ${boardId})
    )
  `

  return sendNoContent(event, 201)
})
