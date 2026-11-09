import type { Board, Card } from '#shared/types/board'

export async function readBoard(boardId: string): Promise<Board | undefined> {
  const sql = useDb()

  const [boards = [], columns = [], cards = []] = await sql.transaction([
    sql`select id, name from boards where id = ${boardId}`,
    sql`
      select id, title, is_done, is_collapsed
      from columns
      where board_id = ${boardId}
      order by position
    `,
    sql`
      select cards.id, cards.column_id, cards.title, cards.description, cards.created_at
      from cards
      join columns on columns.id = cards.column_id
      where columns.board_id = ${boardId}
      order by cards.position
    `,
  ])

  const board = boards[0]
  if (!board) return undefined

  return {
    id:       board.id,
    name:     board.name,
    columns:  columns.map((column) => ({
      id:           column.id,
      title:        column.title,
      isDone:       column.is_done,
      isCollapsed:  column.is_collapsed,
      cards:        cards
        .filter((card) => card.column_id === column.id)
        .map((card): Card => ({
          id:           card.id,
          title:        card.title,
          description:  card.description,
          createdAt:    new Date(card.created_at).toISOString(),
        })),
    })),
  }
}

export async function insertBoard(board: Board) {
  const sql = useDb()

  const columnInserts = board.columns.map((column, position) => sql`
    insert into columns (id, board_id, title, position, is_done, is_collapsed)
    values (${column.id}, ${board.id}, ${column.title}, ${position}, ${column.isDone}, ${column.isCollapsed ?? false})
    on conflict (id) do nothing
  `)

  const cardInserts = board.columns.flatMap((column) =>
    column.cards.map((card, position) => sql`
      insert into cards (id, column_id, title, description, position, created_at)
      values (${card.id}, ${column.id}, ${card.title}, ${card.description}, ${position}, ${card.createdAt})
      on conflict (id) do nothing
    `),
  )

  await sql.transaction([
    sql`insert into boards (id, name) values (${board.id}, ${board.name}) on conflict (id) do nothing`,
    ...columnInserts,
    ...cardInserts,
  ])
}
