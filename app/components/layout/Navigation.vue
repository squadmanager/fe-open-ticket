<script setup lang="ts">
const route = useRoute();
const { isSuperadmin } = useAuth();

const menus = computed(() => {
  if (isSuperadmin.value) {
    return [
      { name: "Dashboard", path: "/dashboard", icon: "home" },
      { name: "Open Ticket", path: "/dashboard/open-ticket", icon: "ticket" },
    ];
  }
  return [{ name: "Open Ticket", path: "/user/open-ticket", icon: "ticket" }];
});

function isActive(path: string): boolean {
  if (path === "/dashboard") {
    return route.path === "/dashboard";
  }
  return route.path.startsWith(path);
}
</script>

<template>
  <!-- Desktop: Tab bar horizontal -->
  <nav
    class="hidden md:flex items-center gap-1 px-6 bg-white border-b border-gray-100 shadow-sm"
  >
    <NuxtLink
      v-for="menu in menus"
      :key="menu.path"
      :to="menu.path"
      class="relative px-4 py-3 text-sm font-medium transition-colors"
      :class="[
        isActive(menu.path)
          ? 'text-[#E8B86D]'
          : 'text-gray-500 hover:text-gray-700',
      ]"
    >
      {{ menu.name }}
      <span
        v-if="isActive(menu.path)"
        class="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E8B86D] rounded-full"
      />
    </NuxtLink>
  </nav>

  <!-- Mobile: Bottom nav bar -->
  <nav
    class="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]"
  >
    <div class="flex items-center justify-around px-2 py-2">
      <NuxtLink
        v-for="menu in menus"
        :key="menu.path"
        :to="menu.path"
        class="flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-colors min-w-[64px]"
        :class="[
          isActive(menu.path)
            ? 'text-[#E8B86D]'
            : 'text-gray-400',
        ]"
      >
        <!-- Home icon -->
        <svg
          v-if="menu.icon === 'home'"
          class="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
        <!-- Ticket icon -->
        <svg
          v-else
          class="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
          />
        </svg>
        <span class="text-xs font-medium">{{ menu.name }}</span>
      </NuxtLink>
    </div>
  </nav>
</template>
