<script setup lang="ts">
import type { Ticket } from '~/types/ticket'
import { useAuthStore } from '~/stores/auth'

interface Props {
  ticket: Ticket
  isSelected?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isSelected: false,
})

const emit = defineEmits<{
  select: [id: string]
  edit: [id: string]
  delete: [id: string]
}>()

const { formatRelativeTime } = useTickets()
const authStore = useAuthStore()

const isSuperadmin = computed(() => authStore.user?.role_id === 1)

const avatarBg = computed(() => {
  const colors = [
    'bg-pink-200', 'bg-blue-200', 'bg-green-200', 'bg-yellow-200',
    'bg-purple-200', 'bg-indigo-200', 'bg-teal-200', 'bg-orange-200',
  ]
  const index = props.ticket.customer.name.charCodeAt(0) % colors.length
  return colors[index]
})
</script>

<template>
  <div
    class="p-4 border border-gray-200 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-sm"
    :class="[
      isSelected
        ? 'border-[#E8B86D] bg-amber-50/50 shadow-sm'
        : 'bg-white hover:border-gray-300'
    ]"
    @click="emit('select', ticket.id)"
  >
    <!-- Superadmin view: show avatar + customer name -->
    <div v-if="isSuperadmin" class="flex items-start gap-3">
      <!-- Avatar -->
      <div class="flex-shrink-0">
        <img
          v-if="ticket.customer.avatar"
          :src="ticket.customer.avatar"
          :alt="ticket.customer.name"
          class="w-10 h-10 rounded-full object-cover"
        />
        <div
          v-else
          class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium text-gray-700"
          :class="avatarBg"
        >
          {{ ticket.customer.initials || ticket.customer.name.slice(0, 2).toUpperCase() }}
        </div>
      </div>

      <!-- Content -->
      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between gap-2 mb-1">
          <h4 class="text-sm font-semibold text-gray-900 truncate">
            {{ ticket.customer.name }}
          </h4>
          <span class="text-xs text-gray-400 whitespace-nowrap">
            {{ formatRelativeTime(ticket.createdAt) }}
          </span>
        </div>

        <p class="text-xs text-gray-400 font-mono mb-1.5">{{ ticket.code }}</p>

        <p class="text-sm text-gray-500 truncate mb-2">
          {{ ticket.subject }}
        </p>

        <!-- Badges -->
        <div class="flex flex-wrap gap-1.5">
          <BaseBadge variant="status" :value="ticket.status" />
          <BaseBadge variant="priority" :value="ticket.priority" />
          <BaseBadge variant="department" :value="ticket.department" />
        </div>
      </div>

      <!-- Menu Dropdown -->
      <div class="flex-shrink-0" @click.stop>
        <ModulesTicketMenuDropdown
          :ticket="ticket"
          @edit="emit('edit', $event)"
          @delete="emit('delete', $event)"
        />
      </div>
    </div>

    <!-- Non-superadmin view: show subject only -->
    <div v-else class="flex items-start justify-between gap-3">
      <!-- Content -->
      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between gap-2 mb-1">
          <h4 class="text-sm font-semibold text-gray-900 truncate">
            {{ ticket.subject }}
          </h4>
          <span class="text-xs text-gray-400 whitespace-nowrap">
            {{ formatRelativeTime(ticket.createdAt) }}
          </span>
        </div>

        <p class="text-xs text-gray-400 font-mono mb-1.5">{{ ticket.code }}</p>

        <p class="text-sm text-gray-500 truncate mb-2">
          {{ ticket.subject }}
        </p>

        <!-- Badges -->
        <div class="flex flex-wrap gap-1.5">
          <BaseBadge variant="status" :value="ticket.status" />
          <BaseBadge variant="priority" :value="ticket.priority" />
          <BaseBadge variant="department" :value="ticket.department" />
        </div>
      </div>

      <!-- Menu Dropdown -->
      <div class="flex-shrink-0" @click.stop>
        <ModulesTicketMenuDropdown
          :ticket="ticket"
          @edit="emit('edit', $event)"
          @delete="emit('delete', $event)"
        />
      </div>
    </div>
  </div>
</template>
