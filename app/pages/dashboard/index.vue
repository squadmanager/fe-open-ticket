<script setup lang="ts">
import type { DashboardData } from '~/composables/useDashboardApi'

definePageMeta({
  layout: "dashboard",
});

const api = useDashboardApi()
const data = ref<DashboardData | null>(null)
const isLoading = ref(true)

async function loadDashboard() {
  isLoading.value = true
  try {
    data.value = await api.fetchDashboard()
  } catch (error) {
    console.error('Failed to load dashboard:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => loadDashboard())
</script>

<template>
  <div class="space-y-6">
    <!-- Loading State - Skeleton -->
    <template v-if="isLoading">
      <!-- Top Row -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- StatCard Skeleton -->
        <div class="bg-white rounded-2xl p-5 shadow-sm space-y-4">
          <div class="flex items-center justify-between">
            <BaseSkeleton width="w-16" height="h-4" />
            <BaseSkeleton width="w-20" height="h-3" />
          </div>
          <div class="flex items-end justify-between">
            <div class="space-y-2">
              <BaseSkeleton width="w-24" height="h-8" />
              <BaseSkeleton width="w-20" height="h-3" />
            </div>
            <BaseSkeleton width="w-24" height="h-12" rounded="rounded-lg" />
          </div>
        </div>
        <!-- StatCard Skeleton -->
        <div class="bg-white rounded-2xl p-5 shadow-sm space-y-4">
          <div class="flex items-center justify-between">
            <BaseSkeleton width="w-16" height="h-4" />
            <BaseSkeleton width="w-20" height="h-3" />
          </div>
          <div class="flex items-end justify-between">
            <div class="space-y-2">
              <BaseSkeleton width="w-24" height="h-8" />
              <BaseSkeleton width="w-20" height="h-3" />
            </div>
            <BaseSkeleton width="w-24" height="h-12" rounded="rounded-lg" />
          </div>
        </div>
        <!-- BestAgent Skeleton -->
        <div class="bg-gradient-to-br from-[#1E293B] to-[#334155] rounded-2xl p-6 space-y-4">
          <div class="space-y-2">
            <BaseSkeleton width="w-24" height="h-3" rounded="rounded" />
            <BaseSkeleton width="w-36" height="h-5" rounded="rounded" />
            <BaseSkeleton width="w-32" height="h-3" rounded="rounded" />
          </div>
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 rounded-full bg-white/20 animate-shimmer" />
            <div class="space-y-2">
              <BaseSkeleton width="w-16" height="h-6" rounded="rounded" />
              <BaseSkeleton width="w-28" height="h-3" rounded="rounded" />
            </div>
          </div>
        </div>
      </div>

      <!-- Middle Row -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- ActiveTickets Skeleton -->
        <div class="bg-white rounded-2xl shadow-sm p-5 space-y-4">
          <div class="flex items-center justify-between">
            <BaseSkeleton width="w-36" height="h-5" />
            <div class="flex gap-3">
              <BaseSkeleton width="w-8" height="h-3" />
              <BaseSkeleton width="w-8" height="h-3" />
              <BaseSkeleton width="w-8" height="h-3" />
            </div>
          </div>
          <div v-for="i in 4" :key="i" class="p-4 border border-gray-100 rounded-xl space-y-3">
            <div class="flex items-center justify-between">
              <BaseSkeleton width="w-3/4" height="h-3" />
              <div class="flex items-center gap-2">
                <BaseSkeleton width="w-12" height="h-3" />
                <BaseSkeleton width="w-16" height="h-5" rounded="rounded-full" />
              </div>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <BaseSkeleton width="w-6" height="h-6" rounded="rounded-full" />
                <BaseSkeleton width="w-20" height="h-3" />
                <BaseSkeleton width="w-12" height="h-5" rounded="rounded-lg" />
                <BaseSkeleton width="w-12" height="h-3" />
              </div>
            </div>
          </div>
        </div>
        <!-- PieChart Skeleton -->
        <div class="bg-white rounded-2xl p-5 shadow-sm space-y-6">
          <BaseSkeleton width="w-48" height="h-5" />
          <div class="flex items-center gap-8">
            <div class="flex-1 space-y-4">
              <div v-for="i in 4" :key="i" class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-3 h-3 rounded-full bg-gray-200 animate-shimmer" />
                  <BaseSkeleton width="w-24" height="h-3" />
                </div>
                <BaseSkeleton width="w-10" height="h-3" />
              </div>
              <div class="pt-3 border-t border-gray-100">
                <div class="flex items-center justify-between">
                  <BaseSkeleton width="w-24" height="h-3" />
                  <BaseSkeleton width="w-12" height="h-5" />
                </div>
              </div>
            </div>
            <div class="w-55 h-55 rounded-full bg-gray-200 animate-shimmer" />
          </div>
        </div>
      </div>
    </template>

    <template v-else-if="data">
      <!-- Top Row: Stat Cards + Best Agent -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ModulesDashboardStatCard
          title="Total Tickets"
          :value="data.total_tickets"
          :change="data.total_change_percent"
        />
        <ModulesDashboardStatCard
          title="Total Mine"
          :value="data.total_mine"
          :change="data.mine_change_percent"
        />
        <ModulesDashboardBestAgentCard :agent="data.best_agent" />
      </div>

      <!-- Middle Row: Active Tickets + Pie Chart -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ModulesDashboardActiveTicketsCard :tickets="data.recent_tickets" :status-counts="data.status_counts" />
        <ModulesDashboardStatusPieChart :status-counts="data.status_counts" />
      </div>
    </template>
  </div>
</template>
