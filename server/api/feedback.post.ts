export default defineEventHandler(async (event) => {
  const { message } = await readValidatedBody(event, feedbackSchema.parse)
  const { user } = await requireUserSession(event)

  const { telegramBotToken, telegramChatId } = useRuntimeConfig(event)
  if (!telegramBotToken || !telegramChatId) {
    throw createError({ statusCode: 503, statusMessage: 'Feedback is not set up yet' })
  }

  try {
    await $fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
      method: 'POST',
      body: { chat_id: telegramChatId, text: `DoItNow feedback from ${user.username}\n\n${message}` },
    })
  } catch {
    throw createError({ statusCode: 502, statusMessage: 'Could not send feedback' })
  }

  return sendNoContent(event)
})
