<script setup lang="ts">
import type { Card, Column } from '#shared/types/board'
import type { CardStatus } from '~/utils/cardStatus'
import type { SortKey, TableSort } from '~/utils/cardSort'
import type { TableFilter } from '~/utils/cardFilter'
import { VueDraggable } from 'vue-draggable-plus'

interface Row {
  card:    Card
  column:  Column
}

const { status, columns, gridColumns, sort, filter, collapsed } = defineProps<{
  status:       CardStatus
  columns:      Column[]
  gridColumns:  string
  sort:         TableSort | null
  filter:       TableFilter
  collapsed:    boolean
}>()

const emit = defineEmits<{
  openCard:      [card: Card]
  sortBy:        [key: SortKey]
  setCollapsed:  [collapsed: boolean]
}>()

const { placeCard, placeCardNextTo } = useBoard()
const { visibleFieldOptions } = useTableFields()

const isAdding = ref(false)

function toggleAdding() {
  if (collapsed) emit('setCollapsed', false)
  isAdding.value = collapsed || !isAdding.value
}

const headers = computed(() => [
  { key: 'title' as SortKey, label: 'Title' },
  ...visibleFieldOptions.value,
])

const rows = computed<Row[]>(() =>
  columns.flatMap((column) =>
    column.cards
      .filter((card) => matchesFilter(card, column, filter))
      .map((card) => ({ card, column })),
  ),
)

const shownRows = computed({
  get: () => (sort ? sortRows(rows.value, sort) : rows.value),
  set: placeMovedCard,
})

function placeMovedCard(newRows: Row[]) {
  const newIds = newRows.map((row) => row.card.id)
  const movedIndex = findMovedIndex(rows.value.map((row) => row.card.id), newIds)
  const movedId = newIds[movedIndex]
  if (!movedId) return

  const previous = newRows[movedIndex - 1]
  const next = newRows[movedIndex + 1]

  if (previous) placeCardNextTo(movedId, previous.card.id, 'after')
  else if (next) placeCardNextTo(movedId, next.card.id, 'before')
  else if (columns[0]) placeCard(movedId, columns[0].id, 0)
}
</script>

<template>
  <section class="flex flex-col gap-2">
    <header class="flex h-11 items-center gap-2 rounded-lg border pr-1.5 pl-1.5">
      <button
        type="button"
        :aria-expanded="!collapsed"
        :aria-label="`${collapsed ? 'Expand' : 'Collapse'} ${statusLabel[status]}`"
        class="flex h-8 min-w-0 flex-1 cursor-pointer items-center gap-2.5 rounded-md px-1.5 text-left
               transition-colors hover:bg-hover"
        @click="emit('setCollapsed', !collapsed)"
      >
        <svg viewBox="0 0 24 24" class="size-3.5 shrink-0 text-text-sub transition-transform"
             :class="{ '-rotate-90': collapsed }" fill="none" stroke="currentColor" stroke-width="2"
             stroke-linecap="round" stroke-linejoin="round">
          <path d="m6 9 6 6 6-6" />
        </svg>
        <StatusIcon :status="status" :class="status === 'todo' ? 'text-text-sub' : statusStyle[status]" />
        <h2 class="truncate text-sm font-medium">{{ statusLabel[status] }}</h2>
        <span class="rounded border px-1.5 font-mono text-[11px] text-text-sub">{{ rows.length }}</span>
      </button>
      <UiButton
        variant="ghost"
        size="sm"
        :aria-label="`Add card to ${statusLabel[status]}`"
        @click="toggleAdding"
      >
        <svg viewBox="0 0 24 24" class="size-4" fill="none" stroke="currentColor" stroke-width="2"
             stroke-linecap="round">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </UiButton>
    </header>

    <div v-if="!collapsed" class="rounded-lg border">
      <div
        class="hidden h-10 items-center gap-8 rounded-t-lg border-b bg-hover/50 px-3 sm:grid"
        :style="{ gridTemplateColumns: gridColumns }"
      >
        <TableHeaderCell
          v-for="header in headers"
          :key="header.key"
          :field="header.key"
          :label="header.label"
          :sort="sort"
          @sort-by="emit('sortBy', $event)"
        />
      </div>

      <VueDraggable
        v-model="shownRows"
        group="table-cards"
        handle=".drag-handle"
        :disabled="!!sort"
        :animation="150"
        :force-fallback="true"
        :fallback-on-body="true"
        :empty-insert-threshold="24"
        class="flex min-h-10 flex-col empty:before:px-3 empty:before:py-2.5 empty:before:font-mono
               empty:before:text-xs empty:before:text-text-sub/50 empty:before:content-['no_cards']"
      >
        <TableRow
          v-for="row in shownRows"
          :key="row.card.id"
          :card="row.card"
          :column="row.column"
          :grid-columns="gridColumns"
          :can-drag="!sort"
          @open="emit('openCard', row.card)"
        />
      </VueDraggable>

      <TableAddCard
        v-if="isAdding && columns[0]"
        :column-id="columns[0].id"
        @close="isAdding = false"
      />
    </div>
  </section>
</template>
