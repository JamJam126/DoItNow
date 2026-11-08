import { readFileSync } from 'node:fs'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.NUXT_DATABASE_URL)
const schema = readFileSync('server/database/schema.sql', 'utf8')

await sql.query(schema)
console.log('Database is ready.')
