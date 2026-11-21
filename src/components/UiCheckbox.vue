<script setup lang="ts">
const { checked, label } = defineProps<{
  checked:  boolean
  label:    string
}>()
</script>

<template>
  <button
    type="button"
    role="checkbox"
    :aria-checked="checked"
    :aria-label="label"
    class="flex size-4 shrink-0 cursor-pointer items-center justify-center rounded border transition-colors"
    :class="checked ? 'border-success bg-success text-primary' : 'border-text-sub/40 hover:border-text'"
  >
    <svg v-if="checked" viewBox="0 0 24 24" class="size-3" fill="none" stroke="currentColor"
         stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  </button>
</template>
