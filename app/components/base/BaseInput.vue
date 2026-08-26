<script setup lang="ts">
interface Props {
  modelValue: string
  label?: string
  placeholder?: string
  type?: string
  icon?: string
  error?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  placeholder: '',
  error: ''
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const showPassword = ref(false)
const inputType = computed(() => {
  if (props.type === 'password') {
    return showPassword.value ? 'text' : 'password'
  }
  return props.type
})
</script>

<template>
  <div class="mb-4">
    <div
      class="flex items-center border rounded-xl px-4 py-3 transition-colors"
      :class="[error ? 'border-red-400' : 'border-gray-300 hover:border-gray-400 focus-within:border-gray-500']"
    >
      <input
        :type="inputType"
        :value="modelValue"
        :placeholder="placeholder"
        class="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />
      <button
        v-if="type === 'password'"
        type="button"
        class="text-sm text-gray-500 hover:text-gray-700 ml-2 cursor-pointer select-none"
        @click="showPassword = !showPassword"
      >
        {{ showPassword ? 'Hide' : 'Show' }}
      </button>
      <span v-if="icon" class="ml-2 text-gray-400">
        {{ icon }}
      </span>
    </div>
    <p v-if="error" class="mt-1 text-xs text-red-500">{{ error }}</p>
  </div>
</template>
