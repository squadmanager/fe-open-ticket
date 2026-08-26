<script setup lang="ts">
import type { Ticket } from '~/types/ticket'

interface Props {
  ticket: Ticket
}

const props = defineProps<Props>()

const emit = defineEmits<{
  approved: []
  rejected: []
  closed: []
  back: []
}>()

const { approveTicket, rejectTicket, closeTicket } = useTickets()

const alertState = reactive({ isOpen: false, icon: 'success' as 'success' | 'error' | 'warning', title: '', text: '' })

function showAlert(icon: 'success' | 'error' | 'warning', title: string, text: string) {
  alertState.icon = icon
  alertState.title = title
  alertState.text = text
  alertState.isOpen = true
}

const firstMessage = computed(() => props.ticket.messages[0])

const showActions = computed(() => props.ticket.status === 'waiting_approval')
const showClose = computed(() => props.ticket.status === 'open')

const isApproveModalOpen = ref(false)
const isRejectModalOpen = ref(false)
const isCloseModalOpen = ref(false)
const isProcessing = ref(false)

function formatApprovalDate(dateString: string | null | undefined): string {
  if (!dateString) return ''
  const date = new Date(dateString)
  const day = date.getDate()
  const month = date.toLocaleDateString('en-US', { month: 'long' })
  const year = date.getFullYear()
  const hours = date.getHours()
  const ampm = hours >= 12 ? 'pm' : 'am'
  const displayHours = hours % 12 || 12
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${day} ${month} ${year} at ${displayHours}:${minutes} ${ampm}`
}

async function handleApprove(reason: string) {
  isProcessing.value = true
  try {
    await approveTicket(props.ticket.id, reason)
    emit('approved')
    isApproveModalOpen.value = false
  } catch (error) {
    console.error('Failed to approve ticket:', error)
    showAlert('error', 'Gagal', 'Gagal approve ticket.')
  } finally {
    isProcessing.value = false
  }
}

async function handleReject(reason: string) {
  isProcessing.value = true
  try {
    await rejectTicket(props.ticket.id, reason)
    emit('rejected')
    isRejectModalOpen.value = false
  } catch (error) {
    console.error('Failed to reject ticket:', error)
    showAlert('error', 'Gagal', 'Gagal reject ticket.')
  } finally {
    isProcessing.value = false
  }
}

async function handleClose() {
  isProcessing.value = true
  try {
    await closeTicket(props.ticket.id)
    emit('closed')
    isCloseModalOpen.value = false
    showAlert('success', 'Berhasil', 'Ticket berhasil ditutup.')
  } catch (error) {
    console.error('Failed to close ticket:', error)
    showAlert('error', 'Gagal', 'Gagal menutup ticket.')
  } finally {
    isProcessing.value = false
  }
}
</script>

<template>
  <div class="flex flex-col h-full">
    <!-- Ticket Header -->
    <div class="p-4 md:p-6 bg-white border-b border-gray-200">
      <!-- Back button (mobile only) -->
      <button
        @click="emit('back')"
        class="md:hidden flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-3 transition-colors"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Kembali
      </button>

      <div class="flex items-start justify-between">
        <div>
          <div class="flex items-center gap-3 mb-1">
            <h2 class="text-xl font-bold text-gray-900">{{ ticket.subject }}</h2>
            <span class="text-xs text-gray-400 font-mono">{{ ticket.code }}</span>
          </div>
          <div class="flex flex-wrap gap-2">
            <BaseBadge variant="status" :value="ticket.status" />
            <BaseBadge variant="priority" :value="ticket.priority" />
            <BaseBadge variant="department" :value="ticket.department" />
          </div>
        </div>

        <!-- Action Buttons -->
        <div v-if="showActions || showClose" class="flex gap-2">
          <template v-if="showActions">
            <button
              @click="isApproveModalOpen = true"
              :disabled="isProcessing"
              class="px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-xl hover:bg-green-600 transition-colors disabled:opacity-50"
            >
              Approve
            </button>
            <button
              @click="isRejectModalOpen = true"
              :disabled="isProcessing"
              class="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50"
            >
              Reject
            </button>
          </template>
          <button
            v-if="showClose"
            @click="isCloseModalOpen = true"
            :disabled="isProcessing"
            class="px-4 py-2 bg-gray-500 text-white text-sm font-medium rounded-xl hover:bg-gray-600 transition-colors disabled:opacity-50"
          >
            Close
          </button>
        </div>
      </div>

      <!-- Reason High Priority -->
      <div
        v-if="ticket.reasonHighPriority"
        class="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-xl"
      >
        <div class="flex items-start gap-2">
          <svg class="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <div>
            <p class="text-sm font-medium text-yellow-800">Alasan High Priority</p>
            <p class="text-sm text-yellow-700 mt-0.5">{{ ticket.reasonHighPriority }}</p>
          </div>
        </div>
      </div>

      <!-- Reason Approval -->
      <div
        v-if="ticket.reasonApproval"
        class="mt-3 p-3 rounded-xl"
        :class="ticket.status === 'rejected' ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'"
      >
        <div class="flex items-start gap-2">
          <svg class="w-5 h-5 flex-shrink-0 mt-0.5" :class="ticket.status === 'rejected' ? 'text-red-500' : 'text-green-500'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p class="text-sm font-medium" :class="ticket.status === 'rejected' ? 'text-red-800' : 'text-green-800'">Alasan Approval</p>
            <p class="text-sm mt-0.5" :class="ticket.status === 'rejected' ? 'text-red-700' : 'text-green-700'">{{ ticket.reasonApproval }}</p>
          </div>
        </div>
      </div>

      <!-- Date Time Approval -->
      <div
        v-if="ticket.dateTimeApproval"
        class="mt-3 flex items-center gap-2 text-sm text-gray-500"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span>Disetujui pada: {{ formatApprovalDate(ticket.dateTimeApproval) }}</span>
      </div>
    </div>

    <!-- Ticket Content -->
    <div class="flex-1 overflow-y-auto px-0 py-4 md:p-6 bg-gray-50">
      <!-- Description -->
      <div v-if="ticket.description" class="bg-white rounded-xl p-6 shadow-sm mb-4">
        <h3 class="text-sm font-semibold text-gray-700 mb-2">Deskripsi</h3>
        <p class="text-sm text-gray-600 whitespace-pre-wrap">{{ ticket.description }}</p>
      </div>

      <!-- Ticket Attachments -->
      <div v-if="ticket.attachments && ticket.attachments.length > 0" class="bg-white rounded-xl p-6 shadow-sm mb-4">
        <h3 class="text-sm font-semibold text-gray-700 mb-2">Lampiran</h3>
        <ModulesTicketAttachments :attachments="ticket.attachments" />
      </div>

      <!-- Message Thread -->
      <div v-if="firstMessage" class="bg-white rounded-xl p-6 shadow-sm">
        <ModulesTicketMessage :message="firstMessage" />

        <!-- Attachments -->
        <ModulesTicketAttachments
          v-if="firstMessage.attachments && firstMessage.attachments.length > 0"
          :attachments="firstMessage.attachments"
        />
      </div>
    </div>

    <!-- Modals -->
    <ModulesTicketApproveModal
      :is-open="isApproveModalOpen"
      @close="isApproveModalOpen = false"
      @confirm="handleApprove"
    />

    <ModulesTicketRejectModal
      :is-open="isRejectModalOpen"
      @close="isRejectModalOpen = false"
      @confirm="handleReject"
    />

    <BaseAppConfirmModal
      :is-open="isCloseModalOpen"
      title="Tutup Ticket"
      text="Apakah Anda yakin ingin menutup ticket ini?"
      confirm-text="Ya, Tutup"
      cancel-text="Batal"
      variant="warning"
      @confirm="handleClose"
      @cancel="isCloseModalOpen = false"
    />

    <BaseAppAlertModal
      :is-open="alertState.isOpen"
      :icon="alertState.icon"
      :title="alertState.title"
      :text="alertState.text"
      @close="alertState.isOpen = false"
    />
  </div>
</template>
