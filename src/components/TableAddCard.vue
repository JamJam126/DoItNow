<script setup lang="ts">
import type { Priority } from '#shared/types/board'

const { columnId } = defineProps<{ columnId: string }>()
const emit = defineEmits<{ close: [] }>()

const { addCard } = useBoard()

const title = ref('')
const priority = ref<Priority | null>(null)
const dueDate = ref<string | null>(null)
const input = useTemplateRef('input')

function focusTitle() {
  nextTick(() => input.value?.focus())
}

onMounted(focusTitle)

function add() {
  const singleLine = title.value.replace(/\s+/g, ' ').trim()
  if (!singleLine) return

  addCard(columnId, singleLine, { priority: priority.value, dueDate: dueDate.value })
  title.value = ''
  priority.value = null
  dueDate.value = null
}
</script>

<template>
  <div class="flex flex-col gap-1.5 border-t p-2 transition starting:opacity-0" @keydown.esc="emit('close')">
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

    <span class="px-1 font-mono text-[11px] text-text-sub/50">enter to add · esc to close</span>
  </div>
</template>
