export const priorities = ['low', 'medium', 'high', 'urgent'] as const

export type Priority = (typeof priorities)[number]

export interface Card {
  id:           string
  title:        string
  description:  string
  priority:     Priority | null
  dueDate:      string | null
  createdAt:    string
}

export interface Column {
  id:             string
  title:          string
  isDone:         boolean
  isInProgress:   boolean
  isCollapsed?:   boolean
  cards:          Card[]
}

export type NewCardDetails = Pick<Card, 'priority' | 'dueDate'>

export type CardChanges = Partial<Pick<Card, 'title' | 'description' | 'priority' | 'dueDate'>>

export type ColumnChanges = Partial<Pick<Column, 'title' | 'isDone' | 'isInProgress' | 'isCollapsed'>>

export interface Board {
  id:       string
  name:     string
  columns:  Column[]
}

export interface BoardSummary {
  id:               string
  name:             string
  cardCount:        number
  doneCount:        number | null
  inProgressCount:  number | null
}
