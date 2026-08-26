export interface User {
  id: string | number
  name: string
  username: string
  avatar: string | null
  role_id: number
  role: {
    id: number
    name: string
  }
}

export interface LoginPayload {
  username: string
  password: string
}

export interface AuthResponse {
  user: User
  token: string
}

export interface LoginResponse {
  user: {
    username: string
  }
  requires_password: boolean
}
