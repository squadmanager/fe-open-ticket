<script setup lang="ts">
interface Props {
  variant: 'status' | 'priority' | 'department'
  value: string
}

const props = defineProps<Props>()

const badgeConfig = computed(() => {
  const configs: Record<string, Record<string, { bg: string; text: string; dot?: string }>> = {
    status: {
      waiting_approval: { bg: 'bg-blue-100', text: 'text-blue-700' },
      open: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
      closed: { bg: 'bg-gray-100', text: 'text-gray-600' },
      rejected: { bg: 'bg-red-100', text: 'text-red-700' },
    },
    priority: {
      low: { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' },
      medium: { bg: 'bg-yellow-100', text: 'text-yellow-700', dot: 'bg-yellow-500' },
      high: { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' },
    },
    department: {
      hr: { bg: 'bg-purple-100', text: 'text-purple-700' },
      crm: { bg: 'bg-blue-100', text: 'text-blue-700' },
      urbana: { bg: 'bg-green-100', text: 'text-green-700' },
      serva: { bg: 'bg-orange-100', text: 'text-orange-700' },
      support: { bg: 'bg-teal-100', text: 'text-teal-700' },
    },
  }

  return configs[props.variant]?.[props.value] || { bg: 'bg-gray-100', text: 'text-gray-600' }
})

const label = computed(() => {
  const labels: Record<string, Record<string, string>> = {
    status: {
      waiting_approval: 'Waiting Approval',
      open: 'Open',
      closed: 'Closed',
      rejected: 'Rejected',
    },
    priority: {
      low: 'Low',
      medium: 'Medium',
      high: 'High',
    },
    department: {
      hr: 'HR',
      crm: 'CRM',
      urbana: 'Urbana',
      serva: 'Serva',
      support: 'Support',
    },
  }

  return labels[props.variant]?.[props.value] || props.value
})
</script>

<template>
  <span
    class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
    :class="[badgeConfig.bg, badgeConfig.text]"
  >
    <span
      v-if="badgeConfig.dot"
      class="w-1.5 h-1.5 rounded-full"
      :class="badgeConfig.dot"
    />
    {{ label }}
  </span>
</template>
