<script setup lang="ts">
import type { Card, Column } from '#shared/types/board'
import type { TableField } from '~/composables/useTableFields'
import type { CardStatus } from '~/utils/cardStatus'

type SortKey = 'title' | TableField

interface Row {
  card:    Card
  column:  Column
  order:   number
}

const emit = defineEmits<{ openCard: [card: Card] }>()

const { board } = useBoard()
const { visibleFields } = useTableFields()

const statusRank: Record<CardStatus, number> = { 'todo': 0, 'in-progress': 1, 'done': 2 }
const priorityRank = { urgent: 0, high: 1, medium: 2, low: 3 }

const sortValues: Record<SortKey, (row: Row) => string | number | null> = {
  title:        ({ card }) => card.title.toLowerCase(),
  status:       ({ column }) => statusRank[statusOf(column)],
  priority:     ({ card }) => (card.priority ? priorityRank[card.priority] : null),
  due:          ({ card }) => card.dueDate,
  created:      ({ card }) => card.createdAt,
  description:  ({ card }) => card.description.toLowerCase() || null,
}

const headers = computed(() => [
  { key: 'title' as SortKey, label: 'Title' },
  ...tableFields.filter((field) => visibleFields.value.includes(field.key)),
])

const rows = computed<Row[]>(() =>
  board.value.columns
    .flatMap((column) => column.cards.map((card) => ({ card, column })))
    .map((row, order) => ({ ...row, order })),
)

const sort = ref<{ key: SortKey, descending: boolean } | null>(null)

const sortedRows = computed(() => {
  const current = sort.value
  if (!current) return rows.value

  const valueOf = sortValues[current.key]
  const direction = current.descending ? -1 : 1

  return [...rows.value].sort((a, b) => {
    const left = valueOf(a)
    const right = valueOf(b)

    if (left === right) return a.order - b.order
    if (left === null) return 1
    if (right === null) return -1
    return (left < right ? -1 : 1) * direction
  })
})

const mobileSort = computed({
  get: () => sort.value?.key ?? '',
  set: (key: SortKey | '') => (sort.value = key ? { key, descending: false } : null),
})

function toggleSort(key: SortKey) {
  if (sort.value?.key !== key) sort.value = { key, descending: false }
  else if (!sort.value.descending) sort.value = { key, descending: true }
  else sort.value = null
}

function ariaSort(key: SortKey) {
  if (sort.value?.key !== key) return undefined
  return sort.value.descending ? 'descending' : 'ascending'
}
</script>

<template>
  <div class="mx-auto flex w-full max-w-5xl flex-col">
    <div class="flex items-center justify-between gap-3 pb-2">
      <span class="pl-1 font-mono text-xs text-text-sub/60">{{ rows.length }} cards</span>

      <div class="flex items-center gap-1">
        <select
          v-model="mobileSort"
          aria-label="Sort by"
          class="h-7 cursor-pointer rounded-md border bg-primary px-2 font-mono text-xs text-text-sub outline-none
                 focus:border-text-sub/50 sm:hidden"
        >
          <option value="">board order</option>
          <option v-for="header in headers" :key="header.key" :value="header.key">
            {{ header.label.toLowerCase() }}
          </option>
        </select>

        <TableFieldsMenu />
      </div>
    </div>

    <p v-if="!rows.length" class="border-t py-12 text-center font-mono text-xs text-text-sub/60">
      no cards yet
    </p>

    <template v-else>
      <table class="hidden w-full sm:table">
        <thead>
          <tr class="border-b">
            <th
              v-for="header in headers"
              :key="header.key"
              :aria-sort="ariaSort(header.key)"
              class="h-9 px-5 text-left font-normal whitespace-nowrap first:pr-3 first:pl-1"
            >
              <button
                type="button"
                class="inline-flex cursor-pointer items-center gap-1 text-xs font-medium tracking-wide
                       text-text-sub/70 uppercase transition-colors hover:text-text"
                @click="toggleSort(header.key)"
              >
                {{ header.label }}
                <span v-if="sort?.key === header.key" class="text-text">{{ sort.descending ? '↓' : '↑' }}</span>
              </button>
            </th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="row in sortedRows"
            :key="row.card.id"
            tabindex="0"
            class="cursor-pointer border-b transition-colors hover:bg-hover/60 focus-visible:bg-hover
                   focus-visible:outline-none"
            :class="{ 'opacity-50 hover:opacity-100': row.column.isDone }"
            @click="emit('openCard', row.card)"
            @keydown.enter="emit('openCard', row.card)"
          >
            <td class="w-full max-w-0 py-2.5 pr-3 pl-1 text-sm">
              <div class="truncate">{{ row.card.title }}</div>
            </td>
            <td
              v-for="field in visibleFields"
              :key="field"
              class="px-5 py-2.5 font-mono text-xs whitespace-nowrap last:pr-1"
            >
              <CardTableCell :field="field" :card="row.card" :column="row.column" />
            </td>
          </tr>
        </tbody>
      </table>

      <ul class="flex flex-col border-t sm:hidden">
        <li v-for="row in sortedRows" :key="row.card.id">
          <button
            type="button"
            class="flex w-full cursor-pointer flex-col gap-1.5 border-b px-1 py-3 text-left transition-colors
                   hover:bg-hover/60"
            :class="{ 'opacity-50': row.column.isDone }"
            @click="emit('openCard', row.card)"
          >
            <span class="text-sm">{{ row.card.title }}</span>
            <span
              v-if="visibleFields.length"
              class="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] empty:hidden"
            >
              <CardTableCell
                v-for="field in visibleFields"
                :key="field"
                :field="field"
                :card="row.card"
                :column="row.column"
                inline
              />
            </span>
          </button>
        </li>
      </ul>
    </template>

    <TableAddCard />
  </div>
</template>
