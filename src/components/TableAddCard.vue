<script setup lang="ts">
import type { Priority } from '#shared/types/board'

const { board, addCard } = useBoard()

const isOpen = ref(false)
const title = ref('')
const priority = ref<Priority | null>(null)
const dueDate = ref<string | null>(null)
const input = useTemplateRef('input')

const targetColumn = computed(() =>
  board.value.columns.find((column) => statusOf(column) === 'todo') ?? board.value.columns[0],
)

function focusTitle() {
  nextTick(() => input.value?.focus())
}

function open() {
  isOpen.value = true
  focusTitle()
}

function add() {
  const singleLine = title.value.replace(/\s+/g, ' ').trim()
  const column = targetColumn.value
  if (!singleLine || !column) return

  addCard(column.id, singleLine, { priority: priority.value, dueDate: dueDate.value })
  title.value = ''
  priority.value = null
  dueDate.value = null
}

function close() {
  title.value = ''
  priority.value = null
  dueDate.value = null
  isOpen.value = false
}
</script>

<template>
  <div v-if="targetColumn" class="pt-2">
    <div v-if="isOpen" class="flex flex-col gap-1.5 transition starting:opacity-0" @keydown.esc="close">
      <div class="flex flex-wrap gap-2">
        <input
          ref="input"
          v-model="title"
          spellcheck="false"
          placeholder="Card title"
          aria-label="Card title"
          class="h-9 min-w-0 flex-1 basis-full rounded-md border bg-hover/60 px-3 text-sm outline-none
                 transition-colors placeholder:text-text-sub/40 focus:border-text-sub/50 sm:basis-0"
          @keydown.enter.prevent="add"
        />
        <PriorityPicker v-model="priority" @picked="focusTitle" />
        <DueDatePicker v-model="dueDate" @picked="focusTitle" />
      </div>

      <span class="px-1 font-mono text-[11px] text-text-sub/50">
        → {{ targetColumn.title.toLowerCase() }} · enter to add · esc to close
      </span>
    </div>

    <UiButton v-else variant="ghost" class="w-full justify-start px-1!" @click="open">+ Add card</UiButton>
  </div>
</template>
