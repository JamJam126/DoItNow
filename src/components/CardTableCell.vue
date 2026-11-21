<script setup lang="ts">
import type { Card, Column } from '#shared/types/board'
import type { TableField } from '~/composables/useTableFields'

const { field, card, column, inline = false } = defineProps<{
  field:    TableField
  card:     Card
  column:   Column
  inline?:  boolean
}>()

const status = computed(() => statusOf(column))
</script>

<template>
  <span v-if="field === 'status'" class="inline-flex items-center gap-1.5" :class="statusStyle[status]">
    <StatusIcon :status="status" />
    {{ statusLabel[status].toLowerCase() }}
  </span>

  <span
    v-else-if="field === 'priority' && card.priority"
    class="rounded border px-1.5 capitalize"
    :class="priorityStyle[card.priority]"
  >
    {{ card.priority }}
  </span>

  <span
    v-else-if="field === 'due' && card.dueDate"
    class="inline-flex items-center gap-1"
    :class="dueStyle[dueStateOf(card.dueDate, column.isDone)]"
  >
    <svg v-if="inline" viewBox="0 0 24 24" class="size-3" fill="none" stroke="currentColor" stroke-width="2"
         stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 10h18" />
    </svg>
    {{ formatDueDate(card.dueDate) }}
  </span>

  <span v-else-if="field === 'created'" class="text-text-sub">
    {{ inline ? 'created ' : '' }}{{ formatShortDate(new Date(card.createdAt)) }}
  </span>

  <span v-else-if="field === 'description' && card.description" class="block max-w-64 truncate text-text-sub">
    {{ card.description }}
  </span>
</template>
