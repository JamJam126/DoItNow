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

export interface Board {
  version:  1
  name:     string
  columns:  Column[]
}
