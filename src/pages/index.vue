<script setup lang="ts">
import type { Card } from '#shared/types/board'
import { VueDraggable } from 'vue-draggable-plus'

const { board, status, doneColumn, findCard, setColumns } = useBoard()

const columns = computed({
  get: () => board.value.columns,
  set: setColumns,
})

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

    <p
      v-if="status !== 'ready'"
      class="grid flex-1 place-items-center font-mono text-xs text-text-sub/60"
    >
      {{ status === 'loading' ? 'loading board…' : 'could not load the board' }}
    </p>

    <main v-else class="flex min-h-0 flex-1 snap-x scroll-px-4 items-start gap-4 overflow-x-auto p-4 sm:scroll-px-6 sm:p-6">
      <VueDraggable
        v-model="columns"
        handle="header"
        filter="input, button, [data-no-drag]"
        :prevent-on-filter="false"
        :animation="150"
        :delay="150"
        :delay-on-touch-only="true"
        :force-fallback="true"
        :fallback-on-body="true"
        class="flex items-start gap-4 self-stretch"
      >
        <BoardColumn
          v-for="column in board.columns"
          :key="column.id"
          :column="column"
          @open-card="openCard"
        />
      </VueDraggable>

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
