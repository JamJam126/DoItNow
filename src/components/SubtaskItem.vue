<script setup lang="ts">
import type { Subtask } from '#shared/types/board'

const { subtask } = defineProps<{ subtask: Subtask }>()

const emit = defineEmits<{
  toggle:  []
  rename:  [title: string]
  remove:  []
}>()

const draft = ref(subtask.title)
const input = useTemplateRef('input')

watch(() => subtask.title, (latest) => {
  draft.value = latest
})

function save() {
  const singleLine = draft.value.replace(/\s+/g, ' ').trim()

  if (!singleLine) {
    draft.value = subtask.title
    return
  }

  draft.value = singleLine
  emit('rename', singleLine)
}

function cancel() {
  draft.value = subtask.title
  input.value?.blur()
}
</script>

<template>
  <li class="group -mx-3 flex items-center gap-2 rounded-md px-3 py-1 transition-colors hover:bg-hover/60">
    <span
      aria-hidden="true"
      class="subtask-handle -ml-2 flex h-5 w-3 shrink-0 cursor-grab items-center justify-center text-text-sub/50
             transition-opacity hover:text-text group-hover:opacity-100 [@media(hover:hover)]:opacity-0"
    >
      <DragHandleIcon />
    </span>

    <UiCheckbox
      :checked="subtask.isDone"
      :label="subtask.isDone ? `Mark ${subtask.title} as not done` : `Mark ${subtask.title} as done`"
      @click="emit('toggle')"
    />

    <input
      ref="input"
      v-model="draft"
      spellcheck="false"
      aria-label="Subtask"
      class="min-w-0 flex-1 rounded border border-transparent bg-transparent px-1.5 py-0.5 text-sm outline-none
             transition-colors focus:border-text-sub/50"
      :class="{ 'text-text-sub line-through decoration-text-sub/40 focus:no-underline': subtask.isDone }"
      @blur="save"
      @keydown.enter="input?.blur()"
      @keydown.esc.stop="cancel"
    />

    <button
      type="button"
      :aria-label="`Delete ${subtask.title}`"
      class="flex size-6 shrink-0 cursor-pointer items-center justify-center rounded text-text-sub/60
             transition hover:bg-error/10 hover:text-error focus-visible:opacity-100
             group-hover:opacity-100 [@media(hover:hover)]:opacity-0"
      @click="emit('remove')"
    >
      <svg viewBox="0 0 24 24" class="size-3.5" fill="none" stroke="currentColor" stroke-width="2"
           stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 6 6 18M6 6l12 12" />
      </svg>
    </button>
  </li>
</template>
