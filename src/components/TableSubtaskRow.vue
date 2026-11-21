<script setup lang="ts">
import type { Subtask } from '#shared/types/board'

const { subtask } = defineProps<{ subtask: Subtask }>()

defineEmits<{
  toggle:  []
  open:    []
}>()
</script>

<template>
  <li
    class="group/subtask flex cursor-pointer items-center gap-2 border-t px-3 py-2 transition-colors hover:bg-hover/50"
    @click="$emit('open')"
  >
    <span aria-hidden="true" class="relative -my-2 -mr-1 -ml-1 w-5 shrink-0 self-stretch">
      <span class="absolute -top-[11px] left-[7px] hidden h-2.5 w-px bg-connector group-first/subtask:block" />
      <span
        class="absolute -top-px bottom-0 left-[7px] w-px bg-connector group-last/subtask:bottom-[calc(50%+6px)]"
      />
      <svg viewBox="0 0 14 12" class="absolute top-[calc(50%-6px)] left-[7px] h-3 w-3.5 overflow-visible
                                    text-connector"
           fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
        <path d="M0.5 0Q0.5 6 6.5 6H13M10 3l3 3-3 3" />
      </svg>
    </span>

    <span
      aria-hidden="true"
      class="table-subtask-handle flex h-5 w-4 shrink-0 cursor-grab items-center justify-center text-text-sub/50
             transition-opacity hover:text-text group-hover/subtask:opacity-100 [@media(hover:hover)]:opacity-0"
      @click.stop
    >
      <DragHandleIcon />
    </span>

    <UiCheckbox
      :checked="subtask.isDone"
      :label="subtask.isDone ? `Mark ${subtask.title} as not done` : `Mark ${subtask.title} as done`"
      @click.stop="$emit('toggle')"
    />

    <span
      class="ml-0.5 min-w-0 truncate text-sm"
      :class="subtask.isDone ? 'text-text-sub line-through decoration-text-sub/40' : 'text-text-sub'"
    >
      {{ subtask.title }}
    </span>
  </li>
</template>
