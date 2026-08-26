<script setup lang="ts">
interface Props {
  title: string
  value: number
  change: number
  changeLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  changeLabel: 'This Week',
})

const isPositive = computed(() => props.change >= 0)
</script>

<template>
  <div class="bg-white rounded-2xl p-5 shadow-sm">
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-2">
        <span
          class="text-sm font-medium"
          :class="isPositive ? 'text-green-500' : 'text-red-500'"
        >
          {{ isPositive ? '+' : '' }}{{ change }}%
        </span>
        <svg
          v-if="isPositive"
          class="w-4 h-4 text-green-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 17l9.2-9.2M17 17V7H7" />
        </svg>
        <svg
          v-else
          class="w-4 h-4 text-red-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 7l-9.2 9.2M7 7v10h10" />
        </svg>
      </div>
      <button class="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
        {{ changeLabel }}
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </div>

    <!-- Value + Chart -->
    <div class="flex items-end justify-between">
      <div>
        <p class="text-3xl font-bold text-gray-900">{{ value }}</p>
        <p class="text-sm text-gray-500 mt-1">{{ title }}</p>
      </div>
      <!-- Simple line chart placeholder -->
      <div class="w-24 h-12">
        <svg viewBox="0 0 100 40" class="w-full h-full" fill="none">
          <path
            d="M0 35 Q15 30, 25 25 T50 15 T75 20 T100 10"
            stroke="#4A7BF7"
            stroke-width="2"
            fill="none"
          />
        </svg>
      </div>
    </div>
  </div>
</template>
