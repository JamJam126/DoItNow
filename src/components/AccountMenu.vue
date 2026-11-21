<script setup lang="ts">
const { user, clear: clearSession } = useUserSession()

const isOpen = ref(false)

function close() {
  isOpen.value = false
}

async function logOut() {
  close()
  await clearSession()
  await navigateTo('/login')
}
</script>

<template>
  <div class="relative" @keydown.esc="close">
    <UiButton
      variant="ghost"
      size="sm"
      aria-label="Account"
      aria-haspopup="menu"
      :aria-expanded="isOpen"
      @click="isOpen = !isOpen"
    >
      <svg viewBox="0 0 24 24" class="size-4 sm:hidden" fill="none" stroke="currentColor" stroke-width="2"
           stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </svg>
      <span class="hidden max-w-32 truncate font-mono sm:inline">{{ user?.username }}</span>
      <svg viewBox="0 0 24 24" class="hidden size-3 sm:block" fill="none" stroke="currentColor" stroke-width="2"
           stroke-linecap="round" stroke-linejoin="round">
        <path d="m6 9 6 6 6-6" />
      </svg>
    </UiButton>

    <template v-if="isOpen">
      <div class="fixed inset-0 z-10" @click="close" />

      <nav
        class="absolute top-full right-0 z-20 mt-1 flex w-52 flex-col rounded-md border bg-primary p-1
               shadow-lg shadow-black/40 transition starting:-translate-y-1 starting:opacity-0"
      >
        <p class="truncate px-2 py-1.5 font-mono text-xs text-text-sub/60">{{ user?.username }}</p>

        <div class="my-1 border-t" />

        <NuxtLink
          to="/account"
          class="rounded px-2 py-1.5 text-sm text-text-sub transition-colors hover:bg-hover hover:text-text"
          @click="close"
        >
          Change password
        </NuxtLink>

        <button
          type="button"
          class="cursor-pointer rounded px-2 py-1.5 text-left text-sm text-text-sub transition-colors
                 hover:bg-hover hover:text-text"
          @click="logOut"
        >
          Log out
        </button>
      </nav>
    </template>
  </div>
</template>
