<script setup lang="ts">
import type { TicketAttachment } from "~/types/ticket";

interface Props {
  attachments: TicketAttachment[];
}

const props = defineProps<Props>();

const { formatFileSize } = useTickets();

function getFileIcon(type: string) {
  switch (type) {
    case "pdf":
      return { bg: "bg-red-500", text: "text-white", label: "PDF" };
    case "image":
      return { bg: "bg-blue-100", text: "text-blue-600", label: "IMG" };
    case "document":
      return { bg: "bg-blue-500", text: "text-white", label: "DOC" };
    default:
      return { bg: "bg-gray-200", text: "text-gray-600", label: "FILE" };
  }
}
</script>

<template>
  <div v-if="attachments.length > 0" class="mt-4">
    <h4 class="text-sm font-medium text-gray-700 mb-3">
      {{ attachments.length }} Attachment{{ attachments.length > 1 ? "s" : "" }}
    </h4>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div
        v-for="file in attachments"
        :key="file.id"
        class="flex items-center gap-3 p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
      >
        <!-- File Icon / Thumbnail -->
        <div
          v-if="file.type === 'image' && file.thumbnailUrl"
          class="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0"
        >
          <img
            :src="file.thumbnailUrl"
            :alt="file.name"
            class="w-full h-full object-cover"
          />
        </div>
        <div
          v-else
          class="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
          :class="getFileIcon(file.type).bg"
        >
          <span class="text-xs font-bold" :class="getFileIcon(file.type).text">
            {{ getFileIcon(file.type).label }}
          </span>
        </div>

        <!-- File Info -->
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-900 truncate">
            {{ file.name }}
          </p>
          <p class="text-xs text-gray-400">{{ formatFileSize(file.size) }}</p>
        </div>

        <!-- Download Button -->
        <a
          :href="file.url"
          target="_blank"
          class="p-2 text-gray-400 hover:text-[#E8B86D] transition-colors"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
        </a>
      </div>
    </div>
  </div>
</template>
