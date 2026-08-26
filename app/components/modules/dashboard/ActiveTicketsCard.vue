<script setup lang="ts">
interface Ticket {
  id: string
  subject: string
  description: string
  status: string
  priority: string
  department: string
  customer: { name: string; avatar: string | null }
  created_at: string
}

interface StatusCount {
  status: string
  count: number
}

interface Props {
  tickets: Ticket[]
  statusCounts: StatusCount[]
}

const props = defineProps<Props>()

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

const statusColors: Record<string, { bg: string; text: string }> = {
  waiting_approval: { bg: 'bg-blue-500', text: 'text-white' },
  open: { bg: 'bg-yellow-500', text: 'text-white' },
  closed: { bg: 'bg-gray-400', text: 'text-white' },
  rejected: { bg: 'bg-red-500', text: 'text-white' },
}

const statusLabels: Record<string, string> = {
  waiting_approval: 'Waiting Approval',
  open: 'Open',
  closed: 'Closed',
  rejected: 'Rejected',
}

const priorityColors: Record<string, string> = {
  low: 'text-green-500',
  medium: 'text-yellow-500',
  high: 'text-red-500',
}

const dotCounts = computed(() => {
  const map: Record<string, number> = {}
  for (const s of props.statusCounts) {
    map[s.status] = s.count
  }
  return map
})
</script>

<template>
  <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
    <!-- Header -->
    <div class="flex items-center justify-between p-5 pb-0">
      <h3 class="text-lg font-bold text-gray-900">Recent Tickets</h3>
      <div class="flex items-center gap-4">
        <div v-if="(dotCounts.waiting_approval || 0) > 0" class="flex items-center gap-1.5">
          <span class="w-2.5 h-2.5 rounded-full bg-blue-500" />
          <span class="text-sm font-medium text-gray-600">{{ dotCounts.waiting_approval || 0 }}</span>
        </div>
        <div v-if="(dotCounts.open || 0) > 0" class="flex items-center gap-1.5">
          <span class="w-2.5 h-2.5 rounded-full bg-yellow-500" />
          <span class="text-sm font-medium text-gray-600">{{ dotCounts.open || 0 }}</span>
        </div>
        <div v-if="(dotCounts.closed || 0) > 0" class="flex items-center gap-1.5">
          <span class="w-2.5 h-2.5 rounded-full bg-gray-400" />
          <span class="text-sm font-medium text-gray-600">{{ dotCounts.closed || 0 }}</span>
        </div>
        <div v-if="(dotCounts.rejected || 0) > 0" class="flex items-center gap-1.5">
          <span class="w-2.5 h-2.5 rounded-full bg-red-500" />
          <span class="text-sm font-medium text-gray-600">{{ dotCounts.rejected || 0 }}</span>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="tickets.length === 0" class="p-10 text-center text-gray-400 text-sm">
      Belum ada ticket
    </div>

    <!-- Ticket List -->
    <div v-else class="p-5 space-y-4 max-h-[400px] overflow-y-auto">
      <div
        v-for="ticket in tickets"
        :key="ticket.id"
        class="p-4 border border-gray-100 rounded-xl hover:shadow-sm transition-shadow"
      >
        <!-- Top row: preview + time + status -->
        <div class="flex items-center justify-between mb-3">
          <p class="text-sm text-gray-700 truncate flex-1 mr-4">{{ ticket.description || ticket.subject }}</p>
          <div class="flex items-center gap-2">
            <span class="text-xs text-gray-400">{{ formatRelativeTime(ticket.created_at) }}</span>
            <span
              class="px-2.5 py-1 rounded-full text-xs font-medium"
              :class="[statusColors[ticket.status]?.bg, statusColors[ticket.status]?.text]"
            >
              {{ statusLabels[ticket.status] || ticket.status }}
            </span>
          </div>
        </div>

        <!-- Bottom row: customer + department + priority -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <!-- Customer -->
            <div class="flex items-center gap-1.5">
              <img
                v-if="ticket.customer.avatar"
                :src="ticket.customer.avatar"
                :alt="ticket.customer.name"
                class="w-6 h-6 rounded-full object-cover"
              />
              <span class="text-sm font-medium text-gray-700">{{ ticket.customer.name }}</span>
            </div>

            <!-- Department -->
            <div class="flex items-center gap-1.5 px-2 py-1 bg-gray-100 rounded-lg">
              <span class="text-xs font-medium text-gray-600 uppercase">{{ ticket.department }}</span>
            </div>

            <!-- Priority -->
            <span class="text-sm font-medium capitalize" :class="priorityColors[ticket.priority]">
              {{ ticket.priority }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
