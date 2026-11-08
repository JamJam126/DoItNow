<script setup lang="ts">
import type { Column } from '#shared/types/board'

const { column } = defineProps<{ column: Column }>()

const { setDoneColumn, deleteColumn } = useBoard()

const isOpen = ref(false)

function toggleDone() {
  setDoneColumn(column.isDone ? null : column.id)
  isOpen.value = false
}

function remove() {
  isOpen.value = false

  const cardCount = column.cards.length
  if (cardCount > 0 && !confirm(`Delete "${column.title}" and its ${cardCount} cards?`)) return

  deleteColumn(column.id)
}
</script>

<template>
  <div class="relative" data-no-drag>
    <UiButton variant="ghost" size="sm" aria-label="Column options" @click="isOpen = !isOpen">
      ⋯
    </UiButton>

    <template v-if="isOpen">
      <div class="fixed inset-0 z-10" @click="isOpen = false" />

      <div
        class="absolute top-full right-0 z-20 mt-1 flex w-48 flex-col rounded-md border bg-primary p-1
               shadow-lg shadow-black/40 transition starting:-translate-y-1 starting:opacity-0"
      >
        <button
          type="button"
          class="rounded px-2 py-1.5 text-left text-sm text-text-sub
                 transition-colors hover:bg-hover hover:text-text"
          @click="toggleDone"
        >
          {{ column.isDone ? 'Unmark done column' : 'Mark as done column' }}
        </button>

        <button
          type="button"
          class="rounded px-2 py-1.5 text-left text-sm text-error
                 transition-colors hover:bg-error/10"
          @click="remove"
        >
          Delete column
        </button>
      </div>
    </template>
  </div>
</template>
