import type { Board, BoardSummary, Card } from '#shared/types/board'

export async function readBoards(): Promise<BoardSummary[]> {
  const sql = useDb()

  const rows = await sql`
    select
      boards.id,
      boards.name,
      count(cards.id)::int as card_count,
      count(cards.id) filter (where columns.is_done)::int as done_count,
      coalesce(bool_or(columns.is_done), false) as has_done_column
    from boards
    left join columns on columns.board_id = boards.id
    left join cards on cards.column_id = columns.id
    group by boards.id
    order by boards.created_at
  `

  return rows.map((row) => ({
    id:         row.id,
    name:       row.name,
    cardCount:  row.card_count,
    doneCount:  row.has_done_column ? row.done_count : null,
  }))
}

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
