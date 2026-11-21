<script setup lang="ts">
import type { Card, Column } from '#shared/types/board'

const { card, column } = defineProps<{
  card:    Card
  column:  Column
}>()

const emit = defineEmits<{ close: [] }>()

const { updateCard, deleteCard } = useBoard()

const title = computed({
  get: () => card.title,
  set: (title) => updateCard(card.id, { title }),
})

const description = computed({
  get: () => card.description,
  set: (description) => updateCard(card.id, { description }),
})

const priority = computed({
  get: () => card.priority,
  set: (priority) => updateCard(card.id, { priority }),
})

const status = computed(() => statusOf(column))

const dueDate = computed({
  get: () => card.dueDate,
  set: (dueDate) => updateCard(card.id, { dueDate }),
})

function remove() {
  if (!confirm(`Delete "${card.title}"?`)) return

  deleteCard(card.id)
  emit('close')
}

const { offset, isSwiping, onTouchStart, onTouchMove, onTouchEnd } = useSwipeToClose(() => emit('close'))

const panelStyle = computed(() => ({
  translate:   offset.value ? `${offset.value}px 0` : undefined,
  transition:  isSwiping.value ? 'none' : undefined,
}))

const backdropStyle = computed(() => ({
  opacity:     offset.value ? 1 - Math.min(offset.value / window.innerWidth, 1) : undefined,
  transition:  isSwiping.value ? 'none' : undefined,
}))

function closeOnEscape(event: KeyboardEvent) {
  if (event.key === 'Escape') emit('close')
}

onMounted(() => window.addEventListener('keydown', closeOnEscape))
onBeforeUnmount(() => window.removeEventListener('keydown', closeOnEscape))
</script>

<template>
  <div class="fixed inset-0 z-50">
    <div
      class="absolute inset-0 bg-backdrop transition-opacity duration-200 starting:opacity-0"
      :style="backdropStyle"
      @click="emit('close')"
    />

    <aside
      class="absolute inset-y-0 right-0 flex w-full max-w-md flex-col border-l bg-primary
             transition-transform duration-200 starting:translate-x-full"
      :style="panelStyle"
      @touchstart="onTouchStart"
      @touchmove="onTouchMove"
      @touchend="onTouchEnd"
      @touchcancel="onTouchEnd"
    >
      <header class="flex h-14 shrink-0 items-center justify-between gap-3 border-b px-6">
        <div class="flex min-w-0 items-center gap-0.5 font-mono text-xs text-text-sub">
          in
          <CardColumnPicker :card-id="card.id" :column="column" />
        </div>

        <span class="flex shrink-0 items-center gap-1.5 font-mono text-xs" :class="statusStyle[status]">
          <StatusIcon :status="status" />
          {{ statusLabel[status].toLowerCase() }}
        </span>
      </header>

      <div class="flex flex-1 flex-col gap-6 overflow-y-auto p-6">
        <CardTitle v-model="title" />

        <section class="flex flex-col gap-3">
          <div class="flex items-center gap-3">
            <h3 class="w-16 shrink-0 text-xs font-medium tracking-wide text-text-sub/70 uppercase">Priority</h3>
            <CardPriority v-model="priority" />
          </div>

          <div class="flex items-center gap-3">
            <h3 class="w-16 shrink-0 text-xs font-medium tracking-wide text-text-sub/70 uppercase">Due</h3>
            <CardDueDate v-model="dueDate" :done="column.isDone" />
          </div>
        </section>

        <CardDescription v-model="description" />
      </div>

      <footer class="flex h-14 shrink-0 items-center justify-between border-t pr-3 pl-6">
        <span class="font-mono text-xs text-text-sub/60">
          created {{ formatDate(card.createdAt) }}
        </span>
        <UiButton variant="danger" size="sm" @click="remove">Delete card</UiButton>
      </footer>
    </aside>
  </div>
</template>
