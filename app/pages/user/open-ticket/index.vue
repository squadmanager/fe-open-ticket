<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
});

const { selectedTicket, createTicket, resetAndFetch } = useTickets();

const isCreateModalOpen = ref(false);
const isSubmitting = ref(false);
const isShowingDetail = ref(false);
const alertState = reactive({ isOpen: false, icon: 'success' as 'success' | 'error' | 'warning', title: '', text: '' });

function handleSelectTicket() {
  isShowingDetail.value = true;
}

function handleBack() {
  isShowingDetail.value = false;
}

async function handleCreateTicket(data: {
  title: string;
  description: string;
  priorityId: number;
  appId: number;
  highPriorityReason: string;
  attachments: File[];
}) {
  isSubmitting.value = true;
  try {
    await createTicket(data);
    isCreateModalOpen.value = false;
    await resetAndFetch();
  } catch (error) {
    console.error('Failed to create ticket:', error);
    alertState.icon = 'error';
    alertState.title = 'Gagal';
    alertState.text = 'Gagal membuat ticket.';
    alertState.isOpen = true;
  } finally {
    isSubmitting.value = false;
  }
}

watch(() => selectedTicket.value, (newVal) => {
  if (newVal) {
    handleSelectTicket();
  }
});
</script>

<template>
  <div class="flex h-[calc(100vh-130px)] md:h-[calc(100vh-140px)]">
    <!-- Left Panel: Ticket List -->
    <div
      class="w-full md:w-[380px] md:flex-shrink-0 flex-shrink-0"
      :class="{ 'hidden md:block': isShowingDetail }"
    >
      <ModulesTicketUserTicketList @create="isCreateModalOpen = true" />
    </div>

    <!-- Right Panel: Ticket Detail -->
    <div
      class="flex-1 bg-gray-50"
      :class="{ 'hidden md:block': !isShowingDetail }"
    >
      <ModulesTicketUserTicketDetail
        v-if="selectedTicket"
        :ticket="selectedTicket"
        @back="handleBack"
      />

      <!-- Empty State -->
      <div v-else class="flex items-center justify-center h-full">
        <div class="text-center">
          <svg
            class="w-16 h-16 mx-auto text-gray-300 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <p class="text-gray-500 text-sm">Pilih tiket untuk melihat detail</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Create Ticket Modal -->
  <ModulesTicketCreateTicketModal
    :is-open="isCreateModalOpen"
    :is-submitting="isSubmitting"
    @close="isCreateModalOpen = false"
    @submit="handleCreateTicket"
  />

  <!-- Alert Modal -->
  <BaseAppAlertModal
    :is-open="alertState.isOpen"
    :icon="alertState.icon"
    :title="alertState.title"
    :text="alertState.text"
    @close="alertState.isOpen = false"
  />
</template>
