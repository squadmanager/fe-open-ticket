<script setup lang="ts">
import { useTicketApi } from '~/composables/useTicketApi'
import type { AppItem, PriorityItem } from '~/composables/useTicketApi'

interface Props {
  isOpen: boolean
  isSubmitting?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isSubmitting: false,
})

const emit = defineEmits<{
  close: []
  submit: [data: { title: string; description: string; priorityId: number; appId: number; highPriorityReason: string; attachments: File[] }]
}>()

const api = useTicketApi()

const form = reactive({
  title: '',
  description: '',
  priorityId: 0,
  appId: 0,
  highPriorityReason: '',
})

const attachments = ref<File[]>([])
const fileInputRef = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)

const apps = ref<AppItem[]>([])
const priorities = ref<PriorityItem[]>([])

const isHighPriority = computed(() => {
  const highPriority = priorities.value.find(p => p.name.toLowerCase() === 'high')
  return highPriority && form.priorityId === highPriority.id
})

const isFormValid = computed(() => {
  const titleValid = form.title.trim().length >= 5
  const descValid = form.description.trim().length >= 10
  const priorityValid = form.priorityId > 0
  const appValid = form.appId > 0

  if (isHighPriority.value) {
    return titleValid && descValid && priorityValid && appValid && form.highPriorityReason.trim().length > 0
  }

  return titleValid && descValid && priorityValid && appValid
})

async function loadData() {
  try {
    const [appsRes, prioritiesRes] = await Promise.all([
      api.fetchApps(),
      api.fetchPriorities(),
    ])
    apps.value = appsRes.data
    priorities.value = prioritiesRes.data
  } catch (error) {
    console.error('Failed to load data:', error)
  }
}

function handleSubmit() {
  if (!isFormValid.value) return
  emit('submit', {
    title: form.title,
    description: form.description,
    priorityId: form.priorityId,
    appId: form.appId,
    highPriorityReason: form.highPriorityReason,
    attachments: attachments.value,
  })
}

function resetForm() {
  form.title = ''
  form.description = ''
  form.priorityId = 0
  form.appId = 0
  form.highPriorityReason = ''
  attachments.value = []
}

function handleClose() {
  resetForm()
  emit('close')
}

function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files) {
    addFiles(Array.from(target.files))
  }
}

function addFiles(newFiles: File[]) {
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf']
  const maxSize = 5 * 1024 * 1024

  for (const file of newFiles) {
    if (!validTypes.includes(file.type)) {
      fileAlertState.icon = 'warning'
      fileAlertState.title = 'File tidak valid'
      fileAlertState.text = 'Hanya file Image dan PDF yang diperbolehkan'
      fileAlertState.isOpen = true
      continue
    }
    if (file.size > maxSize) {
      fileAlertState.icon = 'warning'
      fileAlertState.title = 'File terlalu besar'
      fileAlertState.text = 'Ukuran file maksimal 5MB'
      fileAlertState.isOpen = true
      continue
    }
    if (attachments.value.length >= 5) {
      fileAlertState.icon = 'warning'
      fileAlertState.title = 'Batas file'
      fileAlertState.text = 'Maksimal 5 file'
      fileAlertState.isOpen = true
      break
    }
    attachments.value.push(file)
  }
}

const fileAlertState = reactive({ isOpen: false, icon: 'warning' as 'success' | 'error' | 'warning', title: '', text: '' })

