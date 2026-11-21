<script setup lang="ts">
import { priorities } from '#shared/types/board'
import type { DueFilter, PriorityFilter, TableFilter } from '~/utils/cardFilter'

const filter = defineModel<TableFilter>({ required: true })

const isOpen = ref(false)

const activeCount = computed(() => activeFilterCount(filter.value))
const priorityOptions: PriorityFilter[] = [...[...priorities].reverse(), 'none']
const dueOptions = Object.keys(dueFilterLabels) as DueFilter[]

function togglePriority(option: PriorityFilter) {
  const chosen = filter.value.priorities
  const next = chosen.includes(option) ? chosen.filter((item) => item !== option) : [...chosen, option]
  filter.value = { ...filter.value, priorities: next }
}

function setDue(due: DueFilter) {
  filter.value = { ...filter.value, due }
}

function clear() {
  filter.value = { ...filter.value, priorities: [], due: 'any' }
}
</script>

<template>
  <div class="relative" @keydown.esc="isOpen = false">
    <UiButton
      variant="ghost"
      size="sm"
      aria-haspopup="dialog"
      :aria-expanded="isOpen"
      :class="{ 'text-text': activeCount }"
      @click="isOpen = !isOpen"
    >
      Filter
      <span v-if="activeCount" class="rounded bg-hover px-1 font-mono text-[11px]">{{ activeCount }}</span>
      <span v-else class="text-text-sub/60">▾</span>
    </UiButton>

    <template v-if="isOpen">
      <div class="fixed inset-0 z-10" @click="isOpen = false" />

      <div
        role="dialog"
        aria-label="Filter cards"
        class="absolute top-full right-0 z-20 mt-1 flex w-60 flex-col gap-3 rounded-md border bg-primary p-3
               shadow-lg shadow-shadow transition starting:-translate-y-1 starting:opacity-0"
      >
        <div class="flex flex-col gap-2">
          <h3 class="text-xs font-medium tracking-wide text-text-sub/70 uppercase">Priority</h3>
          <div class="flex flex-wrap gap-1.5">
            <button
              v-for="option in priorityOptions"
              :key="option"
              type="button"
              :aria-pressed="filter.priorities.includes(option)"
              class="h-7 cursor-pointer rounded-md border px-2 font-mono text-xs capitalize transition-colors"
              :class="filter.priorities.includes(option)
                ? ['bg-hover', option === 'none' ? 'border-text-sub/40 text-text' : priorityStyle[option]]
                : 'border-transparent text-text-sub/60 hover:bg-hover hover:text-text'"
              @click="togglePriority(option)"
            >
              {{ option === 'none' ? 'no priority' : option }}
            </button>
          </div>
        </div>

        <div class="flex flex-col gap-1">
          <h3 class="text-xs font-medium tracking-wide text-text-sub/70 uppercase">Due</h3>
          <button
            v-for="option in dueOptions"
            :key="option"
            type="button"
            role="radio"
            :aria-checked="filter.due === option"
            class="-mx-1 flex cursor-pointer items-center justify-between rounded px-1 py-1 text-left text-sm
                   transition-colors hover:bg-hover"
            :class="filter.due === option ? 'text-text' : 'text-text-sub hover:text-text'"
            @click="setDue(option)"
          >
            {{ dueFilterLabels[option] }}
            <span v-if="filter.due === option" class="text-xs">✓</span>
          </button>
        </div>

        <button
          v-if="activeCount"
          type="button"
          class="cursor-pointer self-start font-mono text-xs text-text-sub underline hover:text-text"
          @click="clear"
        >
          clear filters
        </button>
      </div>
    </template>
  </div>
</template>
