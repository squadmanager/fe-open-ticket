<script setup lang="ts">
import { useTicketApi } from "~/composables/useTicketApi";
import { useAuthStore } from "~/stores/auth";
import type { AppItem, PriorityItem } from "~/composables/useTicketApi";
import type { Ticket } from "~/types/ticket";

interface Props {
  isOpen: boolean;
  ticket: Ticket | null;
  isSubmitting?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isSubmitting: false,
});

const emit = defineEmits<{
  close: [];
  submit: [
    data: {
      title: string;
      description: string;
      priorityId: number;
      highPriorityReason: string;
      attachments: File[];
      existingAttachments: string[];
    },
  ];
  "status-changed": [];
}>();

const api = useTicketApi();
const authStore = useAuthStore();
const { reopenTicket } = useTickets();

const isSuperadmin = computed(() => authStore.user?.role_id === 1);
const showChangeToOpen = computed(() => {
  if (!isSuperadmin.value || !props.ticket) return false;
  return props.ticket.status === "rejected" || props.ticket.status === "closed";
});

const isChangeToOpenModalOpen = ref(false);
const isChangingStatus = ref(false);
const isReopenSuccess = ref(false);

const form = reactive({
  title: "",
  description: "",
  priorityId: 0,
  highPriorityReason: "",
});

const attachments = ref<File[]>([]);
const fileInputRef = ref<HTMLInputElement | null>(null);
const isDragging = ref(false);
const removedAttachmentIds = ref<string[]>([]);

const priorities = ref<PriorityItem[]>([]);

const existingAttachments = computed(() => props.ticket?.attachments || []);

const isHighPriority = computed(() => {
  const highPriority = priorities.value.find(
    (p) => p.name.toLowerCase() === "high",
  );
  return highPriority && form.priorityId === highPriority.id;
});

const isFormValid = computed(() => {
  const titleValid = form.title.trim().length >= 5;
  const descValid = form.description.trim().length >= 10;
  const priorityValid = form.priorityId > 0;

  if (isHighPriority.value) {
    return (
      titleValid &&
      descValid &&
      priorityValid &&
      form.highPriorityReason.trim().length > 0
    );
  }

  return titleValid && descValid && priorityValid;
});

async function loadData() {
  try {
    const prioritiesRes = await api.fetchPriorities();
    priorities.value = prioritiesRes.data;
  } catch (error) {
    console.error("Failed to load priorities:", error);
  }
}

function fillForm() {
  if (props.ticket) {
    form.title = props.ticket.subject;
    form.description = props.ticket.description || "";
    form.highPriorityReason = props.ticket.reasonHighPriority || "";

    const matchedPriority = priorities.value.find(
      (p) => p.name.toLowerCase() === props.ticket!.priority,
    );
    if (matchedPriority) {
      form.priorityId = matchedPriority.id;
    }
  }
}

function handleSubmit() {
  if (!isFormValid.value || !props.ticket) return;
  emit("submit", {
    title: form.title,
    description: form.description,
    priorityId: form.priorityId,
    highPriorityReason: form.highPriorityReason,
    attachments: attachments.value,
    existingAttachments: existingAttachments.value
      .filter((a) => !removedAttachmentIds.value.includes(a.id))
      .map((a) => a.id),
  });
  resetForm();
}

function removeExistingAttachment(id: string) {
  removedAttachmentIds.value.push(id);
}

function undoRemoveExistingAttachment(id: string) {
  removedAttachmentIds.value = removedAttachmentIds.value.filter(
    (i) => i !== id,
  );
}

function resetForm() {
  form.title = "";
  form.description = "";
  form.priorityId = 0;
  form.highPriorityReason = "";
  attachments.value = [];
  removedAttachmentIds.value = [];
}

function handleClose() {
  resetForm();
  emit("close");
}

function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    addFiles(Array.from(target.files));
  }
}

