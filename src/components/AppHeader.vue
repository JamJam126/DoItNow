<template>
  <header
    class="flex h-14 shrink-0 items-center justify-between gap-4 border-b px-4
           sm:grid sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:px-6"
  >
    <div class="flex min-w-0 items-center gap-2.5">
      <NuxtLink to="/" aria-label="All boards" class="shrink-0">
        <AppLogo />
      </NuxtLink>

      <template v-if="$slots.title">
        <span class="text-text-sub/40">/</span>
        <slot name="title" />
      </template>
    </div>

    <div class="flex shrink-0 justify-center">
      <slot name="center" />
    </div>

    <div class="flex shrink-0 items-center justify-end gap-3">
      <slot />
      <AccountMenu />
    </div>
  </header>
</template>
