export default defineEventHandler(async (event) => {
  const { id } = await getValidatedRouterParams(event, idParamSchema.parse)
  const { ids } = await readValidatedBody(event, idListSchema.parse)
  const sql = useDb()

  await sql`
    update cards
    set column_id = ${id}, position = ordered.position
    from unnest(${ids}::text[]) with ordinality as ordered (id, position)
    where cards.id = ordered.id
  `

  return sendNoContent(event)
})
