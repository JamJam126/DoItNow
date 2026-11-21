const wrongPasswordDelay = 500

export default defineEventHandler(async (event) => {
  const { currentPassword, newPassword } = await readValidatedBody(event, passwordChangeSchema.parse)
  const userId = await currentUserId(event)
  const sql = useDb()

  const [user] = await sql`select password_hash from users where id = ${userId}`
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Please log in again' })

  if (!(await isCorrectPassword(currentPassword, user.password_hash))) {
    await new Promise((resolve) => setTimeout(resolve, wrongPasswordDelay))
    throw createError({ statusCode: 403, statusMessage: 'Current password is wrong' })
  }

  await sql`update users set password_hash = ${await hashPassword(newPassword)} where id = ${userId}`
  return sendNoContent(event)
})
