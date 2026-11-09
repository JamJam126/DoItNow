<script setup lang="ts">
import type { Card } from '#shared/types/board'
import { VueDraggable } from 'vue-draggable-plus'

definePageMeta({ key: (route) => route.fullPath })

const route = useRoute()
const boardId = route.params.id as string

const { board, status, hasSaveError, load, renameBoard, doneColumn, findCard, setColumns } = useBoard()

load(boardId)

const name = computed({
  get: () => board.value.name,
  set: renameBoard,
})

const columns = computed({
  get: () => board.value.columns,
  set: setColumns,
})

const cardCount = computed(() => board.value.columns.flatMap((column) => column.cards).length)
const doneCount = computed(() => doneColumn.value?.cards.length)

const summary = computed(() =>
  doneCount.value === undefined
    ? `${cardCount.value} cards`
    : `${doneCount.value}/${cardCount.value} done`,
)

const statusMessage = computed(() => {
  if (status.value === 'loading') return 'loading board…'
  if (status.value === 'not-found') return 'this board does not exist'
  return 'could not load the board'
})

const selectedCardId = ref<string | null>(null)
const selected = computed(() => (selectedCardId.value ? findCard(selectedCardId.value) : undefined))

useHead({
  title: () => (board.value.name ? `${board.value.name} · DoItNow` : 'DoItNow'),
})

function openCard(card: Card) {
  selectedCardId.value = card.id
}

function closeCard() {
  selectedCardId.value = null
}
</script>

<template>
  <div class="flex h-dvh flex-col">
    <AppHeader>
      <template v-if="status === 'ready'" #title>
        <div class="flex min-w-0 items-center gap-0.5">
          <InlineTitle
            v-model="name"
            label="Board name"
            class="text-text-sub hover:text-text focus:text-text"
          />
          <BoardSwitcher :current-board-id="board.id" />
        </div>
      </template>

      <span v-if="hasSaveError" class="font-mono text-xs text-error">
        changes not saved · reload
      </span>
      <span v-else-if="status === 'ready'" class="font-mono text-xs text-text-sub/60">
        {{ summary }}
      </span>
    </AppHeader>

    <div
      v-if="status !== 'ready'"
      class="flex flex-1 flex-col items-center justify-center gap-3 font-mono text-xs text-text-sub/60"
    >
      <p>{{ statusMessage }}</p>
      <NuxtLink v-if="status !== 'loading'" to="/" class="text-text-sub underline hover:text-text">
        back to boards
      </NuxtLink>
    </div>

    <main
      v-else
      class="flex min-h-0 flex-1 snap-x scroll-px-4 items-start gap-4 overflow-x-auto p-4
             sm:scroll-px-6 sm:p-6"
    >
      <VueDraggable
        v-model="columns"
        handle="header"
        filter="input, button, [data-no-drag]"
        :prevent-on-filter="false"
        :animation="150"
        :delay="150"
        :delay-on-touch-only="true"
        :force-fallback="true"
        :fallback-on-body="true"
        class="flex items-start gap-4 self-stretch"
      >
        <BoardColumn
          v-for="column in board.columns"
          :key="column.id"
          :column="column"
          @open-card="openCard"
        />
      </VueDraggable>

      <AddColumnForm />
    </main>

    <CardPanel
      v-if="selected"
      :key="selected.card.id"
      :card="selected.card"
      :column="selected.column"
      @close="closeCard"
    />
  </div>
</template>
