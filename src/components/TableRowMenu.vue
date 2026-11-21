<script setup lang="ts">
const { cardTitle } = defineProps<{ cardTitle: string }>()
const emit = defineEmits<{ open: [], delete: [] }>()

const isOpen = ref(false)

function choose(action: 'open' | 'delete') {
  isOpen.value = false
  if (action === 'open') emit('open')
  else emit('delete')
}
</script>

<template>
  <div class="relative flex justify-end" @click.stop @keydown.esc.stop="isOpen = false">
    <UiButton
      variant="ghost"
      size="sm"
      :aria-label="`Options for ${cardTitle}`"
      aria-haspopup="menu"
      :aria-expanded="isOpen"
      @click="isOpen = !isOpen"
    >
      ⋮
    </UiButton>

    <template v-if="isOpen">
      <div class="fixed inset-0 z-10" @click="isOpen = false" />

      <div
        role="menu"
        class="absolute top-full right-0 z-20 mt-1 flex w-40 flex-col rounded-md border bg-primary p-1
               shadow-lg shadow-shadow transition starting:-translate-y-1 starting:opacity-0"
      >
        <button
          type="button"
          role="menuitem"
          class="cursor-pointer rounded px-2 py-1.5 text-left text-sm text-text-sub
                 transition-colors hover:bg-hover hover:text-text"
          @click="choose('open')"
        >
          Open
        </button>
        <button
          type="button"
          role="menuitem"
          class="cursor-pointer rounded px-2 py-1.5 text-left text-sm text-error
                 transition-colors hover:bg-error/10"
          @click="choose('delete')"
        >
          Delete card
        </button>
      </div>
    </template>
  </div>
</template>
