<script setup lang="ts">
const { columnId } = defineProps<{ columnId: string }>()
const emit = defineEmits<{ close: [] }>()

const { addCard } = useBoard()

const title = ref('')
const textarea = useTemplateRef('textarea')

onMounted(() => textarea.value?.focus())

function add() {
  const singleLine = title.value.replace(/\s+/g, ' ').trim()
  if (singleLine) addCard(columnId, singleLine)
  title.value = ''
}

function addAndClose() {
  add()
  emit('close')
}

function cancel() {
  title.value = ''
  emit('close')
}
</script>

<template>
  <div class="flex flex-col gap-1.5 transition starting:opacity-0">
    <textarea
      ref="textarea"
      v-model="title"
      rows="2"
      spellcheck="false"
      placeholder="Card title"
      class="w-full resize-none rounded-md border bg-hover/60 p-3 text-sm outline-none
             transition-colors placeholder:text-text-sub/40 focus:border-text-sub/50"
      @keydown.enter.prevent="add"
      @keydown.esc="cancel"
      @blur="addAndClose"
    />
    <span class="px-1 font-mono text-[11px] text-text-sub/50">enter to add · esc to close</span>
  </div>
</template>
