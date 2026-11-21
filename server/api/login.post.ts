const failedLoginDelay = 500
const unusedHash = 'f'.repeat(32) + ':' + 'f'.repeat(128)

export default defineEventHandler(async (event) => {
  const { username, password } = await readValidatedBody(event, loginSchema.parse)
  const sql = useDb()

  const [user] = await sql`select id, username, password_hash from users where username = ${username}`
  const isCorrect = await isCorrectPassword(password, user?.password_hash ?? unusedHash)

  if (!user || !isCorrect) {
    await new Promise((resolve) => setTimeout(resolve, failedLoginDelay))
    throw createError({ statusCode: 401, statusMessage: 'Wrong username or password' })
  }

  await setUserSession(event, { user: { id: user.id, username: user.username } })
  return sendNoContent(event)
})
