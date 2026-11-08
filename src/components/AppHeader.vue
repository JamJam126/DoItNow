<script setup lang="ts">
defineProps<{
  boardName:  string
  cardCount:  number
}>()
</script>

<template>
  <header class="flex h-14 shrink-0 items-center justify-between border-b px-4 sm:px-6">
    <div class="flex items-center gap-2.5">
      <span
        class="grid size-6 place-items-center rounded border
               font-mono text-[11px] text-text-sub"
      >
        ✓
      </span>
      <span class="text-sm font-semibold">DoItNow</span>
      <span class="text-text-sub/40">/</span>
      <span class="text-sm text-text-sub">{{ boardName }}</span>
    </div>

    <span class="font-mono text-xs text-text-sub/60">{{ cardCount }} cards</span>
  </header>
</template>
