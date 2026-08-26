import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware((to) => {
  const store = useAuthStore()

  // Hydrate dari cookie (works on both server + client)
  if (!store.hydrated) {
    store.hydrate()
  }

  const isAuthenticated = computed(() => !!store.token)
  const isSuperadmin = computed(() => store.user?.role_id === 1)

  // Handle root route - SELALU redirect
  if (to.path === '/') {
    if (isAuthenticated.value) {
      return isSuperadmin.value ? navigateTo('/dashboard') : navigateTo('/user/open-ticket')
    }
    return navigateTo('/login')
  }

  const publicRoutes = ['/login', '/create-password']

  if (publicRoutes.includes(to.path)) {
    if (isAuthenticated.value) {
      return isSuperadmin.value ? navigateTo('/dashboard') : navigateTo('/user/open-ticket')
    }
    return
  }

  if (!isAuthenticated.value) {
    return navigateTo('/login')
  }

  if (to.path.startsWith('/dashboard') && !isSuperadmin.value) {
    return navigateTo('/user/open-ticket')
  }

  if (to.path.startsWith('/user') && isSuperadmin.value) {
    return navigateTo('/dashboard')
  }
})
