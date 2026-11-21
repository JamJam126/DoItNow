import { randomUUID } from 'node:crypto'

const starterColumns = [
  { title: 'To do', isDone: false, isInProgress: false },
  { title: 'Doing', isDone: false, isInProgress: true },
  { title: 'Done',  isDone: true,  isInProgress: false },
]

export default defineEventHandler(async (event) => {
  const { id, name } = await readValidatedBody(event, newBoardSchema.parse)
  const userId = await currentUserId(event)
  const sql = useDb()

  await sql.transaction([
    sql`insert into boards (id, owner_id, name) values (${id}, ${userId}, ${name})`,
    ...starterColumns.map((column, position) => sql`
      insert into columns (id, board_id, title, position, is_done, is_in_progress)
      values (${randomUUID()}, ${id}, ${column.title}, ${position}, ${column.isDone}, ${column.isInProgress})
    `),
  ])

  return sendNoContent(event, 201)
})
