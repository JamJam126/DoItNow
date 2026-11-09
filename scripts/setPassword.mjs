import { randomBytes, scryptSync } from 'node:crypto'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'

const password = process.argv[2]

if (!password || password.length < 10) {
  console.error('Usage: pnpm set-password "your password" (at least 10 characters)')
  process.exit(1)
}

const salt = randomBytes(16).toString('hex')
const hash = scryptSync(password, salt, 64).toString('hex')
const line = `NUXT_LOGIN_PASSWORD_HASH=${salt}:${hash}`

const env = existsSync('.env') ? readFileSync('.env', 'utf8') : ''
const otherLines = env.split('\n').filter((existing) => existing && !existing.startsWith('NUXT_LOGIN_PASSWORD_HASH='))
writeFileSync('.env', [...otherLines, line].join('\n') + '\n')

console.log('Saved to .env. Restart the dev server to use it.')
console.log('For Vercel, add this environment variable:')
console.log(line)
