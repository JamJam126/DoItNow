export default defineNuxtRouteMiddleware((to) => {
  const { loggedIn } = useUserSession()
  const isLoginPage = to.path === '/login'

  if (!loggedIn.value && !isLoginPage) return navigateTo('/login')
  if (loggedIn.value && isLoginPage) return navigateTo('/')
})
