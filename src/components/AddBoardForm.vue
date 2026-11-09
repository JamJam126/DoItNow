<script setup lang="ts">
const emit = defineEmits<{ create: [name: string] }>()

const isOpen = ref(false)
const name = ref('')
const input = useTemplateRef('input')

async function open() {
  isOpen.value = true
  await nextTick()
  input.value?.focus()
}

function close() {
  name.value = ''
  isOpen.value = false
}

function create() {
  const trimmed = name.value.trim()
  if (trimmed) emit('create', trimmed)
  close()
}
</script>

<template>
  <div class="h-28">
    <div
      v-if="isOpen"
      class="flex h-full flex-col justify-between rounded-md border border-text-sub/50 p-4"
    >
      <input
        ref="input"
        v-model="name"
        spellcheck="false"
        placeholder="Board name"
        class="bg-transparent text-sm font-medium outline-none placeholder:text-text-sub/40"
        @keydown.enter="create"
        @keydown.esc="close"
        @blur="close"
      />
      <span class="font-mono text-[11px] text-text-sub/50">enter to create · esc to cancel</span>
    </div>

    <button
      v-else
      type="button"
      class="flex h-full w-full cursor-pointer items-center justify-center rounded-md border
             border-dashed text-sm text-text-sub transition-colors hover:bg-hover hover:text-text"
      @click="open"
    >
      + New board
    </button>
  </div>
</template>
