import type { Board, BoardSummary, Card, Subtask } from '#shared/types/board'

export async function readBoards(userId: string): Promise<BoardSummary[]> {
  const sql = useDb()

  const rows = await sql`
    select
      boards.id,
      boards.name,
      count(cards.id)::int as card_count,
      count(cards.id) filter (where columns.is_done)::int as done_count,
      count(cards.id) filter (where columns.is_in_progress)::int as in_progress_count,
      coalesce(bool_or(columns.is_done), false) as has_done_column,
      coalesce(bool_or(columns.is_in_progress), false) as has_in_progress_column
    from boards
    left join columns on columns.board_id = boards.id
    left join cards on cards.column_id = columns.id
    where boards.owner_id = ${userId}
    group by boards.id
    order by boards.created_at
  `

  return rows.map((row) => ({
    id:               row.id,
    name:             row.name,
    cardCount:        row.card_count,
    doneCount:        row.has_done_column ? row.done_count : null,
    inProgressCount:  row.has_in_progress_column ? row.in_progress_count : null,
  }))
}

export async function readBoard(boardId: string, userId: string): Promise<Board | undefined> {
  const sql = useDb()

  const [boards = [], columns = [], cards = [], subtasks = []] = await sql.transaction([
    sql`select id, name from boards where id = ${boardId} and owner_id = ${userId}`,
    sql`
      select id, title, is_done, is_in_progress, is_collapsed
      from columns
      where board_id = ${boardId}
      order by position
    `,
    sql`
      select
        cards.id, cards.column_id, cards.title, cards.description,
        cards.priority, cards.due_date::text as due_date, cards.created_at
      from cards
      join columns on columns.id = cards.column_id
      where columns.board_id = ${boardId}
      order by cards.position
    `,
    sql`
      select subtasks.id, subtasks.card_id, subtasks.title, subtasks.is_done
      from subtasks
      join cards on cards.id = subtasks.card_id
      join columns on columns.id = cards.column_id
      where columns.board_id = ${boardId}
      order by subtasks.position
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
      isDone:        column.is_done,
      isInProgress:  column.is_in_progress,
      isCollapsed:   column.is_collapsed,
      cards:        cards
        .filter((card) => card.column_id === column.id)
        .map((card): Card => ({
          id:           card.id,
          title:        card.title,
          description:  card.description,
          priority:     card.priority,
          dueDate:      card.due_date,
          createdAt:    new Date(card.created_at).toISOString(),
          subtasks:     subtasks
            .filter((subtask) => subtask.card_id === card.id)
            .map((subtask): Subtask => ({
              id:      subtask.id,
              title:   subtask.title,
              isDone:  subtask.is_done,
            })),
        })),
    })),
  }
}
