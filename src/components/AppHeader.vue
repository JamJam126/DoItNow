<script setup lang="ts">
const { clear: clearSession } = useUserSession()

async function logOut() {
  await clearSession()
  await navigateTo('/login')
}
</script>

<template>
  <header class="flex h-14 shrink-0 items-center justify-between gap-4 border-b px-4 sm:px-6">
    <div class="flex min-w-0 items-center gap-2.5">
      <NuxtLink to="/" aria-label="All boards" class="shrink-0">
        <AppLogo />
      </NuxtLink>

      <template v-if="$slots.title">
        <span class="text-text-sub/40">/</span>
        <slot name="title" />
      </template>
    </div>

    <div class="flex shrink-0 items-center gap-3">
      <slot />
      <UiButton variant="ghost" size="sm" @click="logOut">Log out</UiButton>
    </div>
  </header>
</template>