function removeAttachment(index: number) {
  attachments.value.splice(index, 1)
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function getFileIcon(type: string) {
  if (type.startsWith('image/')) return '🖼️'
  if (type === 'application/pdf') return '📄'
  return '📎'
}

function handleDragOver(event: DragEvent) {
  event.preventDefault()
  isDragging.value = true
}

function handleDragLeave() {
  isDragging.value = false
}

function handleDrop(event: DragEvent) {
  event.preventDefault()
  isDragging.value = false
  if (event.dataTransfer?.files) {
    addFiles(Array.from(event.dataTransfer.files))
  }
}

function triggerFileInput() {
  fileInputRef.value?.click()
}

watch(() => props.isOpen, (val) => {
  if (val) {
    resetForm()
    loadData()
  }
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4"
      >
        <!-- Overlay -->
        <div class="absolute inset-0 bg-black/50 transition-opacity" @click="!isSubmitting && handleClose()" />

        <!-- Modal -->
        <div class="relative bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden z-10">
          <!-- Header -->
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 class="text-lg font-bold text-gray-900">Buat Pengajuan Ticket</h2>
            <button
              @click="handleClose"
              class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Body -->
          <div class="px-6 py-5 overflow-y-auto max-h-[calc(90vh-140px)]">
            <!-- App -->
            <div class="mb-5">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Aplikasi <span class="text-red-500">*</span>
              </label>
              <select
                v-model="form.appId"
                class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#E8B86D] transition-colors bg-white"
              >
                <option :value="0" disabled>Select Aplikasi</option>
                <option
                  v-for="app in apps"
                  :key="app.id"
                  :value="app.id"
                >
                  {{ app.name }}
                </option>
              </select>
            </div>

            <!-- Priority -->
            <div class="mb-5">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Priority <span class="text-red-500">*</span>
              </label>
              <select
                v-model="form.priorityId"
                class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#E8B86D] transition-colors bg-white"
              >
                <option :value="0" disabled>Select Priority</option>
                <option
                  v-for="p in priorities"
                  :key="p.id"
                  :value="p.id"
                >
                  {{ p.name }}
                </option>
              </select>
            </div>

            <!-- High Priority Reason -->
            <Transition name="slide">
              <div v-if="isHighPriority" class="mb-5">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Reason High Priority <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="form.highPriorityReason"
                  type="text"
                  placeholder="Alasan kenapa ticket ini high priority"
                  class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#E8B86D] transition-colors"
                />
                <p v-if="form.highPriorityReason && form.highPriorityReason.trim().length === 0" class="mt-1 text-xs text-red-500">
                  Wajib diisi untuk high priority
                </p>
              </div>
            </Transition>

            <!-- Title -->
            <div class="mb-5">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Title <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.title"
                type="text"
                placeholder="Masukkan judul ticket"
                class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#E8B86D] transition-colors"
              />
              <p v-if="form.title && form.title.length < 5" class="mt-1 text-xs text-red-500">
                Minimal 5 karakter
              </p>
            </div>

            <!-- Description -->
            <div class="mb-5">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Description <span class="text-red-500">*</span>
              </label>
              <textarea
                v-model="form.description"
                rows="4"
                placeholder="Deskripsikan masalah Anda..."
                class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#E8B86D] transition-colors resize-none bg-white"
              />
              <p v-if="form.description && form.description.length < 10" class="mt-1 text-xs text-red-500">
                Minimal 10 karakter
              </p>
            </div>

            <!-- Attachments -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Attachments
              </label>

              <!-- Drop Zone -->
              <div
                @dragover="handleDragOver"
                @dragleave="handleDragLeave"
                @drop="handleDrop"
                @click="triggerFileInput"
                class="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors"
                :class="[
                  isDragging
                    ? 'border-[#E8B86D] bg-amber-50'
                    : 'border-gray-200 hover:border-gray-300'
                ]"
              >
                <svg class="w-8 h-8 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p class="text-sm text-gray-600 mb-1">
                  <span class="text-[#E8B86D] font-medium">Click to upload</span> or drag and drop
                </p>
                <p class="text-xs text-gray-400">Image atau PDF (maks. 5MB, maks. 5 file)</p>
              </div>

              <input
                ref="fileInputRef"
                type="file"
                multiple
                accept="image/*,.pdf"
                class="hidden"
                @change="handleFileSelect"
              />

              <!-- File List -->
              <div v-if="attachments.length > 0" class="mt-3 space-y-2">
                <div
                  v-for="(file, index) in attachments"
                  :key="index"
                  class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <span class="text-lg">{{ getFileIcon(file.type) }}</span>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-700 truncate">{{ file.name }}</p>
                    <p class="text-xs text-gray-400">{{ formatFileSize(file.size) }}</p>
                  </div>
                  <button
                    @click="removeAttachment(index)"
                    class="p-1 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
            <button
              @click="handleClose"
              class="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="handleSubmit"
              :disabled="!isFormValid || isSubmitting"
              class="px-5 py-2.5 text-sm font-medium text-white bg-[#E8B86D] rounded-xl hover:bg-[#d4a35a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <svg v-if="isSubmitting" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              {{ isSubmitting ? 'Mengirim...' : 'Submit' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>

  <BaseAppAlertModal
    :is-open="fileAlertState.isOpen"
    :icon="fileAlertState.icon"
    :title="fileAlertState.title"
    :text="fileAlertState.text"
    @close="fileAlertState.isOpen = false"
  />
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.2s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
