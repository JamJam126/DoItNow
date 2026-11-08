<script setup lang="ts">
import type { Card, Column } from '#shared/types/board'

defineProps<{ column: Column }>()
defineEmits<{ openCard: [card: Card] }>()
</script>

<template>
  <section
    class="flex max-h-full w-72 max-w-[85vw] shrink-0 snap-start flex-col rounded-md border"
  >
    <header class="flex h-11 shrink-0 items-center justify-between border-b pr-1.5 pl-3">
      <div class="flex items-center gap-2">
        <h2 class="text-sm font-medium">{{ column.title }}</h2>
        <span class="font-mono text-xs text-text-sub/60">{{ column.cards.length }}</span>
      </div>

      <UiButton variant="ghost" size="sm" aria-label="Column options">⋯</UiButton>
    </header>

    <ul class="flex min-h-0 flex-col gap-2 overflow-y-auto p-2">
      <li v-for="card in column.cards" :key="card.id">
        <BoardCard :card="card" @open="$emit('openCard', card)" />
      </li>
    </ul>

    <div class="shrink-0 p-2 pt-0">
      <UiButton variant="ghost" size="sm" class="w-full justify-start">+ Add card</UiButton>
    </div>
  </section>
</template>
