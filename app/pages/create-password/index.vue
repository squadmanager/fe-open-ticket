<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

definePageMeta({
  layout: "auth",
});

const store = useAuthStore();
const { createPassword } = useAuth();

const form = reactive({
  password: "",
  confirmPassword: "",
});

const loading = ref(false);
const error = ref("");

const pendingUsername = computed(() => store.pendingUsername);

// If no pending username, redirect to login
if (!pendingUsername.value) {
  navigateTo("/login");
}

async function handleCreatePassword() {
  loading.value = true;
  error.value = "";

  if (!pendingUsername.value) {
    error.value = "Username tidak ditemukan, silakan login ulang";
    loading.value = false;
    return;
  }

  if (form.password.length < 8) {
    error.value = "Password minimal 8 karakter";
    loading.value = false;
    return;
  }

  if (form.password !== form.confirmPassword) {
    error.value = "Konfirmasi password tidak cocok";
    loading.value = false;
    return;
  }

  const result = await createPassword(
    pendingUsername.value,
    form.password,
    form.confirmPassword
  );

  if (result.success) {
    navigateTo("/user/open-ticket");
  } else {
    error.value = result.error || "Gagal membuat password";
  }

  loading.value = false;
}
</script>

<template>
  <div
    class="w-full max-w-[420px] bg-white rounded-2xl shadow-lg p-8 relative z-10"
  >
    <!-- Header -->
    <div class="text-center mb-8">
      <h1 class="text-2xl font-bold text-gray-900 mb-2">
        Buat Password
      </h1>
      <p class="text-sm text-gray-500 leading-relaxed">
        Buat password baru untuk akun Anda
      </p>
    </div>

    <!-- Pending Username Info -->
    <div
      v-if="pendingUsername"
      class="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-600 text-center"
    >
      <span class="font-medium">Username:</span> {{ pendingUsername }}
    </div>

    <!-- Error Message -->
    <div
      v-if="error"
      class="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 text-center"
    >
      {{ error }}
    </div>

    <!-- Form -->
    <form @submit.prevent="handleCreatePassword">
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1.5">
          Password
        </label>
        <input
          v-model="form.password"
          type="password"
          placeholder="Masukkan password baru"
          class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E8B86D] focus:border-transparent"
        />
      </div>

      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-1.5">
          Konfirmasi Password
        </label>
        <input
          v-model="form.confirmPassword"
          type="password"
          placeholder="Ulangi password baru"
          class="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E8B86D] focus:border-transparent"
        />
      </div>

      <!-- Submit Button -->
      <BaseButton type="submit" variant="primary" block :loading="loading">
        Buat Password
      </BaseButton>
    </form>
  </div>
</template>
