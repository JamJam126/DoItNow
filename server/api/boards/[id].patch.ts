export default defineEventHandler(async (event) => {
  const { id } = await getValidatedRouterParams(event, idParamSchema.parse)
  const { name } = await readValidatedBody(event, boardChangesSchema.parse)
  const sql = useDb()

  const [board] = await sql`update boards set name = ${name} where id = ${id} returning id`
  if (!board) throw notFound('Board')

  return sendNoContent(event)
})
