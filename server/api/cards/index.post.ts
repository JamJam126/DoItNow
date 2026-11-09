export default defineEventHandler(async (event) => {
  const { id, columnId, title } = await readValidatedBody(event, newCardSchema.parse)
  const sql = useDb()

  await sql`
    insert into cards (id, column_id, title, position)
    values (
      ${id},
      ${columnId},
      ${title},
      (select coalesce(max(position), -1) + 1 from cards where column_id = ${columnId})
    )
  `

  return sendNoContent(event, 201)
})
