<script setup lang="ts">
import type { User } from '~/types/auth'

interface Props {
  isOpen: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
}>()

const { user, updateProfile } = useAuth()

const form = reactive({
  full_name: '',
  password: '',
  password_confirmation: '',
})

const avatarFile = ref<File | null>(null)
const avatarPreview = ref<string | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)
const isLoading = ref(false)
const isSuccess = ref(false)
const errorMessage = ref('')

const isFormValid = computed(() => {
  const nameValid = form.full_name.trim().length > 0
  const passwordValid = !form.password || form.password.length >= 6
  const confirmValid = form.password === form.password_confirmation
  return nameValid && passwordValid && confirmValid
})

const userInitials = computed(() => {
  if (!user.value) return '??'
  return user.value.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

function fillForm() {
  if (user.value) {
    form.full_name = user.value.name
    form.password = ''
    form.password_confirmation = ''
    avatarFile.value = null
    avatarPreview.value = user.value.avatar || null
    errorMessage.value = ''
    isSuccess.value = false
  }
}

function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    setAvatar(target.files[0])
  }
}

function setAvatar(file: File) {
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  if (!validTypes.includes(file.type)) {
    errorMessage.value = 'Hanya file Image yang diperbolehkan (PNG, JPG, GIF, WebP)'
    return
  }
  if (file.size > 2 * 1024 * 1024) {
    errorMessage.value = 'Ukuran file maksimal 2MB'
    return
  }
  errorMessage.value = ''
  avatarFile.value = file
  avatarPreview.value = URL.createObjectURL(file)
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
  if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
    setAvatar(event.dataTransfer.files[0])
  }
}

function triggerFileInput() {
  fileInputRef.value?.click()
}

function removeAvatar() {
  avatarFile.value = null
  avatarPreview.value = user.value?.avatar || null
}

async function handleSubmit() {
  if (!isFormValid.value || isLoading.value) return
  isLoading.value = true
  errorMessage.value = ''

  const result = await updateProfile({
    full_name: form.full_name,
    password: form.password || undefined,
    password_confirmation: form.password_confirmation || undefined,
    avatar: avatarFile.value,
  })

  isLoading.value = false

  if (result.success) {
    isSuccess.value = true
    form.password = ''
    form.password_confirmation = ''
    setTimeout(() => {
      emit('close')
    }, 1500)
  } else {
    errorMessage.value = result.error || 'Gagal update profile'
  }
}

function handleClose() {
  emit('close')
}

watch(() => props.isOpen, (val) => {
  if (val) {
    fillForm()
  }
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen && user"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4"
      >
        <!-- Overlay -->
        <div class="absolute inset-0 bg-black/50 transition-opacity" @click="handleClose" />

        <!-- Modal -->
        <div class="relative bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden z-10">
          <!-- Header -->
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 class="text-lg font-bold text-gray-900">Edit Profile</h2>
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
            <!-- Avatar -->
            <div class="mb-5">
              <label class="block text-sm font-medium text-gray-700 mb-2">Foto Profil</label>
              <div class="flex items-center gap-4">
                <!-- Avatar Preview -->
                <div
                  v-if="avatarPreview"
                  class="w-20 h-20 rounded-full overflow-hidden bg-gray-100 flex-shrink-0"
                >
                  <img :src="avatarPreview" alt="Avatar" class="w-full h-full object-cover" />
                </div>
                <div
                  v-else
                  class="w-20 h-20 rounded-full bg-[#E8B86D] flex items-center justify-center text-xl font-semibold text-white flex-shrink-0"
                >
                  {{ userInitials }}
                </div>

                <!-- Upload Button -->
                <div class="flex-1">
                  <div
                    @dragover="handleDragOver"
                    @dragleave="handleDragLeave"
                    @drop="handleDrop"
                    @click="triggerFileInput"
                    class="border-2 border-dashed rounded-xl p-3 text-center cursor-pointer transition-colors"
                    :class="[
                      isDragging
                        ? 'border-[#E8B86D] bg-amber-50'
                        : 'border-gray-200 hover:border-gray-300'
                    ]"
                  >
                    <p class="text-xs text-gray-600">
                      <span class="text-[#E8B86D] font-medium">Click</span> atau drag & drop
                    </p>
                    <p class="text-xs text-gray-400 mt-0.5">PNG, JPG, GIF, WebP (maks. 2MB)</p>
                  </div>
                  <button
                    v-if="avatarFile"
                    @click="removeAvatar"
                    class="mt-2 text-xs text-red-500 hover:text-red-600"
                  >
                    Hapus foto
                  </button>
                </div>

                <input
                  ref="fileInputRef"
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="handleFileSelect"
                />
              </div>
            </div>

            <!-- Full Name -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Full Name <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.full_name"
                type="text"
                placeholder="Masukkan nama lengkap"
                class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#E8B86D] transition-colors"
              />
            </div>

            <!-- Password -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Password <span class="text-gray-400 text-xs">(kosongkan jika tidak ingin mengubah)</span>
              </label>
              <input
                v-model="form.password"
                type="password"
                placeholder="Masukkan password baru"
                class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#E8B86D] transition-colors"
              />
              <p v-if="form.password && form.password.length < 6" class="mt-1 text-xs text-red-500">
                Minimal 6 karakter
              </p>
            </div>

            <!-- Confirm Password -->
            <div v-if="form.password" class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Konfirmasi Password <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.password_confirmation"
                type="password"
                placeholder="Ulangi password baru"
                class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#E8B86D] transition-colors"
              />
              <p v-if="form.password_confirmation && form.password !== form.password_confirmation" class="mt-1 text-xs text-red-500">
                Password tidak cocok
              </p>
            </div>

            <!-- Error Message -->
            <div
              v-if="errorMessage"
              class="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 text-center"
            >
              {{ errorMessage }}
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
              :disabled="!isFormValid || isLoading"
              class="px-5 py-2.5 text-sm font-medium text-white bg-[#E8B86D] rounded-xl hover:bg-[#d4a35a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isLoading ? 'Menyimpan...' : 'Simpan' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>

  <BaseAppAlertModal
    :is-open="isSuccess"
    icon="success"
    title="Berhasil"
    text="Profile berhasil diupdate"
    :auto-close="1500"
    @close="isSuccess = false"
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
</style>
