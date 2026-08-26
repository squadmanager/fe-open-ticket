import { defineStore } from 'pinia'
import type { User } from '~/types/auth'

function setCookie(name: string, value: string, days: number = 7) {
  if (import.meta.client) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString()
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`
  }
}

function getCookie(name: string): string | null {
  if (import.meta.server) {
    const event = useRequestEvent()
    const cookieHeader = event?.node?.req?.headers?.cookie || ''
    const match = cookieHeader.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
    return match ? decodeURIComponent(match[1]) : null
  }
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

function removeCookie(name: string) {
  if (import.meta.client) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
  }
}

interface AuthState {
  user: User | null
  token: string | null
  pendingUsername: string | null
  hydrated: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
    pendingUsername: null,
    hydrated: false,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
    isSuperadmin: (state) => state.user?.role_id === 1,
  },
  actions: {
    setPendingUsername(username: string) {
      this.pendingUsername = username
    },
    setUser(user: User) {
      this.user = user
      setCookie('auth_user', JSON.stringify(user))
    },
    updateUser(user: User) {
      this.user = user
      setCookie('auth_user', JSON.stringify(user))
    },
    setToken(token: string) {
      this.token = token
      setCookie('auth_token', token)
    },
    hydrate() {
      const token = getCookie('auth_token')
      const userStr = getCookie('auth_user')

      if (token) {
        this.token = token
      }
      if (userStr) {
        try {
          this.user = JSON.parse(userStr)
        } catch {
          this.user = null
        }
      }
      this.hydrated = true
    },
    logout() {
      this.user = null
      this.token = null
      this.pendingUsername = null
      removeCookie('auth_token')
      removeCookie('auth_user')
    },
  },
})
