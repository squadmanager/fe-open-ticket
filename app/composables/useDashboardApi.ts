import { useAuthStore } from '~/stores/auth'

const API_BASE = 'http://127.0.0.1:8000'

export interface DashboardData {
  total_tickets: number
  total_mine: number
  total_change_percent: number
  mine_change_percent: number
  status_counts: { status: string; count: number }[]
  priority_counts: { priority: string; count: number }[]
  app_counts: { app: string; count: number }[]
  best_agent: {
    id: string
    name: string
    avatar: string | null
    tickets_created: number
  } | null
  recent_tickets: {
    id: string
    subject: string
    description: string
    status: string
    priority: string
    department: string
    customer: { name: string; avatar: string | null }
    date_time: string | null
    created_at: string
  }[]
}

export function useDashboardApi() {
  const store = useAuthStore()

  async function fetchDashboard(): Promise<DashboardData> {
    const response = await $fetch<DashboardData>(`${API_BASE}/api/v1/dashboard`, {
      headers: {
        Authorization: `Bearer ${store.token}`,
        Accept: 'application/json',
      },
    })
    return response
  }

  return { fetchDashboard }
}
