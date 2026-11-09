const publicApiRoutes = ['/api/login', '/api/_auth/session']

export default defineEventHandler(async (event) => {
  const { pathname } = getRequestURL(event)

  const isApi = pathname.startsWith('/api/')
  const isPublic = publicApiRoutes.includes(pathname)
  if (!isApi || isPublic) return

  await requireUserSession(event)
})
