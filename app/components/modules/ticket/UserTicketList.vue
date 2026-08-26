<script setup lang="ts">
import type { Ticket } from '~/types/ticket'

const { tickets, searchQuery, filterStatus, filterPriority, selectTicket, selectedTicket, updateTicket, deleteTicket, isLoading, hasMore, total, loadMore, resetAndFetch } = useTickets()

const emit = defineEmits<{
  create: []
}>()

const isCollapsed = ref(false)
const isFilterOpen = ref(false)
const isEditModalOpen = ref(false)
const editingTicket = ref<Ticket | null>(null)

const statusOptions = [
  { value: 'waiting_approval', label: 'Waiting Approval' },
  { value: 'open', label: 'Open' },
  { value: 'closed', label: 'Closed' },
  { value: 'rejected', label: 'Rejected' },
]

const priorityOptions = [
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
]

const hasActiveFilter = computed(() => {
  return filterStatus.value !== null || filterPriority.value !== null
})

function handleSelect(id: string) {
  selectTicket(id)
}

function handleEditTicket(id: string) {
  const ticket = tickets.value.find(t => t.id === id)
  if (ticket) {
    editingTicket.value = ticket
    isEditModalOpen.value = true
  }
}

const isConfirmOpen = ref(false)
const deleteTargetId = ref<string | null>(null)
const alertState = reactive({ isOpen: false, icon: 'success' as 'success' | 'error' | 'warning', title: '', text: '' })

function showAlert(icon: 'success' | 'error' | 'warning', title: string, text: string) {
  alertState.icon = icon
  alertState.title = title
  alertState.text = text
  alertState.isOpen = true
}

async function handleDeleteTicket(id: string) {
  deleteTargetId.value = id
  isConfirmOpen.value = true
}

async function confirmDelete() {
  if (!deleteTargetId.value) return
  isConfirmOpen.value = false
  try {
    await deleteTicket(deleteTargetId.value)
    showAlert('success', 'Berhasil', 'Ticket berhasil dihapus.')
  } catch (error) {
    console.error('Failed to delete ticket:', error)
    showAlert('error', 'Gagal', 'Gagal menghapus ticket.')
  } finally {
    deleteTargetId.value = null
  }
}

async function handleUpdateTicket(data: { title: string; description: string; priorityId: number; highPriorityReason: string; attachments: File[] }) {
  if (!editingTicket.value) return
  try {
    await updateTicket(editingTicket.value.id, data)
    isEditModalOpen.value = false
    editingTicket.value = null
    await resetAndFetch()
  } catch (error) {
    console.error('Failed to update ticket:', error)
    showAlert('error', 'Gagal', 'Gagal mengupdate ticket.')
  }
}

function toggleFilter() {
  isFilterOpen.value = !isFilterOpen.value
}

function closeFilter() {
  isFilterOpen.value = false
}

function toggleStatus(status: string) {
  filterStatus.value = filterStatus.value === status ? null : status
  triggerReset()
}

function togglePriority(priority: string) {
  filterPriority.value = filterPriority.value === priority ? null : priority
  triggerReset()
}

function resetFilters() {
  filterStatus.value = null
  filterPriority.value = null
  triggerReset()
}

let searchDebounce: ReturnType<typeof setTimeout> | null = null

function triggerReset() {
  resetAndFetch()
}

watch(searchQuery, () => {
  if (searchDebounce) clearTimeout(searchDebounce)
  searchDebounce = setTimeout(() => {
    triggerReset()
  }, 300)
})

// Infinity scroll
const loadMoreTrigger = ref<HTMLElement | null>(null)

onMounted(() => {
  resetAndFetch()

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && hasMore.value && !isLoading.value) {
        loadMore()
      }
    },
    { threshold: 0.1 }
  )

  if (loadMoreTrigger.value) {
    observer.observe(loadMoreTrigger.value)
  }
})
</script>

