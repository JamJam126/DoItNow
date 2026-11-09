import { readFileSync } from 'node:fs'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.NUXT_DATABASE_URL)
const schema = readFileSync('server/database/schema.sql', 'utf8')

const statements = schema
  .split(';')
  .map((statement) => statement.trim())
  .filter(Boolean)

for (const statement of statements) {
  await sql.query(statement)
}

console.log('Database is ready.')
