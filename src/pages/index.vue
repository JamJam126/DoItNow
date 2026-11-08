<script setup lang="ts">
import type { Card } from '#shared/types/board'

const { board, doneColumn, findCard } = useBoard()

const cardCount = computed(() => board.value.columns.flatMap((column) => column.cards).length)
const doneCount = computed(() => doneColumn.value?.cards.length)

const selectedCardId = ref<string | null>(null)
const selected = computed(() => (selectedCardId.value ? findCard(selectedCardId.value) : undefined))

function openCard(card: Card) {
  selectedCardId.value = card.id
}

function closeCard() {
  selectedCardId.value = null
}
</script>

<template>
  <div class="flex h-dvh flex-col">
    <AppHeader :board-name="board.name" :card-count="cardCount" :done-count="doneCount" />

    <main class="flex min-h-0 flex-1 snap-x items-start gap-4 overflow-x-auto p-4 sm:p-6">
      <BoardColumn
        v-for="column in board.columns"
        :key="column.id"
        :column="column"
        @open-card="openCard"
      />

      <AddColumnForm />
    </main>

    <CardPanel
      v-if="selected"
      :key="selected.card.id"
      :card="selected.card"
      :column="selected.column"
      @close="closeCard"
    />
  </div>
</template>
