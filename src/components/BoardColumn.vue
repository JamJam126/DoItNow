<script setup lang="ts">
import type { Card, Column } from '#shared/types/board'

const { column } = defineProps<{ column: Column }>()
defineEmits<{ openCard: [card: Card] }>()

const { renameColumn } = useBoard()

const title = computed({
  get: () => column.title,
  set: (title) => renameColumn(column.id, title),
})

const isAddingCard = ref(false)
</script>

<template>
  <section
    class="flex max-h-full w-72 max-w-[85vw] shrink-0 snap-start flex-col rounded-md border"
  >
    <header class="flex h-11 shrink-0 items-center gap-2 border-b pr-1.5 pl-3">
      <ColumnTitle v-model="title" :class="{ 'text-success': column.isDone }" />

      <span
        class="ml-auto font-mono text-xs"
        :class="column.isDone ? 'text-success' : 'text-text-sub/60'"
      >
        {{ column.cards.length }}
      </span>

      <ColumnMenu :column="column" />
    </header>

    <ul class="flex min-h-0 flex-col gap-2 overflow-y-auto p-2">
      <li v-for="card in column.cards" :key="card.id">
        <BoardCard :card="card" :done="column.isDone" @open="$emit('openCard', card)" />
      </li>
    </ul>

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
