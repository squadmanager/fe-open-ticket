import { useAuthStore } from '~/stores/auth'

const API_BASE = 'http://127.0.0.1:8000'

interface LoginApiResponse {
  success: boolean
  message: string
  data: {
    user?: {
      id: number
      name: string
      username: string
      avatar: string | null
      role_id: number
      role: { id: number; name: string }
    }
    token?: string
    requires_password?: boolean
  }
}

interface CreatePasswordApiResponse {
  success: boolean
  message: string
  data: {
    user: {
      id: number
      name: string
      username: string
      avatar: string | null
      role_id: number
      role: { id: number; name: string }
    }
    token: string
  }
}

export function useAuth() {
  const store = useAuthStore()

  const user = computed(() => store.user)
  const isAuthenticated = computed(() => store.isAuthenticated)
  const isSuperadmin = computed(() => store.isSuperadmin)

  async function login(
    username: string,
    password: string
  ): Promise<{ success: boolean; requiresPassword?: boolean; error?: string }> {
    try {
      const response = await $fetch<LoginApiResponse>(`${API_BASE}/api/v1/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: { username, password },
      })

      if (response.success && response.data.token) {
        store.setUser(response.data.user!)
        store.setToken(response.data.token)
        return { success: true }
      }

      if (response.success && response.data.requires_password) {
        store.setPendingUsername(response.data.user!.username)
        return { success: true, requiresPassword: true }
      }

      return { success: false, error: response.message }
    } catch (err: any) {
      const data = err?.data
      return { success: false, error: data?.message || 'Terjadi kesalahan, silakan coba lagi' }
    }
  }

  async function createPassword(
    username: string,
    password: string,
    passwordConfirmation: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await $fetch<CreatePasswordApiResponse>(`${API_BASE}/api/v1/create-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: {
          username,
          password,
          password_confirmation: passwordConfirmation,
        },
      })

      if (response.success) {
        store.setUser(response.data.user)
        store.setToken(response.data.token)
        store.setPendingUsername('')
        return { success: true }
      }

      return { success: false, error: response.message }
    } catch (err: any) {
      const data = err?.data
      return { success: false, error: data?.message || 'Terjadi kesalahan, silakan coba lagi' }
    }
  }

  async function logout() {
    try {
      await $fetch(`${API_BASE}/api/v1/logout`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${store.token}`,
          Accept: 'application/json',
        },
      })
    } catch {
      // ignore error
    } finally {
      store.logout()
      navigateTo('/login')
    }
  }

  async function updateProfile(data: {
    full_name: string
    password?: string
    password_confirmation?: string
    avatar?: File | null
  }): Promise<{ success: boolean; error?: string }> {
    try {
      const formData = new FormData()
      formData.append('full_name', data.full_name)
      if (data.password) {
        formData.append('password', data.password)
        formData.append('password_confirmation', data.password_confirmation || '')
      }
      if (data.avatar) {
        formData.append('avatar', data.avatar)
      }
      formData.append('_method', 'PUT')

      const response = await $fetch<{
        success: boolean
        message: string
        data: { user: User }
      }>(`${API_BASE}/api/v1/profile`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${store.token}`,
          Accept: 'application/json',
        },
        body: formData,
      })

      if (response.success) {
        store.updateUser(response.data.user)
        return { success: true }
      }

      return { success: false, error: response.message }
    } catch (err: any) {
      const data = err?.data
      return { success: false, error: data?.message || 'Gagal update profile' }
    }
  }

  return {
    user,
    isAuthenticated,
    isSuperadmin,
    login,
    createPassword,
    logout,
    updateProfile,
  }
}
