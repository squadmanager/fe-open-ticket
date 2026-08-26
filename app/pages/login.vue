<script setup lang="ts">
definePageMeta({
  layout: "auth",
});

const { login } = useAuth();

const form = reactive({
  username: "",
  password: "",
});

const loading = ref(false);
const error = ref("");

async function handleLogin() {
  loading.value = true;
  error.value = "";

  const result = await login(form.username, form.password);

  if (result.success) {
    if (result.requiresPassword) {
      navigateTo("/create-password");
    } else {
      navigateTo("/user/open-ticket");
    }
  } else {
    error.value = result.error || "Username atau password salah";
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
      <img
        src="/icons/ic-support-ticket.png"
        alt="Logo"
        class="w-16 h-16 object-contain mx-auto mb-4"
      />
      <h1 class="text-2xl font-bold text-gray-900 mb-2">
        Selamat Datang di Layanan Support
      </h1>
      <p class="text-sm text-gray-500 leading-relaxed">
        Silakan masuk untuk mengakses tiket support Anda
      </p>
    </div>

    <!-- Error Message -->
    <div
      v-if="error"
      class="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 text-center"
    >
      {{ error }}
    </div>

    <!-- Form -->
    <form @submit.prevent="handleLogin">
      <BaseInput
        v-model="form.username"
        placeholder="Enter Username"
        type="text"
      />

      <BaseInput
        v-model="form.password"
        placeholder="Enter Password"
        type="password"
      />

      <!-- Submit Button -->
      <BaseButton type="submit" variant="primary" block :loading="loading">
        Sign in
      </BaseButton>
    </form>

    <!-- Info Box -->
    <div class="mt-6 p-4 bg-gray-50 border border-gray-100 rounded-xl">
      <div class="flex items-start gap-3">
        <svg
          class="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p class="text-xs text-gray-500 leading-relaxed">
          Belum punya akun? Gunakan akun My Mazabuta, Urbana, atau Serva untuk
          masuk.
        </p>
      </div>
    </div>
  </div>
</template>
