<script setup lang="ts">
interface Props {
  isOpen: boolean
  title?: string
  text?: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning'
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Konfirmasi',
  text: '',
  confirmText: 'Ya, Hapus',
  cancelText: 'Batal',
  variant: 'danger',
})

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const iconColor = computed(() => props.variant === 'danger' ? 'text-red-500 bg-red-50' : 'text-amber-500 bg-amber-50')
const confirmBtnClass = computed(() =>
  props.variant === 'danger'
    ? 'bg-red-500 hover:bg-red-600 text-white'
    : 'bg-[#E8B86D] hover:bg-[#d4a35a] text-white'
)
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[200] flex items-center justify-center p-4"
      >
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" @click="emit('cancel')" />

        <div class="relative bg-white rounded-2xl shadow-xl w-full max-w-sm z-10 overflow-hidden">
          <div class="flex flex-col items-center px-6 pt-8 pb-6">
            <div
              class="w-14 h-14 rounded-full flex items-center justify-center mb-4"
              :class="iconColor"
            >
              <svg v-if="variant === 'danger'" class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <svg v-else class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>

            <h3 class="text-lg font-semibold text-gray-900 mb-1">{{ title }}</h3>
            <p v-if="text" class="text-sm text-gray-500 text-center">{{ text }}</p>
          </div>

          <div class="flex gap-3 px-6 pb-6">
            <button
              @click="emit('cancel')"
              class="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl border border-gray-200 transition-colors"
            >
              {{ cancelText }}
            </button>
            <button
              @click="emit('confirm')"
              class="flex-1 px-4 py-2.5 text-sm font-medium text-white rounded-xl transition-colors"
              :class="confirmBtnClass"
            >
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
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
