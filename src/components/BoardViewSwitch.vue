<script setup lang="ts">
import type { BoardView } from '~/composables/useBoardView'

const view = defineModel<BoardView>({ required: true })

const options: { value: BoardView, label: string }[] = [
  { value: 'board',  label: 'Board view' },
  { value: 'table',  label: 'Table view' },
]
</script>

<template>
  <div class="flex rounded-md border p-0.5">
    <button
      v-for="option in options"
      :key="option.value"
      type="button"
      :title="option.label"
      :aria-label="option.label"
      :aria-pressed="view === option.value"
      class="flex size-6 cursor-pointer items-center justify-center rounded transition-colors"
      :class="view === option.value ? 'bg-hover text-text' : 'text-text-sub/60 hover:text-text'"
      @click="view = option.value"
    >
      <svg viewBox="0 0 24 24" class="size-3.5" fill="none" stroke="currentColor" stroke-width="2"
           stroke-linecap="round" stroke-linejoin="round">
        <template v-if="option.value === 'board'">
          <rect x="3" y="4" width="5" height="16" rx="1" />
          <rect x="10" y="4" width="5" height="11" rx="1" />
          <rect x="17" y="4" width="4" height="7" rx="1" />
        </template>
        <path v-else d="M3 6h18M3 12h18M3 18h18" />
      </svg>
    </button>
  </div>
</template>
