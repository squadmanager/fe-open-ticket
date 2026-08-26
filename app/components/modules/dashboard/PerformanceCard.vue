<script setup lang="ts">
interface Props {
  title: string
  gradient?: 'green' | 'blue'
}

withDefaults(defineProps<Props>(), {
  gradient: 'green',
})

const period = ref('This Week')
</script>

<template>
  <div
    class="rounded-2xl p-5 text-white relative overflow-hidden"
    :class="[
      gradient === 'green'
        ? 'bg-gradient-to-br from-[#48BB78] to-[#38A169]'
        : 'bg-gradient-to-br from-[#4A7BF7] to-[#3B6CE7]'
    ]"
  >
    <!-- Background decoration -->
    <div class="absolute top-0 right-0 w-24 h-24 opacity-20">
      <svg viewBox="0 0 100 100" fill="white">
        <circle cx="50" cy="50" r="45" />
      </svg>
    </div>

    <!-- Content -->
    <div class="relative z-10">
      <h3 class="text-lg font-bold mb-3">{{ title }}</h3>
      <button class="flex items-center gap-1 text-sm text-white/80 hover:text-white">
        {{ period }}
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </div>
  </div>
</template>
