<script setup lang="ts">
import type { Card, Column } from '#shared/types/board'
import type { TableField } from '~/composables/useTableFields'

const { field, card, column, inline = false } = defineProps<{
  field:    TableField
  card:     Card
  column:   Column
  inline?:  boolean
}>()
</script>

<template>
  <span v-if="field === 'description' && card.description" class="block max-w-52 truncate text-sm text-text-sub">
    {{ card.description }}
  </span>

  <span
    v-else-if="field === 'due' && card.dueDate"
    class="inline-flex items-center gap-1 font-mono text-xs"
    :class="dueStyle[dueStateOf(card.dueDate, column.isDone)]"
  >
    <svg v-if="inline" viewBox="0 0 24 24" class="size-3" fill="none" stroke="currentColor" stroke-width="2"
         stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 10h18" />
    </svg>
    {{ formatDueDate(card.dueDate) }}
  </span>

  <span
    v-else-if="field === 'priority' && card.priority"
    class="inline-flex items-center gap-1.5 font-mono text-xs capitalize"
    :class="priorityTextStyle[card.priority]"
  >
    <svg viewBox="0 0 24 24" class="size-3.5 shrink-0" fill="none" stroke="currentColor" stroke-width="2"
         stroke-linecap="round" stroke-linejoin="round">
      <path d="M5 21V4" />
      <path d="M5 4h12l-2.5 4L17 12H5z" fill="currentColor" />
    </svg>
    {{ card.priority }}
  </span>

  <span v-else-if="field === 'created'" class="font-mono text-xs text-text-sub">
    {{ inline ? 'created ' : '' }}{{ formatShortDate(new Date(card.createdAt)) }}
  </span>
</template>
