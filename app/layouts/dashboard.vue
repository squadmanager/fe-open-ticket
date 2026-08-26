<template>
  <div class="min-h-screen bg-[#F5F6FA] w-full">
    <!-- Fixed header: only header on mobile, header + nav on desktop -->
    <div class="fixed top-0 left-0 right-0 z-50">
      <LayoutHeader />
      <LayoutNavigation />
    </div>

    <!-- Main content -->
    <main class="w-full pt-[70px] md:pt-[150px] px-4 md:px-6 pb-24 md:pb-6">
      <slot />
    </main>

    <LayoutFooter />
  </div>
</template>
