export default defineEventHandler(async (event) => {
  const { id } = await getValidatedRouterParams(event, idParamSchema.parse)
  const changes = await readValidatedBody(event, cardChangesSchema.parse)
  const sql = useDb()

  const [card] = await sql`
    update cards
    set title        = coalesce(${changes.title ?? null}, title),
        description  = coalesce(${changes.description ?? null}, description)
    where id = ${id}
    returning id
  `
  if (!card) throw notFound('Card')

  return sendNoContent(event)
})
