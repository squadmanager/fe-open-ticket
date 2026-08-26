import { useTicketsStore } from '~/stores/tickets'
import { useTicketApi } from '~/composables/useTicketApi'
import type { Ticket } from '~/types/ticket'

function mapAttachmentType(mimeType: string): 'pdf' | 'image' | 'document' | 'other' {
  if (mimeType === 'application/pdf') return 'pdf'
  if (mimeType?.startsWith('image/')) return 'image'
  return 'other'
}

export function useTickets() {
  const store = useTicketsStore()

  const tickets = computed(() => store.filteredTickets)
  const selectedTicket = computed(() => store.selectedTicket)
  const openTicketCount = computed(() => store.openTicketCount)
  const isLoading = computed(() => store.isLoading)
  const hasMore = computed(() => store.hasMore)
  const total = computed(() => store.total)

  const searchQuery = computed({
    get: () => store.searchQuery,
    set: (value: string) => store.setSearchQuery(value),
  })

  const filterStatus = computed({
    get: () => store.filterStatus,
    set: (value: string | null) => store.setFilterStatus(value),
  })

  const filterPriority = computed({
    get: () => store.filterPriority,
    set: (value: string | null) => store.setFilterPriority(value),
  })

  function selectTicket(id: string) {
    store.selectTicket(id)
  }

  function loadMore() {
    store.loadMore()
  }

  function resetAndFetch() {
    store.resetAndFetch()
  }

  async function createTicket(data: {
    title: string
    description: string
    priorityId: number
    appId: number
    highPriorityReason: string
    attachments: File[]
  }) {
    const api = useTicketApi()
    const formData = new FormData()
    formData.append('title', data.title)
    formData.append('description', data.description)
    formData.append('priority_id', String(data.priorityId))
    formData.append('app_id', String(data.appId))
    if (data.highPriorityReason) {
      formData.append('reason_high_priority', data.highPriorityReason)
    }
    if (data.attachments.length > 0) {
      data.attachments.forEach((file) => {
        formData.append('attachments[]', file)
      })
    }

    const response = await api.createTicket(formData)
    const mapped = mapApiTicket(response.data)
    store.addTicket(mapped)
    store.selectTicket(mapped.id)
    return mapped
  }

  async function updateTicket(id: string, data: {
    title: string
    description: string
    priorityId: number
    highPriorityReason: string
    attachments: File[]
    existingAttachments?: string[]
  }) {
    const api = useTicketApi()
    const formData = new FormData()
    formData.append('title', data.title)
    formData.append('description', data.description)
    formData.append('priority_id', String(data.priorityId))
    if (data.highPriorityReason) {
      formData.append('reason_high_priority', data.highPriorityReason)
    }
    if (data.existingAttachments && data.existingAttachments.length > 0) {
      data.existingAttachments.forEach((id) => {
        formData.append('existing_attachment_ids[]', id)
      })
    }
    if (data.attachments.length > 0) {
      data.attachments.forEach((file) => {
        formData.append('attachments[]', file)
      })
    }

    const response = await api.updateTicket(id, formData)
    const mapped = mapApiTicket(response.data)
    store.updateTicketInList(mapped)
    return mapped
  }

  async function deleteTicket(id: string) {
    const api = useTicketApi()
    await api.deleteTicket(id)
    store.removeTicket(id)
  }

  async function approveTicket(id: string, reason: string) {
    const api = useTicketApi()
    const response = await api.approveTicket(id, reason)
    const mapped = mapApiTicket(response.data)
    store.updateTicketInList(mapped)
    return mapped
  }

  async function rejectTicket(id: string, reason: string) {
    const api = useTicketApi()
    const response = await api.rejectTicket(id, reason)
    const mapped = mapApiTicket(response.data)
    store.updateTicketInList(mapped)
    return mapped
  }

  async function closeTicket(id: string) {
    const api = useTicketApi()
    const response = await api.closeTicket(id)
    const mapped = mapApiTicket(response.data)
    store.updateTicketInList(mapped)
    return mapped
  }

  async function reopenTicket(id: string) {
    const api = useTicketApi()
    const response = await api.reopenTicket(id)
    const mapped = mapApiTicket(response.data)
    store.updateTicketInList(mapped)
    return mapped
  }

  function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  function formatRelativeTime(dateString: string): string {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'just now'
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
  }

  function formatMessageDate(dateString: string): string {
    const date = new Date(dateString)
    const day = date.getDate()
    const suffix = getDaySuffix(day)
    const month = date.toLocaleDateString('en-US', { month: 'long' })
    const year = date.getFullYear()
    const hours = date.getHours()
    const ampm = hours >= 12 ? 'pm' : 'am'
    const displayHours = hours % 12 || 12
    return `${day}${suffix} of ${month} at ${displayHours} ${ampm}`
  }

  function getDaySuffix(day: number): string {
    if (day >= 11 && day <= 13) return 'th'
    switch (day % 10) {
      case 1: return 'st'
      case 2: return 'nd'
      case 3: return 'rd'
      default: return 'th'
    }
  }

  return {
    tickets,
    selectedTicket,
    openTicketCount,
    searchQuery,
    filterStatus,
    filterPriority,
    isLoading,
    hasMore,
    total,
    selectTicket,
    loadMore,
    resetAndFetch,
    createTicket,
    updateTicket,
    deleteTicket,
    approveTicket,
    rejectTicket,
    closeTicket,
    reopenTicket,
    formatFileSize,
    formatRelativeTime,
    formatMessageDate,
  }
}

