const wrongPasswordDelay = 500

export default defineEventHandler(async (event) => {
  const { password } = await readValidatedBody(event, loginSchema.parse)
  const { loginPasswordHash } = useRuntimeConfig()

  if (!loginPasswordHash) throw new Error('NUXT_LOGIN_PASSWORD_HASH is not set.')

  if (!(await isCorrectPassword(password, loginPasswordHash))) {
    await new Promise((resolve) => setTimeout(resolve, wrongPasswordDelay))
    throw createError({ statusCode: 401, statusMessage: 'Wrong password' })
  }

  await setUserSession(event, { user: { name: 'owner' } })
  return sendNoContent(event)
})
