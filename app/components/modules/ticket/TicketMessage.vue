<script setup lang="ts">
import type { TicketMessage } from '~/types/ticket'

interface Props {
  message: TicketMessage
}

const props = defineProps<Props>()

const { formatMessageDate } = useTickets()

const avatarBg = computed(() => {
  const colors = [
    'bg-pink-200', 'bg-blue-200', 'bg-green-200', 'bg-yellow-200',
    'bg-purple-200', 'bg-indigo-200', 'bg-teal-200', 'bg-orange-200',
  ]
  const index = props.message.user.name.charCodeAt(0) % colors.length
  return colors[index]
})
</script>

<template>
  <div class="flex gap-4">
    <!-- Avatar -->
    <div class="flex-shrink-0">
      <img
        v-if="message.user.avatar"
        :src="message.user.avatar"
        :alt="message.user.name"
        class="w-12 h-12 rounded-full object-cover"
      />
      <div
        v-else
        class="w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium text-gray-700"
        :class="avatarBg"
      >
        {{ message.user.initials || message.user.name.slice(0, 2).toUpperCase() }}
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1">
      <div class="mb-2">
        <h4 class="text-base font-semibold text-gray-900">{{ message.user.name }}</h4>
        <p class="text-sm text-gray-400">{{ formatMessageDate(message.createdAt) }}</p>
      </div>
      <div class="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
        {{ message.content }}
      </div>
    </div>
  </div>
</template>
