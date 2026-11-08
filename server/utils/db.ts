import { neon } from '@neondatabase/serverless'

export function useDb() {
  const { databaseUrl } = useRuntimeConfig()
  if (!databaseUrl) throw new Error('NUXT_DATABASE_URL is not set.')

  return neon(databaseUrl)
}
