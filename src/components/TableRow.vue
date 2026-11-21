<script setup lang="ts">
import type { Card, Column } from '#shared/types/board'

const { card, column, gridColumns, canDrag } = defineProps<{
  card:         Card
  column:       Column
  gridColumns:  string
  canDrag:      boolean
}>()

const emit = defineEmits<{ open: [] }>()

const { board, doneColumn, moveCard, deleteCard, updateCard } = useBoard()
const { visibleFields } = useTableFields()

const inlineFields = computed(() => visibleFields.value.filter((field) => field !== 'description'))

function toggleDone() {
  if (!column.isDone) {
    if (doneColumn.value) moveCard(card.id, doneColumn.value.id)
    return
  }

  const target = board.value.columns.find((option) => statusOf(option) === 'todo')
    ?? board.value.columns.find((option) => !option.isDone)
  if (target) moveCard(card.id, target.id)
}

function remove() {
  if (confirm(`Delete "${card.title}"?`)) deleteCard(card.id)
}
</script>

<template>
  <div
    class="group flex cursor-pointer items-start gap-3 border-t px-3 py-2.5 transition-colors first:border-t-0
           hover:bg-hover/50 sm:grid sm:items-center sm:gap-8"
    :style="{ gridTemplateColumns: gridColumns }"
    @click="emit('open')"
  >
    <div class="flex min-w-0 flex-1 items-start gap-2 sm:items-center">
      <span
        v-if="canDrag"
        aria-hidden="true"
        class="drag-handle -ml-1 flex h-5 w-4 shrink-0 cursor-grab items-center justify-center text-text-sub/50
               transition-opacity hover:text-text group-hover:opacity-100 [@media(hover:hover)]:opacity-0"
        @click.stop
      >
        <svg viewBox="0 0 24 24" class="size-3.5" fill="currentColor">
          <circle cx="9" cy="6" r="1.6" />
          <circle cx="15" cy="6" r="1.6" />
          <circle cx="9" cy="12" r="1.6" />
          <circle cx="15" cy="12" r="1.6" />
          <circle cx="9" cy="18" r="1.6" />
          <circle cx="15" cy="18" r="1.6" />
        </svg>
      </span>

      <button
        v-if="doneColumn"
        type="button"
        role="checkbox"
        :aria-checked="column.isDone"
        :aria-label="column.isDone ? `Mark ${card.title} as not done` : `Mark ${card.title} as done`"
        class="mt-0.5 flex size-4 shrink-0 cursor-pointer items-center justify-center rounded border transition-colors
               sm:mt-0"
        :class="column.isDone ? 'border-success bg-success text-primary' : 'border-text-sub/40 hover:border-text'"
        @click.stop="toggleDone"
      >
        <svg v-if="column.isDone" viewBox="0 0 24 24" class="size-3" fill="none" stroke="currentColor"
             stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <path d="m5 12.5 4.5 4.5L19 7.5" />
        </svg>
      </button>

      <div class="ml-0.5 flex min-w-0 flex-1 flex-col gap-1">
        <span
          class="truncate text-sm"
          :class="{ 'text-text-sub line-through decoration-text-sub/40': column.isDone }"
        >
          {{ card.title }}
        </span>

        <span
          v-if="visibleFields.includes('description') && card.description"
          class="truncate text-xs text-text-sub sm:hidden"
        >
          {{ card.description }}
        </span>

        <span class="flex flex-wrap items-center gap-x-3 gap-y-1 empty:hidden sm:hidden">
          <CardTableCell
            v-for="field in inlineFields"
            :key="field"
            :field="field"
            :card="card"
            :column="column"
            inline
          />
        </span>
      </div>
    </div>

    <div v-for="field in visibleFields" :key="field" class="hidden min-w-0 sm:block">
      <PriorityPicker
        v-if="field === 'priority'"
        compact
        :label="`Priority for ${card.title}`"
        :model-value="card.priority"
        @update:model-value="updateCard(card.id, { priority: $event })"
      />
      <DueDatePicker
        v-else-if="field === 'due'"
        compact
        :done="column.isDone"
        :label="`Due date for ${card.title}`"
        :model-value="card.dueDate"
        @update:model-value="updateCard(card.id, { dueDate: $event })"
      />
      <CardTableCell v-else :field="field" :card="card" :column="column" />
    </div>

    <TableRowMenu :card-title="card.title" @open="emit('open')" @delete="remove" />
  </div>
</template>
