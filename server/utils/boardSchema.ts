import { z } from 'zod'

const cardSchema = z.object({
  id:           z.string(),
  title:        z.string().min(1),
  description:  z.string(),
  createdAt:    z.string(),
})

const columnSchema = z.object({
  id:           z.string(),
  title:        z.string().min(1),
  isDone:       z.boolean(),
  isCollapsed:  z.boolean().optional(),
  cards:        z.array(cardSchema),
})

export const boardSchema = z.object({
  version:  z.literal(1),
  name:     z.string(),
  columns:  z.array(columnSchema),
})
