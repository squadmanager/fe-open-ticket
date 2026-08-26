<script setup lang="ts">
interface Agent {
  id: string
  name: string
  avatar: string | null
  tickets_created: number
}

interface Props {
  agent: Agent | null
}

const props = defineProps<Props>()
</script>

<template>
  <div class="bg-gradient-to-br from-[#1E293B] to-[#334155] rounded-2xl p-6 text-white relative overflow-hidden">
    <!-- Background decoration -->
    <div class="absolute top-0 right-0 w-32 h-32 opacity-10">
      <svg viewBox="0 0 120 120" fill="white">
        <circle cx="60" cy="60" r="50" />
        <circle cx="60" cy="60" r="30" fill="#1E293B" />
      </svg>
    </div>

    <!-- No Agent State -->
    <div v-if="!agent" class="relative z-10 flex items-center justify-center h-full">
      <p class="text-gray-400 text-sm">Belum ada data</p>
    </div>

    <template v-else>
      <!-- Header -->
      <div class="mb-4 relative z-10">
        <p class="text-sm text-gray-300">Congratulations</p>
        <h3 class="text-xl font-bold">{{ agent.name }}!</h3>
        <p class="text-sm text-gray-400">Best Agent of the Week</p>
      </div>

      <!-- Content -->
      <div class="flex items-center gap-4 relative z-10">
        <!-- Avatar -->
        <img
          v-if="agent.avatar"
          :src="agent.avatar"
          :alt="agent.name"
          class="w-16 h-16 rounded-full object-cover border-2 border-white/20"
        />
        <div
          v-else
          class="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-xl font-bold border-2 border-white/20"
        >
          {{ agent.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) }}
        </div>

        <!-- Stats -->
        <div>
          <div class="flex items-baseline gap-2">
            <span class="text-2xl font-bold">{{ agent.tickets_created }}</span>
            <span class="text-sm text-gray-300">Pengajuan Ticket</span>
          </div>
        </div>
      </div>
    </template>

    <!-- Trophy decoration -->
    <div class="absolute -bottom-2 -right-2 w-24 h-24 opacity-80">
      <svg viewBox="0 0 100 100" fill="none">
        <path d="M50 10 L60 35 L85 35 L65 50 L75 75 L50 60 L25 75 L35 50 L15 35 L40 35 Z" fill="#E8B86D" />
        <rect x="40" y="70" width="20" height="15" fill="#E8B86D" />
        <rect x="35" y="85" width="30" height="5" rx="2" fill="#E8B86D" />
      </svg>
    </div>
  </div>
</template>
