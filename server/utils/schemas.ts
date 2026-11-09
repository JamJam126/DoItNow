import { z } from 'zod'

const id = z.string().min(1).max(100)
const title = z.string().trim().min(1).max(500)

export const loginSchema = z.object({ password: z.string().min(1).max(200) })

export const idParamSchema = z.object({ id })

export const idListSchema = z.object({ ids: z.array(id) })

export const newColumnSchema = z.object({ id, title })

export const columnChangesSchema = z.object({
  title:        title.optional(),
  isDone:       z.boolean().optional(),
  isCollapsed:  z.boolean().optional(),
})

export const newCardSchema = z.object({ id, columnId: id, title })

export const cardChangesSchema = z.object({
  title:        title.optional(),
  description:  z.string().max(20_000).optional(),
})
