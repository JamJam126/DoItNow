<script setup lang="ts">
import { priorities, type Priority } from '#shared/types/board'

const priority = defineModel<Priority | null>({ required: true })

function choose(option: Priority) {
  priority.value = priority.value === option ? null : option
}
</script>

<template>
  <div role="radiogroup" aria-label="Priority" class="flex flex-wrap gap-1">
    <button
      v-for="option in priorities"
      :key="option"
      type="button"
      role="radio"
      :aria-checked="priority === option"
      class="h-7 cursor-pointer rounded-md border px-2.5 text-xs capitalize transition-colors"
      :class="priority === option
        ? [priorityStyle[option], 'bg-hover']
        : 'border-transparent text-text-sub/50 hover:bg-hover hover:text-text'"
      @click="choose(option)"
    >
      {{ option }}
    </button>
  </div>
</template>
