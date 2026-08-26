<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'outline'
  disabled?: boolean
  loading?: boolean
  block?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  disabled: false,
  loading: false,
  block: false
})

const variantClasses = computed(() => {
  const base = 'rounded-full py-3 px-6 font-medium text-sm transition-all duration-200 cursor-pointer select-none'
  const variants: Record<string, string> = {
    primary: 'bg-[#E8B86D] hover:bg-[#d4a35a] text-gray-800 active:scale-[0.98]',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-700 active:scale-[0.98]',
    outline: 'border border-gray-300 hover:border-gray-400 text-gray-700 bg-white active:scale-[0.98]'
  }
  return `${base} ${variants[props.variant]}`
})
</script>

<template>
  <button
    :class="[
      variantClasses,
      block ? 'w-full' : '',
      disabled ? 'opacity-50 cursor-not-allowed' : ''
    ]"
    :disabled="disabled || loading"
  >
    <span v-if="loading" class="inline-flex items-center gap-2">
      <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
      Loading...
    </span>
    <slot v-else />
  </button>
</template>
