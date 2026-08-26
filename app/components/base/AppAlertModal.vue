<script setup lang="ts">
interface Props {
  isOpen: boolean
  title?: string
  text?: string
  icon?: 'success' | 'error' | 'warning'
  autoClose?: number
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  text: '',
  icon: 'success',
  autoClose: 0,
})

const emit = defineEmits<{
  close: []
}>()

const iconBg = computed(() => {
  switch (props.icon) {
    case 'success': return 'text-green-500 bg-green-50'
    case 'error': return 'text-red-500 bg-red-50'
    case 'warning': return 'text-amber-500 bg-amber-50'
  }
})

const closeBtnClass = computed(() => {
  switch (props.icon) {
    case 'success': return 'bg-green-500 hover:bg-green-600 text-white'
    case 'error': return 'bg-red-500 hover:bg-red-600 text-white'
    case 'warning': return 'bg-[#E8B86D] hover:bg-[#d4a35a] text-white'
  }
})

let timer: ReturnType<typeof setTimeout> | null = null

watch(() => props.isOpen, (val) => {
  if (val && props.autoClose > 0) {
    timer = setTimeout(() => {
      emit('close')
    }, props.autoClose)
  } else if (timer) {
    clearTimeout(timer)
    timer = null
  }
})

onUnmounted(() => {
  if (timer) clearTimeout(timer)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[200] flex items-center justify-center p-4"
      >
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" @click="emit('close')" />

        <div class="relative bg-white rounded-2xl shadow-xl w-full max-w-sm z-10 overflow-hidden">
          <div class="flex flex-col items-center px-6 pt-8 pb-6">
            <div
              class="w-14 h-14 rounded-full flex items-center justify-center mb-4"
              :class="iconBg"
            >
              <svg v-if="icon === 'success'" class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <svg v-else-if="icon === 'error'" class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <svg v-else class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>

            <h3 class="text-lg font-semibold text-gray-900 mb-1">{{ title }}</h3>
            <p v-if="text" class="text-sm text-gray-500 text-center">{{ text }}</p>
          </div>

          <div class="px-6 pb-6">
            <button
              @click="emit('close')"
              class="w-full px-4 py-2.5 text-sm font-medium text-white rounded-xl transition-colors"
              :class="closeBtnClass"
            >
              OK
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
