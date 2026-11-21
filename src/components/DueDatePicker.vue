<script setup lang="ts">
const dueDate = defineModel<string | null>({ required: true })
const emit = defineEmits<{ picked: [] }>()

const input = useTemplateRef('input')

function openPicker() {
  const element = input.value
  if (!element) return

  try {
    element.showPicker()
  } catch {
    element.focus()
  }
}

function onChange(event: Event) {
  dueDate.value = (event.target as HTMLInputElement).value || null
  emit('picked')
}

function clear() {
  dueDate.value = null
  emit('picked')
}
</script>

<template>
  <div
    class="relative flex h-9 items-center rounded-md border font-mono text-xs transition-colors hover:bg-hover"
    :class="dueDate ? dueStyle[dueStateOf(dueDate, false)] : 'text-text-sub/60 hover:text-text'"
  >
    <button
      type="button"
      aria-label="Due date"
      class="flex h-full cursor-pointer items-center gap-1.5 pl-2.5"
      :class="dueDate ? 'pr-1' : 'pr-2.5'"
      @click="openPicker"
    >
      <svg viewBox="0 0 24 24" class="size-3.5" fill="none" stroke="currentColor" stroke-width="2"
           stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M16 3v4M8 3v4M3 10h18" />
      </svg>
      {{ dueDate ? formatDueDate(dueDate) : 'due date' }}
    </button>

    <button
      v-if="dueDate"
      type="button"
      aria-label="Clear due date"
      class="flex h-full cursor-pointer items-center pr-2.5 pl-1 text-text-sub/60 hover:text-text"
      @click="clear"
    >
      ×
    </button>

    <input
      ref="input"
      type="date"
      max="9999-12-31"
      tabindex="-1"
      aria-hidden="true"
      :value="dueDate ?? ''"
      class="pointer-events-none absolute bottom-0 left-0 h-0 w-full opacity-0"
      @change="onChange"
    />
  </div>
</template>
