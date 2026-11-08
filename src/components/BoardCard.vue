<script setup lang="ts">
import type { Card } from '#shared/types/board'

defineProps<{ card: Card }>()
defineEmits<{ open: [] }>()
</script>

<template>
  <button
    type="button"
    class="flex w-full flex-col gap-1 rounded-md border bg-hover/60 p-3 text-left
           transition-colors hover:border-text-sub/30"
    @click="$emit('open')"
  >
    <span class="text-sm">{{ card.title }}</span>
    <span v-if="card.description" class="line-clamp-2 text-xs leading-relaxed text-text-sub">
      {{ card.description }}
    </span>
  </button>
</template>
