<script setup lang="ts">
import type { Column } from '#shared/types/board'

const { cardId, column } = defineProps<{
  cardId:  string
  column:  Column
}>()

const { board, moveCard } = useBoard()

const isOpen = ref(false)

function moveTo(columnId: string) {
  moveCard(cardId, columnId)
  isOpen.value = false
}
</script>

<template>
  <div class="relative" @keydown.esc.stop="isOpen = false">
    <button
      type="button"
      aria-haspopup="listbox"
      :aria-expanded="isOpen"
      class="flex cursor-pointer items-center gap-1 rounded px-1.5 py-0.5 transition-colors hover:bg-hover"
      :class="column.isDone ? 'text-success' : 'text-text'"
      @click="isOpen = !isOpen"
    >
      {{ column.title.toLowerCase() }}
      <span class="text-text-sub/60">▾</span>
    </button>

    <template v-if="isOpen">
      <div class="fixed inset-0 z-10" @click="isOpen = false" />

      <ul
        role="listbox"
        class="absolute top-full left-0 z-20 mt-1 flex w-48 flex-col rounded-md border bg-primary p-1
               font-sans shadow-lg shadow-black/40 transition starting:-translate-y-1 starting:opacity-0"
      >
        <li v-for="option in board.columns" :key="option.id">
          <button
            type="button"
            role="option"
            :aria-selected="option.id === column.id"
            class="flex w-full cursor-pointer items-center justify-between rounded px-2 py-1.5 text-left text-sm
                   transition-colors hover:bg-hover"
            :class="{
              'text-success': option.isDone,
              'text-text': !option.isDone && option.id === column.id,
              'text-text-sub hover:text-text': !option.isDone && option.id !== column.id,
            }"
            @click="moveTo(option.id)"
          >
            {{ option.title }}
            <span v-if="option.id === column.id" class="text-xs">✓</span>
          </button>
        </li>
      </ul>
    </template>
  </div>
</template>
