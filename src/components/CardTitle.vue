<script setup lang="ts">
const title = defineModel<string>({ required: true })

const draft = ref(title.value)
const box = useTemplateRef('box')

function save() {
  const singleLine = draft.value.replace(/\s+/g, ' ').trim()

  if (!singleLine) {
    draft.value = title.value
    return
  }

  title.value = singleLine
  draft.value = singleLine
}

function cancel() {
  draft.value = title.value
  box.value?.blur()
}

function fitHeightToText() {
  const element = box.value
  if (!element) return

  element.style.height = 'auto'
  const borders = element.offsetHeight - element.clientHeight
  element.style.height = `${element.scrollHeight + borders}px`
}

watch(draft, () => nextTick(fitHeightToText))
onMounted(fitHeightToText)
</script>

<template>
  <textarea
    ref="box"
    v-model="draft"
    rows="1"
    spellcheck="false"
    aria-label="Title"
    class="-mx-3 resize-none overflow-hidden rounded-md border border-transparent bg-transparent
           px-3 py-1.5 text-lg leading-snug font-semibold outline-none transition-colors
           hover:bg-hover focus:border-text-sub/50 focus:bg-transparent"
    @blur="save"
    @keydown.enter.prevent="box?.blur()"
    @keydown.esc.stop="cancel"
  />
</template>
