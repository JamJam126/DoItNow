<script setup lang="ts">
const columns = [
  ['h-16', 'h-20', 'h-12'],
  ['h-20', 'h-12'],
  ['h-12'],
]
</script>

<template>
  <div
    aria-busy="true"
    aria-label="Loading board"
    class="flex min-h-0 flex-1 items-start gap-4 overflow-hidden p-4 sm:p-6"
  >
    <div
      v-for="(cards, columnIndex) in columns"
      :key="columnIndex"
      class="flex w-72 max-w-[85vw] shrink-0 flex-col rounded-md border"
    >
      <div class="flex h-11 items-center gap-2 border-b px-3">
        <div class="h-3 w-24 animate-pulse rounded bg-hover" />
        <div class="ml-auto h-3 w-4 animate-pulse rounded bg-hover" />
      </div>

      <div class="flex flex-col gap-2 p-2">
        <div
          v-for="(height, cardIndex) in cards"
          :key="cardIndex"
          class="animate-pulse rounded-md border bg-hover/60"
          :class="height"
        />
      </div>
    </div>
  </div>
</template>
