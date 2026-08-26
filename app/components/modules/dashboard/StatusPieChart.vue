<script setup lang="ts">
interface StatusCount {
  status: string;
  count: number;
}

interface Props {
  statusCounts: StatusCount[];
}

const props = defineProps<Props>();

const statusConfig: Record<string, { label: string; color: string }> = {
  waiting_approval: { label: "Waiting Approval", color: "#3b82f6" },
  open: { label: "Open", color: "#eab308" },
  closed: { label: "Closed", color: "#6b7280" },
  rejected: { label: "Rejected", color: "#ef4444" },
};

const stats = computed(() => {
  return props.statusCounts.map((s) => ({
    label: statusConfig[s.status]?.label || s.status,
    count: s.count,
    color: statusConfig[s.status]?.color || "#9ca3af",
  }));
});

const total = computed(() => stats.value.reduce((sum, s) => sum + s.count, 0));
const hoveredIndex = ref<number | null>(null);

function getSegmentPath(index: number): string {
  let startAngle = 0;
  for (let i = 0; i < index; i++) {
    startAngle += (stats.value[i].count / total.value) * 360;
  }
  const endAngle = startAngle + (stats.value[index].count / total.value) * 360;

  const startRad = (startAngle - 90) * (Math.PI / 180);
  const endRad = (endAngle - 90) * (Math.PI / 180);

  const outerRadius = 45;
  const innerRadius = 28;

  const x1Outer = 50 + outerRadius * Math.cos(startRad);
  const y1Outer = 50 + outerRadius * Math.sin(startRad);
  const x2Outer = 50 + outerRadius * Math.cos(endRad);
  const y2Outer = 50 + outerRadius * Math.sin(endRad);

  const x1Inner = 50 + innerRadius * Math.cos(endRad);
  const y1Inner = 50 + innerRadius * Math.sin(endRad);
  const x2Inner = 50 + innerRadius * Math.cos(startRad);
  const y2Inner = 50 + innerRadius * Math.sin(startRad);

  const largeArc = endAngle - startAngle > 180 ? 1 : 0;

  return `M${x1Outer},${y1Outer} A${outerRadius},${outerRadius} 0 ${largeArc},1 ${x2Outer},${y2Outer} L${x1Inner},${y1Inner} A${innerRadius},${innerRadius} 0 ${largeArc},0 ${x2Inner},${y2Inner} Z`;
}

function getPercentage(count: number): string {
  return total.value > 0 ? ((count / total.value) * 100).toFixed(0) : "0";
}
</script>

<template>
  <div class="bg-white rounded-2xl p-5 shadow-sm">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-lg font-bold text-gray-900">Total Tickets by Status</h3>
    </div>

    <div
      v-if="total === 0"
      class="flex items-center justify-center py-10 text-gray-400 text-sm"
    >
      Belum ada data
    </div>

    <div
      v-else
      class="flex flex-col gap-6 md:flex-row md:items-center md:gap-8"
    >
      <!-- Legend -->
      <div class="flex-1 space-y-4">
        <div
          v-for="(stat, index) in stats"
          :key="stat.label"
          class="flex items-center justify-between p-2 rounded-lg transition-colors"
          :class="hoveredIndex === index ? 'bg-gray-50' : ''"
          @mouseenter="hoveredIndex = index"
          @mouseleave="hoveredIndex = null"
        >
          <div class="flex items-center gap-3">
            <span
              class="w-3 h-3 rounded-full"
              :style="{ backgroundColor: stat.color }"
            />
            <span class="text-sm text-gray-700">{{ stat.label }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-sm font-semibold" :style="{ color: stat.color }">
              {{ getPercentage(stat.count) }}%
            </span>
          </div>
        </div>

        <!-- Total -->
        <div class="pt-3 border-t border-gray-100">
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium text-gray-500">Total Tickets</span>
            <span class="text-lg font-bold text-gray-900">{{ total }}</span>
          </div>
        </div>
      </div>

      <!-- Donut Chart -->
      <div class="w-72 h-72 md:w-80 md:h-80 flex-shrink-0 relative">
        <svg viewBox="0 0 100 100" class="w-full h-full">
          <!-- Background circle -->
          <circle cx="50" cy="50" r="45" fill="#f3f4f6" />

          <!-- Segments -->
          <path
            v-for="(stat, index) in stats"
            :key="stat.label"
            :d="getSegmentPath(index)"
            :fill="stat.color"
            class="transition-all duration-200 cursor-pointer"
            :class="hoveredIndex === index ? 'opacity-80 scale-[1.02]' : ''"
            :style="{ transformOrigin: '50% 50%' }"
            @mouseenter="hoveredIndex = index"
            @mouseleave="hoveredIndex = null"
          />

          <!-- Inner circle for donut hole -->
          <circle cx="50" cy="50" r="28" fill="white" />
        </svg>

        <!-- Center text -->
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="text-center">
            <p class="text-2xl font-bold text-gray-900">{{ total }}</p>
            <p class="text-xs text-gray-500">Total</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
