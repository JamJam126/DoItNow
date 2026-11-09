<script setup lang="ts">
const { label } = defineProps<{ label: string }>()
const title = defineModel<string>({ required: true })

const draft = ref(title.value)
const input = useTemplateRef('input')

watch(title, (latest) => {
  draft.value = latest
})

function save() {
  const trimmed = draft.value.trim()

  if (!trimmed) {
    draft.value = title.value
    return
  }

  title.value = trimmed
  draft.value = trimmed
}

function cancel() {
  draft.value = title.value
  input.value?.blur()
}
</script>

<template>
  <input
    ref="input"
    v-model="draft"
    spellcheck="false"
    :aria-label="label"
    class="-ml-1.5 min-w-0 max-w-full text-ellipsis rounded border border-transparent bg-transparent
           px-1.5 py-0.5 text-sm font-medium outline-none transition-colors field-sizing-content
           hover:bg-hover focus:border-text-sub/50 focus:bg-transparent"
    @blur="save"
    @keydown.enter="input?.blur()"
    @keydown.esc="cancel"
  />
</template>
