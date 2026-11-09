import { neon } from '@neondatabase/serverless'

export const defaultBoardId = 'main'

export function useDb() {
  const { databaseUrl } = useRuntimeConfig()
  if (!databaseUrl) throw new Error('NUXT_DATABASE_URL is not set.')

  return neon(databaseUrl)
}

export function notFound(what: string) {
  return createError({ statusCode: 404, statusMessage: `${what} not found` })
}
