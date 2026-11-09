export default defineEventHandler(async (event) => {
  const { id } = await getValidatedRouterParams(event, idParamSchema.parse)
  const { ids } = await readValidatedBody(event, idListSchema.parse)
  const sql = useDb()

  await sql`
    update columns
    set position = ordered.position
    from unnest(${ids}::text[]) with ordinality as ordered (id, position)
    where columns.id = ordered.id and columns.board_id = ${id}
  `

  return sendNoContent(event)
})
