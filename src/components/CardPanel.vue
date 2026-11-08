<script setup lang="ts">
import type { Card } from '#shared/types/board'

const { card } = defineProps<{
  card:         Card
  columnTitle:  string
}>()

const emit = defineEmits<{ close: [] }>()

const title = ref(card.title)
const description = ref(card.description)

function closeOnEscape(event: KeyboardEvent) {
  if (event.key === 'Escape') emit('close')
}

onMounted(() => window.addEventListener('keydown', closeOnEscape))
onBeforeUnmount(() => window.removeEventListener('keydown', closeOnEscape))
</script>

<template>
  <div class="fixed inset-0 z-50">
    <div
      class="absolute inset-0 bg-black/60 transition-opacity starting:opacity-0"
      @click="emit('close')"
    />

    <aside
      class="absolute inset-y-0 right-0 flex w-full max-w-md flex-col border-l bg-primary
             transition-transform duration-200 starting:translate-x-full"
    >
      <header class="flex h-14 shrink-0 items-center justify-between border-b pr-3 pl-6">
        <span class="font-mono text-xs text-text-sub">
          in <span class="text-text">{{ columnTitle.toLowerCase() }}</span>
        </span>
      </header>

      <div class="flex flex-1 flex-col gap-6 overflow-y-auto p-6">
        <input
          v-model="title"
          aria-label="Title"
          class="w-full bg-transparent text-lg font-semibold outline-none"
        />

        <label class="flex flex-1 flex-col gap-2">
          <span class="text-xs font-medium tracking-wide text-text-sub/70 uppercase">
            Description
          </span>
          <textarea
            v-model="description"
            placeholder="Add more detail…"
            class="min-h-40 flex-1 resize-none rounded-md border bg-transparent p-3
                   text-sm leading-relaxed outline-none transition-colors
                   placeholder:text-text-sub/40 focus:border-text-sub/50"
          />
        </label>
      </div>

      <footer class="flex h-14 shrink-0 items-center justify-between border-t pr-3 pl-6">
        <span class="font-mono text-xs text-text-sub/60">
          created {{ formatDate(card.createdAt) }}
        </span>
        <UiButton variant="danger" size="sm">Delete card</UiButton>
      </footer>
    </aside>
  </div>
</template>
