<script setup lang="ts">
import type { SortKey, TableSort } from '~/utils/cardSort'

const { field, label, sort } = defineProps<{
  field:  SortKey
  label:  string
  sort:   TableSort | null
}>()

defineEmits<{ sortBy: [key: SortKey] }>()

const icons: Record<SortKey, string> = {
  title:        'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01',
  description:  'M4 6h16M4 12h16M4 18h10',
  due:          'M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM16 3v4M8 3v4M3 10h18',
  priority:     'M5 21V4M5 4h12l-2.5 4L17 12H5',
  created:      'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0zM12 7v5l3 2',
}

const isActive = computed(() => sort?.key === field)
</script>

<template>
  <button
    type="button"
    class="flex min-w-0 cursor-pointer items-center gap-1.5 text-left text-xs transition-colors hover:text-text"
    :class="isActive ? 'text-text' : 'text-text-sub'"
    :aria-sort="isActive ? (sort?.descending ? 'descending' : 'ascending') : undefined"
    @click="$emit('sortBy', field)"
  >
    <svg viewBox="0 0 24 24" class="size-3.5 shrink-0" fill="none" stroke="currentColor" stroke-width="2"
         stroke-linecap="round" stroke-linejoin="round">
      <path :d="icons[field]" />
    </svg>
    <span class="truncate">{{ label }}</span>
    <span v-if="isActive">{{ sort?.descending ? '↓' : '↑' }}</span>
  </button>
</template>
