export type TicketStatus = 'waiting_approval' | 'open' | 'closed' | 'rejected'
export type TicketPriority = 'low' | 'medium' | 'high'
export type TicketDepartment = 'hr' | 'crm' | 'urbana' | 'serva' | 'support'

export interface TicketUser {
  id: string
  name: string
  email: string
  avatar?: string
  initials?: string
}

export interface TicketAttachment {
  id: string
  name: string
  size: number
  type: 'pdf' | 'image' | 'document' | 'other'
  url: string
  thumbnailUrl?: string
}

export interface TicketMessage {
  id: string
  user: TicketUser
  content: string
  createdAt: string
  attachments?: TicketAttachment[]
}

export interface Ticket {
  id: string
  code: string
  subject: string
  description: string
  status: TicketStatus
  priority: TicketPriority
  department: TicketDepartment
  customer: TicketUser
  messages: TicketMessage[]
  attachments: TicketAttachment[]
  reasonHighPriority?: string | null
  reasonApproval?: string | null
  dateTimeApproval?: string | null
  createdAt: string
  updatedAt: string
}
