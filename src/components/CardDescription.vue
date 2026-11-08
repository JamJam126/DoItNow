<script setup lang="ts">
const description = defineModel<string>({ required: true })

const isEditing = ref(false)
const draft = ref('')
const textarea = useTemplateRef('textarea')

async function startEditing() {
  draft.value = description.value
  isEditing.value = true

  await nextTick()
  const box = textarea.value
  if (!box) return
  box.focus()
  box.setSelectionRange(box.value.length, box.value.length)
}

function save() {
  description.value = draft.value.trim()
  isEditing.value = false
}

function cancel() {
  isEditing.value = false
}
</script>

<template>
  <section class="flex flex-col gap-2">
    <h3 class="text-xs font-medium tracking-wide text-text-sub/70 uppercase">Description</h3>

    <template v-if="isEditing">
      <textarea
        ref="textarea"
        v-model="draft"
        placeholder="Add more detail…"
        class="-mx-3 min-h-24 resize-none field-sizing-content rounded-md border bg-transparent p-3
               text-sm leading-relaxed outline-none transition-colors
               placeholder:text-text-sub/40 focus:border-text-sub/50"
        @keydown.esc.stop="cancel"
        @keydown.ctrl.enter="save"
        @keydown.meta.enter="save"
      />

      <div
        class="flex items-center gap-2
               transition duration-200 starting:-translate-y-1 starting:opacity-0"
      >
        <span class="mr-auto font-mono text-[11px] text-text-sub/50">ctrl + enter to save</span>
        <UiButton variant="ghost" size="sm" @click="cancel">Cancel</UiButton>
        <UiButton variant="solid" size="sm" @click="save">Save</UiButton>
      </div>
    </template>

    <button
      v-else
      type="button"
      class="-mx-3 rounded-md border border-transparent p-3 text-left text-sm leading-relaxed
             transition-colors hover:bg-hover"
      @click="startEditing"
    >
      <p v-if="description" class="whitespace-pre-wrap">{{ description }}</p>
      <p v-else class="text-text-sub/50">Add a description…</p>
    </button>
  </section>
</template>
