export interface Card {
  id:           string
  title:        string
  description:  string
  createdAt:    string
}

export interface Column {
  id:            string
  title:         string
  isDone:        boolean
  isCollapsed?:  boolean
  cards:         Card[]
}

export type CardChanges = Partial<Pick<Card, 'title' | 'description'>>

export type ColumnChanges = Partial<Pick<Column, 'title' | 'isDone' | 'isCollapsed'>>

export interface Board {
  id:       string
  name:     string
  columns:  Column[]
}
