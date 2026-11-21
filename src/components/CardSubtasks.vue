<script setup lang="ts">
import type { Card } from '#shared/types/board'
import { VueDraggable } from 'vue-draggable-plus'

const { card } = defineProps<{ card: Card }>()

const { addSubtask, updateSubtask, deleteSubtask, setSubtasks } = useBoard()

const subtasks = computed({
  get: () => card.subtasks,
  set: (subtasks) => setSubtasks(card.id, subtasks),
})

const doneCount = computed(() => card.subtasks.filter((subtask) => subtask.isDone).length)
const progress = computed(() => (card.subtasks.length ? doneCount.value / card.subtasks.length : 0))

const newTitle = ref('')
const input = useTemplateRef('input')

function add() {
  const singleLine = newTitle.value.replace(/\s+/g, ' ').trim()
  if (singleLine) addSubtask(card.id, singleLine)
  newTitle.value = ''
}

function cancel() {
  newTitle.value = ''
  input.value?.blur()
}
</script>

<template>
  <section class="flex flex-col gap-2">
    <div class="flex items-center gap-3">
      <h3 class="text-xs font-medium tracking-wide text-text-sub/70 uppercase">Subtasks</h3>

      <template v-if="card.subtasks.length">
        <div class="h-1 flex-1 overflow-hidden rounded-full bg-hover">
          <div
            class="h-full rounded-full transition-[width] duration-300"
            :class="progress === 1 ? 'bg-success' : 'bg-accent'"
            :style="{ width: `${progress * 100}%` }"
          />
        </div>
        <span class="font-mono text-xs text-text-sub">{{ doneCount }}/{{ card.subtasks.length }}</span>
      </template>
    </div>

    <VueDraggable
      v-model="subtasks"
      tag="ul"
      handle=".subtask-handle"
      :animation="150"
      :force-fallback="true"
      :fallback-on-body="true"
      class="flex flex-col"
    >
      <SubtaskItem
        v-for="subtask in card.subtasks"
        :key="subtask.id"
        :subtask="subtask"
        @toggle="updateSubtask(card.id, subtask.id, { isDone: !subtask.isDone })"
        @rename="updateSubtask(card.id, subtask.id, { title: $event })"
        @remove="deleteSubtask(card.id, subtask.id)"
      />
    </VueDraggable>

    <div class="-mx-3 flex items-center gap-2 px-3">
      <svg viewBox="0 0 24 24" class="ml-3 size-4 shrink-0 text-text-sub/50" fill="none" stroke="currentColor"
           stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 5v14M5 12h14" />
      </svg>
      <input
        ref="input"
        v-model="newTitle"
        spellcheck="false"
        placeholder="Add a subtask…"
        aria-label="New subtask"
        class="min-w-0 flex-1 rounded border border-transparent bg-transparent px-1.5 py-1 text-sm outline-none
               transition-colors placeholder:text-text-sub/50 focus:border-text-sub/50"
        @keydown.enter.prevent="add"
        @keydown.esc.stop="cancel"
      />
    </div>
  </section>
</template>
