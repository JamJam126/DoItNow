<script setup lang="ts">
import type { BoardSummary } from '#shared/types/board'

const { currentBoardId } = defineProps<{ currentBoardId: string }>()

const isOpen = ref(false)
const boards = ref<BoardSummary[]>([])
const isLoading = ref(false)
const loadFailed = ref(false)

async function toggle() {
  isOpen.value = !isOpen.value
  if (!isOpen.value) return

  isLoading.value = boards.value.length === 0
  loadFailed.value = false

  try {
    boards.value = await boardApi.listBoards()
  } catch {
    loadFailed.value = true
  } finally {
    isLoading.value = false
  }
}

function close() {
  isOpen.value = false
}
</script>

<template>
  <div class="relative" @keydown.esc="close">
    <UiButton
      variant="ghost"
      size="sm"
      aria-label="Switch board"
      aria-haspopup="menu"
      :aria-expanded="isOpen"
      @click="toggle"
    >
      <svg viewBox="0 0 24 24" class="size-3.5" fill="none" stroke="currentColor" stroke-width="2"
           stroke-linecap="round" stroke-linejoin="round">
        <path d="m6 9 6 6 6-6" />
      </svg>
    </UiButton>

    <template v-if="isOpen">
      <div class="fixed inset-0 z-10" @click="close" />

      <nav
        class="absolute top-full left-0 z-20 mt-1 flex w-56 flex-col rounded-md border bg-primary p-1
               shadow-lg shadow-black/40 transition starting:-translate-y-1 starting:opacity-0"
      >
        <div v-if="isLoading" aria-busy="true" aria-label="Loading boards">
          <div v-for="width in ['w-32', 'w-24', 'w-28']" :key="width" class="px-2 py-2.5">
            <div class="h-3 animate-pulse rounded bg-hover" :class="width" />
          </div>
        </div>
        <p v-else-if="loadFailed" class="px-2 py-1.5 font-mono text-xs text-error">
          could not load boards
        </p>

        <NuxtLink
          v-for="board in boards"
          :key="board.id"
          :to="`/boards/${board.id}`"
          class="flex items-center justify-between gap-2 rounded px-2 py-1.5 text-sm transition-colors
                 hover:bg-hover"
          :class="board.id === currentBoardId ? 'text-text' : 'text-text-sub hover:text-text'"
          @click="close"
        >
          <span class="truncate">{{ board.name }}</span>
          <span v-if="board.id === currentBoardId" class="text-xs">✓</span>
        </NuxtLink>

        <div class="my-1 border-t" />

        <NuxtLink
          to="/"
          class="rounded px-2 py-1.5 text-sm text-text-sub transition-colors hover:bg-hover hover:text-text"
          @click="close"
        >
          All boards
        </NuxtLink>
      </nav>
    </template>
  </div>
</template>
