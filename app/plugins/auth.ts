export default defineNuxtPlugin(async () => {
  const store = useAuthStore()

  // Hydrate from cookie (works on both server and client)
  store.hydrate()

  // If we have a token but user data is missing, fetch from API
  if (store.token && !store.user) {
    try {
      const API_BASE = 'http://127.0.0.1:8000'
      const response = await $fetch<{ success: boolean; data: { user: any } }>(`${API_BASE}/api/v1/me`, {
        headers: {
          Authorization: `Bearer ${store.token}`,
          Accept: 'application/json',
        },
      })

      if (response.success && response.data.user) {
        store.setUser(response.data.user)
      } else {
        store.logout()
      }
    } catch {
      store.logout()
    }
  }
})