<template>
  <div
    class="bg-white h-full flex flex-col overflow-hidden relative"
    :class="[isCollapsed ? 'w-[68px]' : 'w-full md:w-[380px]']"
  >
    <!-- Header -->
    <div class="p-5 pb-4">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-2">
          <h1 class="text-xl font-bold text-gray-900">My Tickets</h1>
          <span class="text-xs text-gray-400">· {{ tickets.length }} dari {{ total }}</span>
        </div>
        <button
          @click="emit('create')"
          class="px-4 py-2 bg-[#E8B86D] text-white text-sm font-medium rounded-xl hover:bg-[#d4a35a] transition-colors flex items-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span v-if="!isCollapsed">Buat Pengajuan</span>
        </button>
      </div>

      <!-- Search & Filter -->
      <div class="flex gap-2 mb-5">
        <div class="flex-1 relative">
          <svg
            class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search tickets..."
            class="w-full pl-10 pr-10 py-2.5 bg-gray-100 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E8B86D]/50 focus:bg-white transition-all"
          />
          <button
            v-if="searchQuery"
            @click="searchQuery = ''"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <!-- Filter Button -->
        <div class="relative">
          <button
            @click="toggleFilter"
            class="p-2.5 border-2 rounded-xl transition-colors"
            :class="[
              hasActiveFilter
                ? 'border-[#E8B86D] bg-amber-50'
                : 'border-[#E8B86D] hover:bg-amber-50'
            ]"
          >
            <svg
              class="w-5 h-5"
              :class="hasActiveFilter ? 'text-[#d4a35a]' : 'text-[#E8B86D]'"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
          </button>

          <!-- Filter Dropdown -->
          <Transition name="dropdown">
            <div
              v-if="isFilterOpen"
              class="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-3 z-50"
            >
              <!-- Status Filter -->
              <div class="px-4 mb-3">
                <p class="text-xs font-semibold text-gray-500 uppercase mb-2">Status</p>
                <div class="space-y-1">
                  <button
                    v-for="option in statusOptions"
                    :key="option.value"
                    @click="toggleStatus(option.value)"
                    class="flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-lg transition-colors"
                    :class="[
                      filterStatus === option.value
                        ? 'bg-amber-50 text-[#E8B86D]'
                        : 'text-gray-700 hover:bg-gray-50'
                    ]"
                  >
                    <div
                      class="w-4 h-4 rounded border flex items-center justify-center"
                      :class="[
                        filterStatus === option.value
                          ? 'bg-[#E8B86D] border-[#E8B86D]'
                          : 'border-gray-300'
                      ]"
                    >
                      <svg
                        v-if="filterStatus === option.value"
                        class="w-3 h-3 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    {{ option.label }}
                  </button>
                </div>
              </div>

              <!-- Divider -->
              <div class="border-t border-gray-100 mx-4 mb-3" />

              <!-- Priority Filter -->
              <div class="px-4 mb-3">
                <p class="text-xs font-semibold text-gray-500 uppercase mb-2">Priority</p>
                <div class="space-y-1">
                  <button
                    v-for="option in priorityOptions"
                    :key="option.value"
                    @click="togglePriority(option.value)"
                    class="flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-lg transition-colors"
                    :class="[
                      filterPriority === option.value
                        ? 'bg-amber-50 text-[#E8B86D]'
                        : 'text-gray-700 hover:bg-gray-50'
                    ]"
                  >
                    <div
                      class="w-4 h-4 rounded border flex items-center justify-center"
                      :class="[
                        filterPriority === option.value
                          ? 'bg-[#E8B86D] border-[#E8B86D]'
                          : 'border-gray-300'
                      ]"
                    >
                      <svg
                        v-if="filterPriority === option.value"
                        class="w-3 h-3 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    {{ option.label }}
                  </button>
                </div>
              </div>

              <!-- Divider -->
              <div class="border-t border-gray-100 mx-4 mb-3" />

              <!-- Reset Button -->
              <div class="px-4">
                <button
                  @click="resetFilters"
                  class="w-full px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </div>

    <!-- Ticket List -->
    <div class="flex-1 overflow-y-auto px-4 pb-4">
      <!-- Empty State -->
      <div
        v-if="tickets.length === 0 && !isLoading"
        class="flex flex-col items-center justify-center h-full text-center py-12"
      >
        <svg
          class="w-16 h-16 text-gray-300 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
        <p class="text-gray-500 text-sm font-medium mb-1">Belum ada tiket</p>
        <p class="text-gray-400 text-xs">Buat pengajuan ticket pertama Anda</p>
      </div>

      <!-- Ticket Cards -->
      <div v-else class="space-y-2">
        <ModulesTicketUserTicketCard
          v-for="ticket in tickets"
          :key="ticket.id"
          :ticket="ticket"
          :is-selected="selectedTicket?.id === ticket.id"
          @select="handleSelect"
          @edit="handleEditTicket"
          @delete="handleDeleteTicket"
        />
      </div>

      <!-- Loading Indicator - Skeleton -->
      <template v-if="isLoading">
        <div v-for="i in 5" :key="`skeleton-${i}`" class="p-4 border border-gray-200 rounded-xl space-y-3">
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <BaseSkeleton width="w-28" height="h-3" />
              <BaseSkeleton width="w-12" height="h-3" />
            </div>
            <BaseSkeleton width="w-16" height="h-2" />
            <BaseSkeleton width="w-full" height="h-3" />
            <div class="flex gap-1.5">
              <BaseSkeleton width="w-14" height="h-5" rounded="rounded-full" />
              <BaseSkeleton width="w-14" height="h-5" rounded="rounded-full" />
              <BaseSkeleton width="w-14" height="h-5" rounded="rounded-full" />
            </div>
          </div>
        </div>
      </template>

      <!-- Load More Trigger -->
      <div ref="loadMoreTrigger" class="h-1" />
    </div>

    <!-- Edit Ticket Modal -->
    <ModulesTicketEditTicketModal
      :is-open="isEditModalOpen"
      :ticket="editingTicket"
      @close="isEditModalOpen = false; editingTicket = null"
      @submit="handleUpdateTicket"
    />

    <!-- Confirm Delete Modal -->
    <BaseAppConfirmModal
      :is-open="isConfirmOpen"
      title="Hapus Ticket?"
      text="Ticket yang dihapus tidak dapat dikembalikan."
      confirm-text="Ya, Hapus"
      variant="danger"
      @confirm="confirmDelete"
      @cancel="isConfirmOpen = false"
    />

    <!-- Alert Modal -->
    <BaseAppAlertModal
      :is-open="alertState.isOpen"
      :icon="alertState.icon"
      :title="alertState.title"
      :text="alertState.text"
      @close="alertState.isOpen = false"
    />
  </div>
</template>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.15s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
