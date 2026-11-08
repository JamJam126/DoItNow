<script setup lang="ts">
import type { Card, Column } from '#shared/types/board'
import { VueDraggable } from 'vue-draggable-plus'

const { column } = defineProps<{ column: Column }>()
defineEmits<{ openCard: [card: Card] }>()

const { renameColumn, setCards } = useBoard()

const title = computed({
  get: () => column.title,
  set: (title) => renameColumn(column.id, title),
})

const cards = computed({
  get: () => column.cards,
  set: (cards) => setCards(column.id, cards),
})

const isAddingCard = ref(false)
</script>

<template>
  <section
    class="flex max-h-full w-72 max-w-[85vw] shrink-0 snap-start flex-col rounded-md border bg-primary"
  >
    <header class="flex h-11 shrink-0 cursor-grab items-center gap-2 border-b pr-1.5 pl-3">
      <ColumnTitle v-model="title" :class="{ 'text-success': column.isDone }" />

      <span
        class="ml-auto font-mono text-xs"
        :class="column.isDone ? 'text-success' : 'text-text-sub/60'"
      >
        {{ column.cards.length }}
      </span>

      <ColumnMenu :column="column" />
    </header>

    <VueDraggable
      v-model="cards"
      tag="ul"
      group="cards"
      :animation="150"
      :delay="150"
      :delay-on-touch-only="true"
      :force-fallback="true"
      :fallback-on-body="true"
      :empty-insert-threshold="32"
      class="flex flex-col gap-2 overflow-y-auto"
      :class="column.cards.length ? 'p-2' : 'pt-2'"
    >
      <li v-for="card in column.cards" :key="card.id">
        <BoardCard :card="card" :done="column.isDone" @open="$emit('openCard', card)" />
      </li>
    </VueDraggable>

    <div class="shrink-0 p-2 pt-0">
      <AddCardForm v-if="isAddingCard" :column-id="column.id" @close="isAddingCard = false" />
      <UiButton
        v-else
        variant="ghost"
        size="sm"
        class="w-full justify-start"
        @click="isAddingCard = true"
      >
        + Add card
      </UiButton>
    </div>
  </section>
</template>
