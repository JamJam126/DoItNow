<script setup lang="ts">
import type { Card } from '#shared/types/board'

const { card, done } = defineProps<{
  card:  Card
  done:  boolean
}>()

const dueClass = computed(() => (card.dueDate ? dueStyle[dueStateOf(card.dueDate, done)] : ''))

const doneSubtasks = computed(() => card.subtasks.filter((subtask) => subtask.isDone).length)
const allSubtasksDone = computed(() => card.subtasks.length > 0 && doneSubtasks.value === card.subtasks.length)

defineEmits<{ open: [] }>()
</script>

<template>
  <button
    type="button"
    class="flex w-full cursor-grab flex-col gap-1 rounded-md border bg-hover/60 p-3 text-left
           transition hover:border-text-sub/30"
    :class="{ 'opacity-50 hover:opacity-100': done }"
    @click="$emit('open')"
  >
    <span class="text-sm">{{ card.title }}</span>
    <span v-if="card.description" class="line-clamp-2 text-xs leading-relaxed text-text-sub">
      {{ card.description }}
    </span>

    <span
      v-if="card.priority || card.dueDate || card.subtasks.length"
      class="mt-1 flex flex-wrap items-center gap-2 font-mono text-[11px]"
    >
      <span v-if="card.priority" class="rounded border px-1.5 capitalize" :class="priorityStyle[card.priority]">
        {{ card.priority }}
      </span>
      <span v-if="card.dueDate" class="flex items-center gap-1" :class="dueClass">
        <svg viewBox="0 0 24 24" class="size-3" fill="none" stroke="currentColor" stroke-width="2"
             stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M16 3v4M8 3v4M3 10h18" />
        </svg>
        {{ formatDueDate(card.dueDate) }}
      </span>
      <span
        v-if="card.subtasks.length"
        class="flex items-center gap-1"
        :class="allSubtasksDone ? 'text-success' : 'text-text-sub'"
      >
        <SubtaskIcon class="size-3" />
        {{ doneSubtasks }}/{{ card.subtasks.length }}
      </span>
    </span>
  </button>
</template>