function addFiles(newFiles: File[]) {
  const validTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "application/pdf",
  ];
  const maxSize = 5 * 1024 * 1024;

  for (const file of newFiles) {
    if (!validTypes.includes(file.type)) {
      fileAlertState.icon = "warning";
      fileAlertState.title = "File tidak valid";
      fileAlertState.text = "Hanya file Image dan PDF yang diperbolehkan";
      fileAlertState.isOpen = true;
      continue;
    }
    if (file.size > maxSize) {
      fileAlertState.icon = "warning";
      fileAlertState.title = "File terlalu besar";
      fileAlertState.text = "Ukuran file maksimal 5MB";
      fileAlertState.isOpen = true;
      continue;
    }
    if (attachments.value.length >= 5) {
      fileAlertState.icon = "warning";
      fileAlertState.title = "Batas file";
      fileAlertState.text = "Maksimal 5 file";
      fileAlertState.isOpen = true;
      break;
    }
    attachments.value.push(file);
  }
}

const fileAlertState = reactive({
  isOpen: false,
  icon: "warning" as "success" | "error" | "warning",
  title: "",
  text: "",
});

function removeAttachment(index: number) {
  attachments.value.splice(index, 1);
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileIcon(type: string) {
  if (type.startsWith("image/")) return "🖼️";
  if (type === "application/pdf") return "📄";
  return "📎";
}

function handleDragOver(event: DragEvent) {
  event.preventDefault();
  isDragging.value = true;
}

function handleDragLeave() {
  isDragging.value = false;
}

function handleDrop(event: DragEvent) {
  event.preventDefault();
  isDragging.value = false;
  if (event.dataTransfer?.files) {
    addFiles(Array.from(event.dataTransfer.files));
  }
}

function triggerFileInput() {
  fileInputRef.value?.click();
}

async function handleChangeToOpen() {
  if (!props.ticket) return;
  isChangingStatus.value = true;
  try {
    await reopenTicket(props.ticket.id);
    emit("status-changed");
    isChangeToOpenModalOpen.value = false;
    isReopenSuccess.value = true;
    fileAlertState.icon = "success";
    fileAlertState.title = "Berhasil";
    fileAlertState.text = "Status ticket berhasil diubah ke Open";
    fileAlertState.isOpen = true;
  } catch (error) {
    console.error("Failed to change status:", error);
    isChangeToOpenModalOpen.value = false;
    fileAlertState.icon = "error";
    fileAlertState.title = "Gagal";
    fileAlertState.text = "Gagal mengubah status ticket";
    fileAlertState.isOpen = true;
  } finally {
    isChangingStatus.value = false;
  }
}

function handleAlertClose() {
  fileAlertState.isOpen = false;
  if (isReopenSuccess.value) {
    isReopenSuccess.value = false;
    emit("close");
  }
}

watch(
  () => props.isOpen,
  async (val) => {
    if (val) {
      await loadData();
      fillForm();
    }
  },
);
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen && ticket"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4"
      >
        <!-- Overlay -->
        <div
          class="absolute inset-0 bg-black/50 transition-opacity"
          @click="!isSubmitting && handleClose()"
        />

        <!-- Modal -->
        <div
          class="relative bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden z-10"
        >
          <!-- Header -->
          <div
            class="flex items-center justify-between px-6 py-4 border-b border-gray-100"
          >
            <div>
              <h2 class="text-lg font-bold text-gray-900">Edit Ticket</h2>
              <p class="text-xs text-gray-400 font-mono mt-0.5">
                {{ ticket.code }}
              </p>
            </div>
            <button
              @click="handleClose"
              :disabled="isSubmitting"
              class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <!-- Body -->
          <div class="px-6 py-5 overflow-y-auto max-h-[calc(90vh-140px)]">
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
                <option v-for="p in priorities" :key="p.id" :value="p.id">
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
                <p
                  v-if="
                    form.highPriorityReason &&
                    form.highPriorityReason.trim().length === 0
                  "
                  class="mt-1 text-xs text-red-500"
                >
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
              <p
                v-if="form.title && form.title.length < 5"
                class="mt-1 text-xs text-red-500"
              >
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
              <p
                v-if="form.description && form.description.length < 10"
                class="mt-1 text-xs text-red-500"
              >
                Minimal 10 karakter
              </p>
            </div>

            <!-- Attachments -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Attachments
                <span class="text-gray-400 text-xs"
                  >(kosongkan jika tidak ingin mengubah)</span
                >
              </label>

              <!-- Existing Attachments (read-only) -->
              <div v-if="existingAttachments.length > 0" class="mb-3 space-y-2">
                <div
                  v-for="file in existingAttachments"
                  :key="file.id"
                  :class="[
                    removedAttachmentIds.includes(file.id)
                      ? 'opacity-40 line-through bg-red-50 border-red-100'
                      : 'bg-blue-50 border-blue-100',
                  ]"
                  class="flex items-center gap-3 p-3 rounded-lg"
                >
                  <span v-if="file.type === 'image'" class="text-lg">🖼️</span>
                  <span v-else-if="file.type === 'pdf'" class="text-lg"
                    >📄</span
                  >
                  <span v-else class="text-lg">📎</span>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-700 truncate">
                      {{ file.name }}
                    </p>
                    <p class="text-xs text-gray-400">
                      {{ formatFileSize(file.size) }}
                    </p>
                  </div>
                  <button
                    v-if="!removedAttachmentIds.includes(file.id)"
                    @click.stop="removeExistingAttachment(file.id)"
                    class="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    title="Hapus file"
                  >
                    <svg
                      class="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                  <button
                    v-else
                    @click.stop="undoRemoveExistingAttachment(file.id)"
                    class="p-1 text-green-500 hover:text-green-600 transition-colors"
                    title="Batalkan hapus"
                  >
                    <svg
                      class="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                      />
                    </svg>
                  </button>
                </div>
              </div>

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
                    : 'border-gray-200 hover:border-gray-300',
                ]"
              >
                <svg
                  class="w-8 h-8 mx-auto text-gray-400 mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <p class="text-sm text-gray-600 mb-1">
                  <span class="text-[#E8B86D] font-medium"
                    >Click to upload</span
                  >
                  or drag and drop
                </p>
                <p class="text-xs text-gray-400">
                  Image atau PDF (maks. 5MB, maks. 5 file)
                </p>
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
                    <p class="text-sm font-medium text-gray-700 truncate">
                      {{ file.name }}
                    </p>
                    <p class="text-xs text-gray-400">
                      {{ formatFileSize(file.size) }}
                    </p>
                  </div>
                  <button
                    @click="removeAttachment(index)"
                    class="p-1 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <svg
                      class="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div
            class="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50"
          >
            <button
              v-if="showChangeToOpen"
              @click="isChangeToOpenModalOpen = true"
              class="px-5 py-2.5 text-sm font-medium text-white bg-green-500 rounded-xl hover:bg-green-600 transition-colors"
            >
              Ubah Status ke Open
            </button>
            <div v-else></div>
            <div class="flex items-center gap-3">
              <button
                @click="handleClose"
                :disabled="isSubmitting"
                class="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                @click="handleSubmit"
                :disabled="!isFormValid || isSubmitting"
                class="px-5 py-2.5 text-sm font-medium text-white bg-[#E8B86D] rounded-xl hover:bg-[#d4a35a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <svg
                  v-if="isSubmitting"
                  class="animate-spin h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  />
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                {{ isSubmitting ? "Menyimpan..." : "Simpan" }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>

  <BaseAppConfirmModal
    :is-open="isChangeToOpenModalOpen"
    title="Ubah Status ke Open"
    text="Apakah Anda yakin ingin mengubah status ticket ini ke Open?"
    confirm-text="Ya, Ubah"
    cancel-text="Batal"
    variant="warning"
    @confirm="handleChangeToOpen"
    @cancel="isChangeToOpenModalOpen = false"
  />

  <BaseAppAlertModal
    :is-open="fileAlertState.isOpen"
    :icon="fileAlertState.icon"
    :title="fileAlertState.title"
    :text="fileAlertState.text"
    :auto-close="2000"
    @close="handleAlertClose"
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
