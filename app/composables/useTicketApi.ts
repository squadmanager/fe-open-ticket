import { useAuthStore } from '~/stores/auth'

const API_BASE = 'http://127.0.0.1:8000'

export interface TicketApiResponse {
  data: any[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

export interface TicketSingleApiResponse {
  data: any
}

export interface AppItem {
  id: number
  code: string
  name: string
}

export interface PriorityItem {
  id: number
  name: string
  color: string
}

export function useTicketApi() {
  const store = useAuthStore()

  const authHeaders = computed(() => ({
    Authorization: `Bearer ${store.token}`,
    Accept: 'application/json',
  }))

  async function fetchTickets(params: {
    page?: number
    per_page?: number
    search?: string
    status?: string
    priority?: string
  }): Promise<TicketApiResponse> {
    const query = new URLSearchParams()
    if (params.page) query.set('page', String(params.page))
    if (params.per_page) query.set('per_page', String(params.per_page))
    if (params.search) query.set('search', params.search)
    if (params.status) query.set('status', params.status)
    if (params.priority) query.set('priority', params.priority)

    const response = await $fetch<TicketApiResponse>(`${API_BASE}/api/v1/tickets?${query.toString()}`, {
      headers: authHeaders.value,
    })

    return response
  }

  async function getTicket(id: string): Promise<TicketSingleApiResponse> {
    const response = await $fetch<TicketSingleApiResponse>(`${API_BASE}/api/v1/tickets/${id}`, {
      headers: authHeaders.value,
    })
    return response
  }

  async function createTicket(formData: FormData): Promise<TicketSingleApiResponse> {
    const response = await $fetch<TicketSingleApiResponse>(`${API_BASE}/api/v1/tickets`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${store.token}`,
        Accept: 'application/json',
      },
      body: formData,
    })
    return response
  }

  async function updateTicket(id: string, formData: FormData): Promise<TicketSingleApiResponse> {
    formData.append('_method', 'PUT')
    const response = await $fetch<TicketSingleApiResponse>(`${API_BASE}/api/v1/tickets/${id}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${store.token}`,
        Accept: 'application/json',
      },
      body: formData,
    })
    return response
  }

  async function deleteTicket(id: string): Promise<void> {
    await $fetch(`${API_BASE}/api/v1/tickets/${id}`, {
      method: 'DELETE',
      headers: authHeaders.value,
    })
  }

  async function approveTicket(id: string, reason: string): Promise<TicketSingleApiResponse> {
    const response = await $fetch<TicketSingleApiResponse>(`${API_BASE}/api/v1/tickets/${id}/approve`, {
      method: 'POST',
      headers: authHeaders.value,
      body: { reason },
    })
    return response
  }

  async function rejectTicket(id: string, reason: string): Promise<TicketSingleApiResponse> {
    const response = await $fetch<TicketSingleApiResponse>(`${API_BASE}/api/v1/tickets/${id}/reject`, {
      method: 'POST',
      headers: authHeaders.value,
      body: { reason },
    })
    return response
  }

  async function closeTicket(id: string): Promise<TicketSingleApiResponse> {
    const response = await $fetch<TicketSingleApiResponse>(`${API_BASE}/api/v1/tickets/${id}/close`, {
      method: 'POST',
      headers: authHeaders.value,
    })
    return response
  }

  async function reopenTicket(id: string): Promise<TicketSingleApiResponse> {
    const response = await $fetch<TicketSingleApiResponse>(`${API_BASE}/api/v1/tickets/${id}/reopen`, {
      method: 'POST',
      headers: authHeaders.value,
    })
    return response
  }

  async function fetchApps(): Promise<{ data: AppItem[] }> {
    const response = await $fetch<{ data: AppItem[] }>(`${API_BASE}/api/v1/apps`, {
      headers: authHeaders.value,
    })
    return response
  }

  async function fetchPriorities(): Promise<{ data: PriorityItem[] }> {
    const response = await $fetch<{ data: PriorityItem[] }>(`${API_BASE}/api/v1/priorities`, {
      headers: authHeaders.value,
    })
    return response
  }

  return {
    fetchTickets,
    getTicket,
    createTicket,
    updateTicket,
    deleteTicket,
    approveTicket,
    rejectTicket,
    closeTicket,
    reopenTicket,
    fetchApps,
    fetchPriorities,
  }
}
