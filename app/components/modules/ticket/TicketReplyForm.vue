<script setup lang="ts">
import type { TicketUser } from '~/types/ticket'

interface Props {
  recipient: TicketUser
}

const props = defineProps<Props>()

const emit = defineEmits<{
  remove: []
}>()

const replyContent = ref(`Hi ${props.recipient.name.split(' ')[0]},\n\nThank you for contacting us. We sure can help you. Shall we schedule a call tomorrow around 12.00pm. We can help you better if we are on a call.\n\nPlease let us know your availability.`)

const activeAlign = ref<'left' | 'center' | 'right'>('left')
const isBold = ref(false)
const isItalic = ref(false)
const isUnderline = ref(false)
</script>

<template>
  <div class="mt-4 pt-4 border-t border-gray-200">
    <!-- Reply Header -->
    <div class="flex items-center gap-3 mb-4">
      <div class="w-10 h-10 rounded-full bg-[#E8B86D] flex items-center justify-center text-sm font-medium text-white">
        A
      </div>
      <div class="flex items-center gap-2">
        <span class="text-sm text-gray-500">Reply to:</span>
        <span class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-full text-sm text-gray-700">
          {{ recipient.name }} ({{ recipient.email }})
          <button
            class="ml-1 text-gray-400 hover:text-gray-600 transition-colors"
            @click="emit('remove')"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </span>
      </div>
    </div>

    <!-- Toolbar -->
    <div class="flex items-center gap-1 p-2 border border-gray-200 rounded-t-xl bg-white">
      <!-- Paragraph Dropdown -->
      <select class="px-3 py-1.5 text-sm text-gray-700 border-r border-gray-200 focus:outline-none">
        <option>Paragraph</option>
        <option>Heading 1</option>
        <option>Heading 2</option>
        <option>Heading 3</option>
      </select>

      <!-- Text Formatting -->
      <div class="flex items-center gap-0.5 px-2">
        <button
          class="p-1.5 rounded hover:bg-gray-100 transition-colors"
          :class="{ 'bg-[#E8B86D]/20 text-[#E8B86D]': isBold }"
          @click="isBold = !isBold"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z" />
          </svg>
        </button>
        <button
          class="p-1.5 rounded hover:bg-gray-100 transition-colors"
          :class="{ 'bg-[#E8B86D]/20 text-[#E8B86D]': isItalic }"
          @click="isItalic = !isItalic"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 4h4m-2 0l-4 16m-2 0h4m2-16l4 16" />
          </svg>
        </button>
        <button
          class="p-1.5 rounded hover:bg-gray-100 transition-colors"
          :class="{ 'bg-[#E8B86D]/20 text-[#E8B86D]': isUnderline }"
          @click="isUnderline = !isUnderline"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4v7a5 5 0 0010 0V4M5 21h14" />
          </svg>
        </button>
      </div>

      <!-- Alignment -->
      <div class="flex items-center gap-0.5 px-2 border-l border-gray-200">
        <button
          class="p-1.5 rounded transition-colors"
          :class="activeAlign === 'left' ? 'bg-[#E8B86D]/20 text-[#E8B86D]' : 'hover:bg-gray-100'"
          @click="activeAlign = 'left'"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h10M4 18h14" />
          </svg>
        </button>
        <button
          class="p-1.5 rounded transition-colors"
          :class="activeAlign === 'center' ? 'bg-[#E8B86D]/20 text-[#E8B86D]' : 'hover:bg-gray-100'"
          @click="activeAlign = 'center'"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M7 12h10M4 18h16" />
          </svg>
        </button>
        <button
          class="p-1.5 rounded transition-colors"
          :class="activeAlign === 'right' ? 'bg-[#E8B86D]/20 text-[#E8B86D]' : 'hover:bg-gray-100'"
          @click="activeAlign = 'right'"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M10 12h10M6 18h14" />
          </svg>
        </button>
      </div>

      <!-- Lists -->
      <div class="flex items-center gap-0.5 px-2 border-l border-gray-200">
        <button class="p-1.5 rounded hover:bg-gray-100 transition-colors">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
          </svg>
        </button>
        <button class="p-1.5 rounded hover:bg-gray-100 transition-colors">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
        </button>
      </div>

      <!-- Link -->
      <div class="px-2 border-l border-gray-200">
        <button class="p-1.5 rounded hover:bg-gray-100 transition-colors">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Textarea -->
    <textarea
      v-model="replyContent"
      rows="8"
      class="w-full p-4 border border-t-0 border-gray-200 rounded-b-xl text-sm text-gray-700 leading-relaxed focus:outline-none focus:border-[#E8B86D] resize-none"
    />
  </div>
</template>
