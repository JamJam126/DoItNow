import { randomBytes, randomUUID, scryptSync } from 'node:crypto'
import { createInterface } from 'node:readline/promises'
import { neon } from '@neondatabase/serverless'

const usage = `Usage:
  pnpm user add <username>        create an account (asks for a password)
  pnpm user password <username>   set a new password
  pnpm user list                  show all accounts
  pnpm user remove <username>     delete an account and all its boards`

const usernamePattern = /^[a-z0-9][a-z0-9_.-]{2,31}$/
const minPasswordLength = 10

const sql = neon(process.env.NUXT_DATABASE_URL)
const [command, rawUsername] = process.argv.slice(2)
const username = rawUsername?.trim().toLowerCase()

const commands = { add, password: changePassword, list, remove }

if (!commands[command] || (command !== 'list' && !username)) {
  console.log(usage)
  process.exit(1)
}

await commands[command]()

async function add() {
  if (!usernamePattern.test(username)) {
    fail('Usernames are 3-32 characters: lowercase letters, digits, dot, dash or underscore.')
  }

  const [existing] = await sql`select id from users where username = ${username}`
  if (existing) fail(`"${username}" already exists. Use: pnpm user password ${username}`)

  const passwordHash = hashPassword(await askNewPassword())
  await sql`insert into users (id, username, password_hash) values (${randomUUID()}, ${username}, ${passwordHash})`

  console.log(`Created "${username}". They can log in now.`)
}

async function changePassword() {
  const [user] = await sql`select id from users where username = ${username}`
  if (!user) fail(`No account named "${username}".`)

  const passwordHash = hashPassword(await askNewPassword())
  await sql`update users set password_hash = ${passwordHash} where id = ${user.id}`

  console.log(`Password changed for "${username}". Sessions that are already logged in stay logged in.`)
}

async function list() {
  const users = await sql`
    select users.username, users.created_at, count(boards.id)::int as board_count
    from users
    left join boards on boards.owner_id = users.id
    group by users.id
    order by users.created_at
  `

  if (!users.length) return console.log('No accounts yet. Create one with: pnpm user add <username>')

  for (const user of users) {
    const created = new Date(user.created_at).toISOString().slice(0, 10)
    console.log(`${user.username.padEnd(32)} ${String(user.board_count).padStart(3)} boards   created ${created}`)
  }
}

async function remove() {
  const [user] = await sql`
    select users.id, count(boards.id)::int as board_count
    from users
    left join boards on boards.owner_id = users.id
    where users.username = ${username}
    group by users.id
  `
  if (!user) fail(`No account named "${username}".`)

  const answer = await ask(`This deletes "${username}" and their ${user.board_count} boards. Type the username to confirm: `)
  if (answer.trim().toLowerCase() !== username) fail('Not deleted.')

  await sql`delete from users where id = ${user.id}`
  console.log(`Deleted "${username}".`)
}

async function askNewPassword() {
  const password = await askHidden(`Password for "${username}" (at least ${minPasswordLength} characters): `)
  if (password.length < minPasswordLength) fail(`Too short, use at least ${minPasswordLength} characters.`)

  const repeated = await askHidden('Repeat the password: ')
  if (repeated !== password) fail('The passwords do not match.')

  return password
}

function hashPassword(password) {
  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${hash}`
}

async function ask(question) {
  const prompt = createInterface({ input: process.stdin, output: process.stdout })
  const answer = await prompt.question(question)
  prompt.close()
  return answer
}

function askHidden(question) {
  if (!process.stdin.isTTY) fail('Run this in a terminal so the password can be typed without showing it.')

  process.stdout.write(question)
  process.stdin.setRawMode(true)
  process.stdin.resume()
  process.stdin.setEncoding('utf8')

  let typed = ''

  return new Promise((resolve) => {
    function finish() {
      process.stdin.setRawMode(false)
      process.stdin.pause()
      process.stdin.off('data', onData)
      process.stdout.write('\n')
    }

    function onData(chunk) {
      for (const character of chunk) {
        if (character === '\r' || character === '\n') {
          finish()
          return resolve(typed)
        }
        if (character === '\u0003') {
          finish()
          process.exit(130)
        }
        if (character === '\u007f' || character === '\b') typed = typed.slice(0, -1)
        else typed += character
      }
    }

    process.stdin.on('data', onData)
  })
}

function fail(message) {
  console.error(message)
  process.exit(1)
}
