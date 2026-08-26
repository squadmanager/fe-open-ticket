<script setup lang="ts">
interface Props {
  width?: string
  height?: string
  rounded?: string
}

const props = withDefaults(defineProps<Props>(), {
  width: 'w-full',
  height: 'h-4',
  rounded: 'rounded-xl',
})
</script>

<template>
  <div class="animate-shimmer bg-gray-200" :class="[width, height, rounded]" />
</template>
