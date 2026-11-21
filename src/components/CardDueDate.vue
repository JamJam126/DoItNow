<script setup lang="ts">
const dueDate = defineModel<string | null>({ required: true })

const { done } = defineProps<{ done: boolean }>()

const style = computed(() => (dueDate.value ? dueStyle[dueStateOf(dueDate.value, done)] : 'text-text-sub/50'))

function onChange(event: Event) {
  dueDate.value = (event.target as HTMLInputElement).value || null
}
</script>

<template>
  <div class="flex min-w-0 items-center gap-2">
    <input
      type="date"
      max="9999-12-31"
      aria-label="Due date"
      :value="dueDate ?? ''"
      class="h-7 shrink-0 cursor-pointer rounded-md border bg-transparent px-2 font-mono text-xs outline-none
             transition-colors hover:bg-hover focus:border-text-sub/50"
      :class="style"
      @change="onChange"
    />

    <span v-if="dueDate && !done" class="truncate font-mono text-xs" :class="style">
      {{ describeDueDate(dueDate) }}
    </span>

    <UiButton v-if="dueDate" variant="ghost" size="sm" aria-label="Clear due date" @click="dueDate = null">
      ×
    </UiButton>
  </div>
</template>
