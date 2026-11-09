import { randomUUID } from 'node:crypto'

const starterColumns = [
  { title: 'To do', isDone: false },
  { title: 'Doing', isDone: false },
  { title: 'Done',  isDone: true },
]

export default defineEventHandler(async (event) => {
  const { id, name } = await readValidatedBody(event, newBoardSchema.parse)
  const sql = useDb()

  await sql.transaction([
    sql`insert into boards (id, name) values (${id}, ${name})`,
    ...starterColumns.map((column, position) => sql`
      insert into columns (id, board_id, title, position, is_done)
      values (${randomUUID()}, ${id}, ${column.title}, ${position}, ${column.isDone})
    `),
  ])

  return sendNoContent(event, 201)
})
