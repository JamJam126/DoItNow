<script setup lang="ts">
import type { BoardSummary } from '#shared/types/board'

const { board } = defineProps<{ board: BoardSummary }>()
defineEmits<{ delete: [] }>()

const summary = computed(() =>
  board.doneCount === null
    ? `${board.cardCount} cards`
    : `${board.doneCount}/${board.cardCount} done`,
)

const donePercent = computed(() =>
  board.doneCount && board.cardCount ? (board.doneCount / board.cardCount) * 100 : 0,
)
</script>

<template>
  <div class="group relative">
    <NuxtLink
      :to="`/boards/${board.id}`"
      class="flex h-28 flex-col justify-between rounded-md border bg-hover/40 p-4
             transition-colors hover:border-text-sub/30 hover:bg-hover"
    >
      <span class="line-clamp-2 pr-8 text-sm font-medium">{{ board.name }}</span>

      <div class="flex flex-col gap-2">
        <span class="font-mono text-xs text-text-sub/60">{{ summary }}</span>
        <div v-if="board.doneCount !== null" class="h-0.5 overflow-hidden rounded-full bg-border">
          <div class="h-full bg-success" :style="{ width: `${donePercent}%` }" />
        </div>
      </div>
    </NuxtLink>

    <UiButton
      variant="danger"
      size="sm"
      aria-label="Delete board"
      class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 focus-visible:opacity-100
             [@media(hover:none)]:opacity-100"
      @click="$emit('delete')"
    >
      <svg viewBox="0 0 24 24" class="size-3.5" fill="none" stroke="currentColor" stroke-width="2"
           stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 6h18" />
        <path d="M8 6V4h8v2" />
        <path d="M19 6l-1 14H6L5 6" />
      </svg>
    </UiButton>
  </div>
</template>
