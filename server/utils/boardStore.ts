import type { Board } from '#shared/types/board'

const boardId = 'main'

export async function readBoard(): Promise<Board> {
  const sql = useDb()
  const rows = await sql`select data from boards where id = ${boardId}`

  return (rows[0]?.data as Board | undefined) ?? sampleBoard
}

export async function writeBoard(board: Board) {
  const sql = useDb()

  await sql`
    insert into boards (id, data)
    values (${boardId}, ${JSON.stringify(board)}::jsonb)
    on conflict (id) do update
      set data = excluded.data, updated_at = now()
  `
}
