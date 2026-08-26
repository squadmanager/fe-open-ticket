<template>
  <div
    class="min-h-screen bg-[#F5F0EB] flex items-center justify-center p-4 relative overflow-hidden"
  >
    <!-- Decorative SVG Left -->
    <div
      class="absolute left-0 top-0 w-full h-full pointer-events-none hidden lg:block"
    >
      <!-- Squiggly line top left -->
      <svg
        class="absolute left-[8%] top-[15%] w-16 h-16 text-gray-800"
        viewBox="0 0 64 64"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
      >
        <path d="M8 32 C16 24, 24 40, 32 32 C40 24, 48 40, 56 32" />
      </svg>

      <!-- Small circle -->
      <svg
        class="absolute left-[18%] top-[12%] w-3 h-3 text-gray-800"
        viewBox="0 0 12 12"
      >
        <circle
          cx="6"
          cy="6"
          r="5"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
        />
      </svg>

      <!-- Rectangle with lines -->
      <svg
        class="absolute left-[10%] top-[30%] w-24 h-16 text-gray-800"
        viewBox="0 0 96 64"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
      >
        <rect x="1" y="1" width="94" height="62" rx="2" />
        <line x1="20" y1="20" x2="76" y2="20" />
        <line x1="20" y1="32" x2="56" y2="32" />
      </svg>

      <!-- Small circle 2 -->
      <svg
        class="absolute left-[22%] top-[48%] w-3 h-3 text-gray-800"
        viewBox="0 0 12 12"
      >
        <circle
          cx="6"
          cy="6"
          r="5"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
        />
      </svg>

      <!-- Dot pattern block bottom left -->
      <svg
        class="absolute left-[5%] bottom-[15%] w-28 h-32"
        viewBox="0 0 112 128"
      >
        <rect x="0" y="0" width="112" height="128" fill="#E8B86D" rx="4" />
        <g fill="#1a1a1a">
          <circle cx="16" cy="16" r="4" />
          <circle cx="40" cy="16" r="4" />
          <circle cx="64" cy="16" r="4" />
          <circle cx="88" cy="16" r="4" />
          <circle cx="16" cy="40" r="4" />
          <circle cx="40" cy="40" r="4" />
          <circle cx="64" cy="40" r="4" />
          <circle cx="88" cy="40" r="4" />
          <circle cx="16" cy="64" r="4" />
          <circle cx="40" cy="64" r="4" />
          <circle cx="64" cy="64" r="4" />
          <circle cx="88" cy="64" r="4" />
          <circle cx="16" cy="88" r="4" />
          <circle cx="40" cy="88" r="4" />
          <circle cx="64" cy="88" r="4" />
          <circle cx="88" cy="88" r="4" />
          <circle cx="16" cy="112" r="4" />
          <circle cx="40" cy="112" r="4" />
          <circle cx="64" cy="112" r="4" />
          <circle cx="88" cy="112" r="4" />
        </g>
      </svg>

      <!-- Arrow up box -->
      <svg
        class="absolute left-[15%] bottom-[18%] w-20 h-24 text-gray-800"
        viewBox="0 0 80 96"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
      >
        <rect x="1" y="1" width="78" height="94" rx="2" />
        <path d="M40 70 L40 30 M28 42 L40 30 L52 42" />
      </svg>

      <!-- Squiggly line right of arrow -->
      <svg
        class="absolute left-[25%] bottom-[35%] w-20 h-8 text-gray-800"
        viewBox="0 0 80 32"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
      >
        <path
          d="M4 16 C12 8, 20 24, 28 16 C36 8, 44 24, 52 16 C60 8, 68 24, 76 16"
        />
      </svg>
    </div>

    <!-- Decorative SVG Right -->
    <div
      class="absolute right-0 top-0 w-full h-full pointer-events-none hidden lg:block"
    >
      <!-- Small box top right -->
      <svg
        class="absolute right-[18%] top-[20%] w-12 h-10 text-gray-800"
        viewBox="0 0 48 40"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
      >
        <rect x="1" y="1" width="46" height="38" rx="2" />
        <line x1="12" y1="12" x2="36" y2="12" />
        <line x1="12" y1="20" x2="28" y2="20" />
      </svg>

      <!-- Dot pattern block bottom right -->
      <svg
        class="absolute right-[3%] bottom-[8%] w-28 h-32"
        viewBox="0 0 112 128"
      >
        <rect x="0" y="0" width="112" height="128" fill="#E8B86D" rx="4" />
        <g fill="#1a1a1a">
          <circle cx="16" cy="16" r="4" />
          <circle cx="40" cy="16" r="4" />
          <circle cx="64" cy="16" r="4" />
          <circle cx="88" cy="16" r="4" />
          <circle cx="16" cy="40" r="4" />
          <circle cx="40" cy="40" r="4" />
          <circle cx="64" cy="40" r="4" />
          <circle cx="88" cy="40" r="4" />
          <circle cx="16" cy="64" r="4" />
          <circle cx="40" cy="64" r="4" />
          <circle cx="64" cy="64" r="4" />
          <circle cx="88" cy="64" r="4" />
          <circle cx="16" cy="88" r="4" />
          <circle cx="40" cy="88" r="4" />
          <circle cx="64" cy="88" r="4" />
          <circle cx="88" cy="88" r="4" />
          <circle cx="16" cy="112" r="4" />
          <circle cx="40" cy="112" r="4" />
          <circle cx="64" cy="112" r="4" />
          <circle cx="88" cy="112" r="4" />
        </g>
      </svg>
    </div>

    <!-- Main Content -->
    <slot />
  </div>
</template>
