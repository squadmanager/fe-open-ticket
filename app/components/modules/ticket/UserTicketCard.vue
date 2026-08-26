<script setup lang="ts">
import type { Ticket } from '~/types/ticket'

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
    <div class="flex items-start justify-between gap-3">
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

        <p class="text-sm text-gray-500 mb-2">
          {{ ticket.subject }}
        </p>

        <!-- Badges -->
        <div class="flex flex-wrap gap-1.5">
          <BaseBadge variant="status" :value="ticket.status" />
          <BaseBadge variant="priority" :value="ticket.priority" />
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