function mapApiTicket(apiTicket: any): Ticket {
  const statusMap: Record<string, string> = {
    'waiting_approval': 'waiting_approval',
    'open': 'open',
    'closed': 'closed',
    'rejected': 'rejected',
  }
  const priorityMap: Record<string, string> = {
    'low': 'low',
    'medium': 'medium',
    'high': 'high',
  }
  const departmentMap: Record<string, string> = {
    'hr': 'hr',
    'crm': 'crm',
    'urbana': 'urbana',
    'serva': 'serva',
    'support': 'support',
  }

  return {
    id: apiTicket.id,
    code: apiTicket.code,
    subject: apiTicket.subject,
    description: apiTicket.description || '',
    status: statusMap[apiTicket.status] || 'open',
    priority: priorityMap[apiTicket.priority] || 'medium',
    department: departmentMap[apiTicket.department] || 'crm',
    customer: {
      id: String(apiTicket.customer.id),
      name: apiTicket.customer.name,
      email: apiTicket.customer.username,
      avatar: apiTicket.customer.avatar || undefined,
      initials: apiTicket.customer.name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2),
    },
    messages: (apiTicket.messages || []).map((msg: any) => ({
      id: msg.id,
      user: {
        id: String(msg.user.id),
        name: msg.user.name,
        email: msg.user.username,
        avatar: msg.user.avatar || undefined,
        initials: msg.user.name
          .split(' ')
          .map((n: string) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2),
      },
      content: msg.content,
      createdAt: msg.created_at,
      attachments: (msg.attachments || []).map((att: any, idx: number) => ({
        id: `${msg.id}-att-${idx}`,
        name: att.name || `File ${idx + 1}`,
        size: att.size || 0,
        type: mapAttachmentType(att.type),
        url: att.url || '#',
      })),
    })),
    createdAt: apiTicket.created_at,
    updatedAt: apiTicket.updated_at,
    attachments: (apiTicket.attachments || []).map((att: any, idx: number) => ({
      id: `ticket-att-${idx}`,
      name: att.name || `File ${idx + 1}`,
      size: att.size || 0,
      type: mapAttachmentType(att.type),
      url: att.url || '#',
    })),
    reasonHighPriority: apiTicket.reason_high_priority || null,
    reasonApproval: apiTicket.reason_approval || null,
    dateTimeApproval: apiTicket.date_time_approval || null,
  }
}
