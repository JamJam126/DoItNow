<script setup lang="ts">
const { addColumn } = useBoard()

const isOpen = ref(false)
const title = ref('')
const input = useTemplateRef('input')

async function open() {
  isOpen.value = true
  await nextTick()
  input.value?.focus()
}

function close() {
  title.value = ''
  isOpen.value = false
}

function add() {
  const trimmed = title.value.trim()
  if (trimmed) addColumn(trimmed)
  close()
}
</script>

<template>
  <div class="w-72 max-w-[85vw] shrink-0 snap-start">
    <input
      v-if="isOpen"
      ref="input"
      v-model="title"
      spellcheck="false"
      placeholder="Column title"
      class="h-11 w-full rounded-md border bg-transparent px-3 text-sm outline-none
             transition-colors placeholder:text-text-sub/40 focus:border-text-sub/50"
      @keydown.enter="add"
      @keydown.esc="close"
      @blur="add"
    />

    <button
      v-else
      type="button"
      class="flex h-11 w-full items-center rounded-md border border-dashed px-3 text-sm
             text-text-sub transition-colors hover:bg-hover hover:text-text"
      @click="open"
    >
      + Add column
    </button>
  </div>
</template>
