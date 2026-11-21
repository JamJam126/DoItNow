<script setup lang="ts">
import { priorities, type Priority } from '#shared/types/board'

const { compact = false, label = 'Priority' } = defineProps<{
  compact?:  boolean
  label?:    string
}>()

const priority = defineModel<Priority | null>({ required: true })
const emit = defineEmits<{ picked: [] }>()

const isOpen = ref(false)

function pick(option: Priority | null) {
  priority.value = option
  isOpen.value = false
  emit('picked')
}
</script>

<template>
  <div class="relative" @click.stop @keydown.esc.stop="isOpen = false">
    <button
      v-if="compact"
      type="button"
      aria-haspopup="listbox"
      :aria-expanded="isOpen"
      :aria-label="label"
      class="-mx-1.5 flex h-7 max-w-full cursor-pointer items-center gap-1.5 rounded px-1.5 font-mono text-xs
             capitalize transition-colors hover:bg-hover"
      :class="priority ? priorityTextStyle[priority] : 'text-text-sub/30 hover:text-text-sub'"
      @click="isOpen = !isOpen"
    >
      <svg v-if="priority" viewBox="0 0 24 24" class="size-3.5 shrink-0" fill="none" stroke="currentColor"
           stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M5 21V4" />
        <path d="M5 4h12l-2.5 4L17 12H5z" fill="currentColor" />
      </svg>
      {{ priority ?? '—' }}
    </button>

    <button
      v-else
      type="button"
      aria-haspopup="listbox"
      :aria-expanded="isOpen"
      :aria-label="label"
      class="flex h-9 cursor-pointer items-center gap-1.5 rounded-md border px-2.5 font-mono text-xs
             transition-colors hover:bg-hover"
      :class="priority ? 'text-text' : 'text-text-sub/60 hover:text-text'"
      @click="isOpen = !isOpen"
    >
      <span v-if="priority" class="rounded border px-1.5 capitalize" :class="priorityStyle[priority]">
        {{ priority }}
      </span>
      <span v-else>priority</span>
      <span class="text-text-sub/60">▾</span>
    </button>

    <template v-if="isOpen">
      <div class="fixed inset-0 z-10" @click="isOpen = false" />

      <ul
        role="listbox"
        class="absolute top-full right-0 z-20 mt-1 flex w-40 flex-col rounded-md border bg-primary p-1
               shadow-lg shadow-shadow transition starting:-translate-y-1 starting:opacity-0"
      >
        <li>
          <button
            type="button"
            role="option"
            :aria-selected="priority === null"
            class="flex w-full cursor-pointer items-center justify-between rounded px-2 py-1.5 text-left text-sm
                   text-text-sub transition-colors hover:bg-hover hover:text-text"
            @click="pick(null)"
          >
            No priority
            <span v-if="priority === null" class="text-xs">✓</span>
          </button>
        </li>

        <li v-for="option in priorities" :key="option">
          <button
            type="button"
            role="option"
            :aria-selected="priority === option"
            class="flex w-full cursor-pointer items-center justify-between rounded px-2 py-1.5 text-left
                   transition-colors hover:bg-hover"
            @click="pick(option)"
          >
            <span class="rounded border px-1.5 font-mono text-xs capitalize" :class="priorityStyle[option]">
              {{ option }}
            </span>
            <span v-if="priority === option" class="text-xs">✓</span>
          </button>
        </li>
      </ul>
    </template>
  </div>
</template>
