import type { H3Event } from 'h3'

export async function currentUserId(event: H3Event): Promise<string> {
  const { user } = await requireUserSession(event)
  if (!user.id) throw createError({ statusCode: 401, statusMessage: 'Please log in again' })
  return user.id
}
