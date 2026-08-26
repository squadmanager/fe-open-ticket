<script setup lang="ts">
const { user, logout } = useAuth();

const isDropdownOpen = ref(false);
const isEditProfileOpen = ref(false);

const userInitials = computed(() => {
  if (!user.value) return "??";
  return user.value.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
});

const roleLabel = computed(() => {
  if (!user.value) return "";
  switch (user.value.role_id) {
    case 1:
      return "Superadmin";
    case 2:
      return "Admin";
    case 3:
      return "User";
    default:
      return "Unknown";
  }
});

function toggleDropdown() {
  isDropdownOpen.value = !isDropdownOpen.value;
}

function closeDropdown() {
  isDropdownOpen.value = false;
}

function handleEditProfile() {
  closeDropdown();
  isEditProfileOpen.value = true;
}

function handleLogout() {
  closeDropdown();
  logout();
}
</script>

<template>
  <header
    class="flex items-center justify-between px-4 py-3 md:px-6 md:py-4 bg-white border-b border-gray-100 shadow-sm"
  >
    <!-- Left: Logo + App Name -->
    <div class="flex items-center gap-2 md:gap-3">
      <img
        src="/icons/ic-support-ticket.png"
        alt="Logo"
        class="w-8 h-8 md:w-10 md:h-10 object-contain"
      />
      <span class="text-base md:text-lg font-bold text-gray-900 hidden sm:block">Layanan Support</span>
    </div>

    <!-- Right: User Dropdown -->
    <div class="relative">
      <button
        @click="toggleDropdown"
        class="flex items-center gap-3 p-1 pr-3 rounded-xl hover:bg-gray-50 transition-colors"
      >
        <div class="text-right hidden sm:block">
          <p class="text-sm font-medium text-gray-900">
            {{ user?.name || "Guest" }}
          </p>
          <p class="text-xs text-gray-500">{{ roleLabel }}</p>
        </div>
        <img
          v-if="user?.avatar"
          :src="user.avatar"
          :alt="user.name"
          class="w-10 h-10 rounded-full object-cover"
        />
        <div
          v-else
          class="w-10 h-10 rounded-full bg-[#E8B86D] flex items-center justify-center text-sm font-semibold text-white"
        >
          {{ userInitials }}
        </div>
        <!-- Chevron -->
        <svg
          class="w-4 h-4 text-gray-400 transition-transform"
          :class="{ 'rotate-180': isDropdownOpen }"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      <!-- Dropdown Menu -->
      <Transition
        enter-active-class="transition ease-out duration-100"
        enter-from-class="transform opacity-0 scale-95"
        enter-to-class="transform opacity-100 scale-100"
        leave-active-class="transition ease-in duration-75"
        leave-from-class="transform opacity-100 scale-100"
        leave-to-class="transform opacity-0 scale-95"
      >
        <div
          v-if="isDropdownOpen"
          class="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50"
        >
          <!-- User Info -->
          <div class="px-4 py-3 border-b border-gray-100">
            <p class="font-medium text-gray-900">{{ user?.name }}</p>
            <p class="text-xs text-gray-500 mt-0.5">{{ roleLabel }}</p>
          </div>

          <!-- Edit Profile Button -->
          <button
            @click="handleEditProfile"
            class="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Edit Profile
          </button>

          <!-- Logout Button -->
          <button
            @click="handleLogout"
            class="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Logout
          </button>
        </div>
      </Transition>
    </div>
  </header>

  <!-- Overlay to close dropdown -->
  <div
    v-if="isDropdownOpen"
    class="fixed inset-0 z-40"
    @click="closeDropdown"
  />

  <!-- Edit Profile Modal -->
  <ModulesProfileEditProfileModal
    :is-open="isEditProfileOpen"
    @close="isEditProfileOpen = false"
  />
</template>
