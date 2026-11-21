<script setup lang="ts">
import type { Card } from '#shared/types/board'
import type { TableField } from '~/composables/useTableFields'
import type { CardStatus } from '~/utils/cardStatus'
import type { SortKey, TableSort } from '~/utils/cardSort'
import type { TableFilter } from '~/utils/cardFilter'

const emit = defineEmits<{ openCard: [card: Card] }>()

const { board } = useBoard()
const { isCollapsed, setCollapsed } = useCollapsedGroups(board.value.id)
const { visibleFields, visibleFieldOptions } = useTableFields()

const statuses: CardStatus[] = ['todo', 'in-progress', 'done']

const fieldWidths: Record<TableField, string> = {
  description:  'minmax(13rem, 1fr)',
  due:          '7rem',
  priority:     '6.5rem',
  created:      '6.5rem',
}

const gridColumns = computed(() => {
  const hasDescription = visibleFields.value.includes('description')
  const title = hasDescription ? 'minmax(0, 22rem)' : 'minmax(0, 1fr)'
  return [title, ...visibleFields.value.map((field) => fieldWidths[field]), '1.75rem'].join(' ')
})

const groups = computed(() =>
  statuses
    .map((status) => ({ status, columns: board.value.columns.filter((column) => statusOf(column) === status) }))
    .filter((group) => group.columns.length),
)

const filter = ref<TableFilter>({ ...emptyFilter })

const sortOptions = computed(() => [
  { key: 'title' as SortKey, label: 'Title' },
  ...visibleFieldOptions.value,
])

const sort = ref<TableSort | null>(null)

const mobileSort = computed({
  get: () => sort.value?.key ?? '',
  set: (key: SortKey | '') => (sort.value = key ? { key, descending: false } : null),
})

function sortBy(key: SortKey) {
  if (sort.value?.key !== key) sort.value = { key, descending: false }
  else if (!sort.value.descending) sort.value = { key, descending: true }
  else sort.value = null
}
</script>

<template>
  <div class="mx-auto flex w-full max-w-5xl flex-col gap-6">
    <div class="-mb-2 flex flex-wrap items-center justify-between gap-2">
      <div class="flex min-w-0 flex-1 basis-full items-center gap-3 sm:basis-auto">
        <label
          class="flex h-8 w-full items-center gap-2 rounded-md border px-2.5 text-text-sub/60 transition-colors
                 focus-within:border-text-sub/50 sm:w-64"
        >
          <svg viewBox="0 0 24 24" class="size-3.5 shrink-0" fill="none" stroke="currentColor" stroke-width="2"
               stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            v-model="filter.search"
            type="search"
            spellcheck="false"
            placeholder="Search cards…"
            aria-label="Search cards"
            class="min-w-0 flex-1 bg-transparent text-sm text-text outline-none placeholder:text-text-sub/40"
          />
        </label>
        <button
          v-if="sort"
          type="button"
          class="hidden shrink-0 cursor-pointer font-mono text-xs text-text-sub/60 underline hover:text-text
                 sm:inline"
          @click="sort = null"
        >
          clear sort to drag
        </button>
      </div>

      <div class="ml-auto flex items-center gap-1">
        <select
          v-model="mobileSort"
          aria-label="Sort by"
          class="h-7 cursor-pointer rounded-md border bg-primary px-2 font-mono text-xs text-text-sub outline-none
                 focus:border-text-sub/50 sm:hidden"
        >
          <option value="">board order</option>
          <option v-for="option in sortOptions" :key="option.key" :value="option.key">
            {{ option.label.toLowerCase() }}
          </option>
        </select>

        <TableFilterMenu v-model="filter" />
        <TableFieldsMenu />
      </div>
    </div>

    <p v-if="!groups.length" class="py-12 text-center font-mono text-xs text-text-sub/60">
      no columns yet · add some in board view
    </p>

    <TableGroup
      v-for="group in groups"
      :key="group.status"
      :status="group.status"
      :columns="group.columns"
      :grid-columns="gridColumns"
      :sort="sort"
      :filter="filter"
      :collapsed="isCollapsed(group.status)"
      @open-card="emit('openCard', $event)"
      @sort-by="sortBy"
      @set-collapsed="setCollapsed(group.status, $event)"
    />
  </div>
</template>
