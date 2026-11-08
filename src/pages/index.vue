<script setup lang="ts">
import type { Card, Column } from '#shared/types/board'

const board = sampleBoard

const cardCount = computed(() => board.columns.flatMap((column) => column.cards).length)

const selected = ref<{ card: Card; column: Column } | null>(null)

function openCard(card: Card, column: Column) {
  selected.value = { card, column }
}

function closeCard() {
  selected.value = null
}
</script>

<template>
  <div class="flex h-dvh flex-col">
    <AppHeader :board-name="board.name" :card-count="cardCount" />

    <main class="flex min-h-0 flex-1 snap-x items-start gap-4 overflow-x-auto p-4 sm:p-6">
      <BoardColumn
        v-for="column in board.columns"
        :key="column.id"
        :column="column"
        @open-card="(card) => openCard(card, column)"
      />

      <button
        type="button"
        class="flex h-11 w-72 max-w-[85vw] shrink-0 snap-start items-center rounded-md
               border border-dashed px-3 text-sm text-text-sub
               transition-colors hover:bg-hover hover:text-text"
      >
        + Add column
      </button>
    </main>

    <CardPanel
      v-if="selected"
      :key="selected.card.id"
      :card="selected.card"
      :column-title="selected.column.title"
      @close="closeCard"
    />
  </div>
</template>
