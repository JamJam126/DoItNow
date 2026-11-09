<script setup lang="ts">
const { cardCount, doneCount } = defineProps<{
  boardName:      string
  cardCount:      number
  doneCount?:     number
  hasSaveError?:  boolean
}>()

const { clear: clearSession } = useUserSession()

const summary = computed(() =>
  doneCount === undefined ? `${cardCount} cards` : `${doneCount}/${cardCount} done`,
)

async function logOut() {
  await clearSession()
  await navigateTo('/login')
}
</script>

<template>
  <header class="flex h-14 shrink-0 items-center justify-between border-b px-4 sm:px-6">
    <div class="flex items-center gap-2.5">
      <AppLogo />
      <span class="text-text-sub/40">/</span>
      <span class="text-sm text-text-sub">{{ boardName }}</span>
    </div>

    <div class="flex items-center gap-3">
      <span v-if="hasSaveError" class="font-mono text-xs text-error">
        changes not saved · reload
      </span>
      <span v-else class="font-mono text-xs text-text-sub/60">{{ summary }}</span>

      <UiButton variant="ghost" size="sm" @click="logOut">Log out</UiButton>
    </div>
  </header>
</template>
