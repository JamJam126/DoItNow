<script setup lang="ts">
import type { Card, Column } from '#shared/types/board'
import { VueDraggable } from 'vue-draggable-plus'

const { card, column, gridColumns, canDrag } = defineProps<{
  card:         Card
  column:       Column
  gridColumns:  string
  canDrag:      boolean
}>()

const emit = defineEmits<{ open: [] }>()

const { board, doneColumn, moveCard, deleteCard, updateCard, updateSubtask, setSubtasks } = useBoard()
const { visibleFields } = useTableFields()
const { areSubtasksCollapsed, toggleSubtasks } = useCollapsedSubtasks()

const doneSubtasks = computed(() => card.subtasks.filter((subtask) => subtask.isDone).length)
const isCollapsed = computed(() => areSubtasksCollapsed(card.id))

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

const subtasks = computed({
  get: () => card.subtasks,
  set: (subtasks) => setSubtasks(card.id, subtasks),
})

function remove() {
  if (confirm(`Delete "${card.title}"?`)) deleteCard(card.id)
}
</script>

<template>
  <div class="border-t first:border-t-0">
    <div
      class="group flex cursor-pointer items-start gap-3 px-3 py-2.5 transition-colors
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
          <DragHandleIcon />
        </span>

        <UiCheckbox
          v-if="doneColumn"
          :checked="column.isDone"
          :label="column.isDone ? `Mark ${card.title} as not done` : `Mark ${card.title} as done`"
          class="mt-0.5 sm:mt-0"
          @click.stop="toggleDone"
        />

        <div class="ml-0.5 flex min-w-0 flex-1 flex-col gap-1">
          <span class="flex min-w-0 items-center gap-2">
            <span
              class="truncate text-sm"
              :class="{ 'text-text-sub line-through decoration-text-sub/40': column.isDone }"
            >
              {{ card.title }}
            </span>

            <button
              v-if="card.subtasks.length"
              type="button"
              :aria-expanded="!isCollapsed"
              :aria-label="isCollapsed ? `Show subtasks of ${card.title}` : `Hide subtasks of ${card.title}`"
              class="flex h-5 shrink-0 cursor-pointer items-center gap-0.5 rounded pr-1.5 pl-0.5 font-mono text-[11px]
                     transition-colors hover:bg-hover hover:text-text"
              :class="doneSubtasks === card.subtasks.length ? 'text-success' : 'text-text-sub'"
              @click.stop="toggleSubtasks(card.id)"
            >
              <svg viewBox="0 0 24 24" class="size-3.5 transition-transform" :class="{ '-rotate-90': isCollapsed }"
                   fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="m6 9 6 6 6-6" />
              </svg>
              {{ doneSubtasks }}/{{ card.subtasks.length }}
            </button>
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

    <VueDraggable
      v-if="card.subtasks.length && !isCollapsed"
      v-model="subtasks"
      tag="ul"
      handle=".table-subtask-handle"
      :group="{ name: `subtasks-${card.id}`, pull: false, put: false }"
      :animation="150"
      :force-fallback="true"
      :fallback-on-body="true"
    >
      <TableSubtaskRow
        v-for="subtask in card.subtasks"
        :key="subtask.id"
        :subtask="subtask"
        @toggle="updateSubtask(card.id, subtask.id, { isDone: !subtask.isDone })"
        @open="emit('open')"
      />
    </VueDraggable>
  </div>
</template>
