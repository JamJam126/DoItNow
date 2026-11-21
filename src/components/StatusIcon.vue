<script setup lang="ts">
import type { CardStatus } from '~/utils/cardStatus'

defineProps<{ status: CardStatus }>()
</script>

<template>
  <svg viewBox="0 0 24 24" class="size-3.5 shrink-0" fill="none" stroke="currentColor" stroke-width="2"
       stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="9" :stroke-dasharray="status === 'todo' ? '3 3' : undefined" />
    <path v-if="status === 'in-progress'" d="M12 7a5 5 0 0 1 0 10z" fill="currentColor" stroke="none" />
    <path v-if="status === 'done'" d="m8.5 12 2.5 2.5 4.5-5" />
  </svg>
</template>
