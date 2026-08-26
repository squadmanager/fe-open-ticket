import { defineStore } from 'pinia'
import type { Ticket } from '~/types/ticket'
import { useTicketApi } from '~/composables/useTicketApi'

interface TicketsState {
  tickets: Ticket[]
  selectedTicketId: string | null
  searchQuery: string
  filterStatus: string | null
  filterPriority: string | null
  currentPage: number
  lastPage: number
  total: number
  perPage: number
  isLoading: boolean
  hasMore: boolean
}

function mapAttachmentType(mimeType: string): 'pdf' | 'image' | 'document' | 'other' {
  if (mimeType === 'application/pdf') return 'pdf'
  if (mimeType?.startsWith('image/')) return 'image'
  return 'other'
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

export const useTicketsStore = defineStore('tickets', {
  state: (): TicketsState => ({
    tickets: [],
    selectedTicketId: null,
    searchQuery: '',
    filterStatus: null,
    filterPriority: null,
    currentPage: 1,
    lastPage: 1,
    total: 0,
    perPage: 15,
    isLoading: false,
    hasMore: true,
  }),
  getters: {
    filteredTickets: (state) => {
      let result = state.tickets

      if (state.searchQuery) {
        const query = state.searchQuery.toLowerCase()
        result = result.filter(
          (ticket) =>
            ticket.subject.toLowerCase().includes(query) ||
            ticket.customer.name.toLowerCase().includes(query)
        )
      }

      if (state.filterStatus) {
        result = result.filter((ticket) => ticket.status === state.filterStatus)
      }

      if (state.filterPriority) {
        result = result.filter((ticket) => ticket.priority === state.filterPriority)
      }

      return result
    },
    selectedTicket: (state) => {
      return state.tickets.find((t) => t.id === state.selectedTicketId) || null
    },
    openTicketCount: (state) => {
      return state.tickets.filter((t) => t.status === 'open' || t.status === 'waiting_approval').length
    },
  },
  actions: {
    selectTicket(id: string) {
      this.selectedTicketId = id
    },
    addTicket(ticket: Ticket) {
      this.tickets.unshift(ticket)
    },
    updateTicketInList(ticket: Ticket) {
      const index = this.tickets.findIndex((t) => t.id === ticket.id)
      if (index !== -1) {
        this.tickets[index] = ticket
      }
    },
    removeTicket(id: string) {
      this.tickets = this.tickets.filter((t) => t.id !== id)
      if (this.selectedTicketId === id) {
        this.selectedTicketId = null
      }
    },
    setSearchQuery(query: string) {
      this.searchQuery = query
    },
    setFilterStatus(status: string | null) {
      this.filterStatus = status
    },
    setFilterPriority(priority: string | null) {
      this.filterPriority = priority
    },
    async fetchTickets(reset = false) {
      if (this.isLoading) return

      if (reset) {
        this.currentPage = 1
        this.tickets = []
        this.hasMore = true
      }

      if (!this.hasMore && !reset) return

      this.isLoading = true

      try {
        const { fetchTickets } = useTicketApi()
        const params: Record<string, any> = {
          page: this.currentPage,
          per_page: this.perPage,
        }
        if (this.searchQuery) params.search = this.searchQuery
        if (this.filterStatus) {
          const statusIdMap: Record<string, number> = {
            waiting_approval: 1,
            open: 2,
            closed: 3,
            rejected: 4,
          }
          params.status = statusIdMap[this.filterStatus] || this.filterStatus
        }
        if (this.filterPriority) {
          const priorityIdMap: Record<string, number> = {
            low: 1,
            medium: 2,
            high: 3,
          }
          params.priority = priorityIdMap[this.filterPriority] || this.filterPriority
        }

        const response = await fetchTickets(params)
        const mapped = response.data.map(mapApiTicket)

        if (reset) {
          this.tickets = mapped
        } else {
          this.tickets.push(...mapped)
        }

        this.lastPage = response.meta.last_page
        this.total = response.meta.total
        this.hasMore = this.currentPage < this.lastPage
        this.currentPage++
      } catch (error) {
        console.error('Failed to fetch tickets:', error)
      } finally {
        this.isLoading = false
      }
    },
    async loadMore() {
      await this.fetchTickets(false)
    },
    async resetAndFetch() {
      await this.fetchTickets(true)
    },
  },
})
